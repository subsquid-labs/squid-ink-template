import { lookupArchive } from "@subsquid/archive-registry";
import * as ss58 from "@subsquid/ss58";
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBatchProcessor,
} from "@subsquid/substrate-processor";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import { In } from "typeorm";
import * as metadata from "./abi/metadata";
import { Account, Contract, ContractHistoricalBalance } from "./model";

// AccountId to Hex ZXg5FUFdBdXqu1khRn4jxBzBZU5YTNF2ChY92z9WYsoRg5C
// https://www.shawntabrizi.com/substrate-js-utilities/
const CONTRACT_ADDRESS =
  "0x9eec5d6e82c946c2bd75f444b8612dc70099efae0ece45a0e68cef9d88cbef23";

const processor = new SubstrateBatchProcessor()
  .setDataSource({
    archive: lookupArchive("shibuya", { release: "FireSquid" }),
  })
  .addContractsContractEmitted(CONTRACT_ADDRESS, {
    data: {
      event: { args: true },
    },
  } as const);

type Item = BatchProcessorItem<typeof processor>;
type Ctx = BatchContext<Store, Item>;

processor.run(new TypeormDatabase(), async (ctx) => {
  let contract = await ctx.store.findOneBy(Contract, { id: CONTRACT_ADDRESS });

  if (contract == null) {
    contract = new Contract({ id: CONTRACT_ADDRESS, balance: 0n });
  }

  const valueTransfers = extractTransferRecords(ctx);

  const accountIds = new Set<string>();
  valueTransfers.forEach((tx) => {
    if (tx.from) {
      accountIds.add(tx.from);
    }
  });

  const accountsMap = await ctx.store
    .findBy(Account, {
      id: In([...accountIds]),
    })
    .then((accounts) => {
      return new Map(accounts.map((account) => [account.id, account]));
    });

  const contractHistoricalBalances = valueTransfers.map((tx) => {
    const valueTransfer = new ContractHistoricalBalance({
      id: tx.id,
      amount: tx.amount,
      block: tx.block,
      timestamp: tx.timestamp,
    });

    if (tx.from) {
      valueTransfer.from = accountsMap.get(tx.from);
      if (valueTransfer.from == null) {
        valueTransfer.from = new Account({ id: tx.from });
        accountsMap.set(tx.from, valueTransfer.from);
      }
    }

    if (contract) {
      contract.balance += tx.amount;
    }

    return valueTransfer;
  });

  await ctx.store.save([...accountsMap.values()]);
  await ctx.store.save(contract);
  await ctx.store.insert(contractHistoricalBalances);
});

interface TransferRecord {
  id: string;
  from?: string;
  amount: bigint;
  block: number;
  timestamp: Date;
}

function extractTransferRecords(ctx: Ctx): TransferRecord[] {
  const records: TransferRecord[] = [];
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (
        item.name === "Contracts.ContractEmitted" &&
        item.event.args.contract === CONTRACT_ADDRESS
      ) {
        const event = metadata.decodeEvent(item.event.args.data);
        if (event.__kind === "ValueTransferred") {
          records.push({
            id: item.event.id,
            from: event.from && ss58.codec(5).encode(event.from),
            // to: event.to && ss58.codec(5).encode(event.to),
            amount: event.value,
            block: block.header.height,
            timestamp: new Date(block.header.timestamp),
          });
        }
        if (event.__kind === "ValueUpdated") {
        }
      }
    }
  }
  return records;
}
