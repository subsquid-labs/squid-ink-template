import {toHex} from '@subsquid/util-internal-hex'
import * as ss58 from '@subsquid/ss58'
import {lookupArchive} from '@subsquid/archive-registry'
import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'

export const SS58_NETWORK = 'astar' // used for the ss58 prefix, astar shares it with shibuya

const CONTRACT_ADDRESS_SS58 = 'XnrLUQucQvzp5kaaWLG9Q3LbZw5DPwpGn69B5YcywSWVr5w'
export const CONTRACT_ADDRESS = ss58.codec(SS58_NETWORK).decode(CONTRACT_ADDRESS_SS58)

console.log('CONTRACT_ADDRESS', CONTRACT_ADDRESS)

export const processor = new SubstrateBatchProcessor()
    .setDataSource({
        // Lookup archive by the network name in Subsquid registry
        // See https://docs.subsquid.io/substrate-indexing/supported-networks/
        archive: lookupArchive('shibuya', {release: 'ArrowSquid'}),
        // Chain RPC endpoint is required on Substrate
        chain: {
            // See https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
            url: 'https://shibuya.public.blastapi.io',
            rateLimit: 10
        }
    })
    .addContractsContractEmitted({
        contractAddress: [CONTRACT_ADDRESS],
        extrinsic: true
    })
    .setFields({
        block: {
            timestamp: true
        },
        extrinsic: {
            hash: true
        }
    })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
