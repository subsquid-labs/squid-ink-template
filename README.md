# WASM squid template (FireSquid edition)

This is a squid template for indexing Ink!-based contracts, supported e..g by the Astar and Shibuya network. 
This template indexes a sample ERC-20 Ink!-based smart contract token transfers over the [Shibuya network](https://docs.astar.network/docs/quickstart/endpoints) and serves them via graphql API.

For more details, inspect the [Squid SDK docs](https://docs.subsquid.io/develop-a-squid/substrate-processor/wasm-support/) and an [Ink! indexing tutorial](https://docs.subsquid.io/tutorials/create-a-wasm-processing-squid/).

## Quickstart

```bash
# 1. Update Squid SDK and install dependencies
npm run update
npm ci


# 2. Compile typescript files
make build

# 3. Start target Postgres database and detach
make up

# 4. Start the processor
make process

# 5. The command above will block the terminal
#    being busy with fetching the chain data, 
#    transforming and storing it in the target database.
#
#    To start the graphql server open the separate terminal
#    and run
make serve
```

## Dev flow

### 1. Define database schema

Start development by defining the schema of the target database via `schema.graphql`.
Schema definition consists of regular graphql type declarations annotated with custom directives.
Full description of `schema.graphql` dialect is available [here](http://localhost:3001/develop-a-squid/schema-file/).

### 2. Generate TypeORM classes

Mapping developers use TypeORM [EntityManager](https://typeorm.io/#/working-with-entity-manager)
to interact with the target database. All the necessary entity classes are
generated from `schema.graphql`. This is done by running 
```
npx sqd codegen
```

### 3. Generate database migration

All database changes are applied through migration files located at `db/migrations`.
`squid-typeorm-migration(1)` tool provides several commands to drive the process.
It is all [TypeORM](https://typeorm.io/#/migrations) under the hood.

```bash
# Connect to database, analyze its state and generate migration to match the target schema.
# The target schema is derived from entity classes generated earlier.
# Don't forget to compile your entity classes beforehand!
npx squid-typeorm-migration generate

# Create template file for custom database changes
npx squid-typeorm-migration create

# Apply database migrations from `db/migrations`
npx squid-typeorm-migration apply

# Revert the last performed migration
npx squid-typeorm-migration revert   
```

### 4. Import ABI contract and generate interfaces to decode events

It is necessary to import the respective ABI definition to decode WASM logs. For this template we used standard ERC20 interface, see [`assets/erc20.json`](assets/erc20.json).

To generate a type-safe facade class to decode EVM logs, use `squid-ink-typegen(1)`:

```bash
npx squid-ink-typegen --abi assets/erc20.json --output src/abi/erc20.ts
```

## Project conventions

Squid tools assume a certain project layout.

* All compiled js files must reside in `lib` and all TypeScript sources in `src`.
The layout of `lib` must reflect `src`.
* All TypeORM classes must be exported by `src/model/index.ts` (`lib/model` module).
* Database schema must be defined in `schema.graphql`.
* Database migrations must reside in `db/migrations` and must be plain js files.
* `sqd(1)` and `squid-*(1)` executables consult `.env` file for a number of environment variables.

## Graphql server extensions

It is possible to extend `squid-graphql-server(1)` with custom
[type-graphql](https://typegraphql.com) resolvers and to add request validation.
More details will be added later.

