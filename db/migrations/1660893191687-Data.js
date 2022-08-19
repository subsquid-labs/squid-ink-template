module.exports = class Data1660893191687 {
  name = 'Data1660893191687'

  async up(db) {
    await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "contract" ("id" character varying NOT NULL, "balance" numeric NOT NULL, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "contract_historical_balance" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block" integer NOT NULL, "from_id" character varying, CONSTRAINT "PK_3f7584ac2440f2c59a0bece2fa1" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_252362f3733ce09ee4656c1d6d" ON "contract_historical_balance" ("from_id") `)
    await db.query(`ALTER TABLE "contract_historical_balance" ADD CONSTRAINT "FK_252362f3733ce09ee4656c1d6dd" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "account"`)
    await db.query(`DROP TABLE "contract"`)
    await db.query(`DROP TABLE "contract_historical_balance"`)
    await db.query(`DROP INDEX "public"."IDX_252362f3733ce09ee4656c1d6d"`)
    await db.query(`ALTER TABLE "contract_historical_balance" DROP CONSTRAINT "FK_252362f3733ce09ee4656c1d6dd"`)
  }
}
