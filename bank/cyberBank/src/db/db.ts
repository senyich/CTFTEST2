import { DataSource } from "typeorm";
import Env from "../env";
import Const from "../strings";


const AppDataSource = new DataSource({
    type: "postgres",
    host: "cyber-bank-postgres",
    port: 5432,
    username: Env.DB_USER,
    password: Env.DB_PASS,
    database: Env.DB_NAME,
    logging: Env.DEBUG !== "false",
    synchronize: false,
    entities: ["build/db/entity/*{.js,.ts}"],
    migrations: ["build/db/migration/*{.js,.ts}"],
});

AppDataSource.initialize()
    .then(() => {
        console.log(Const.DATA_SOURCE_INITIALIZED);
    })
    .catch((err: any) => {
        console.error(Const.DATA_SOURCE_NOT_INITIALIZED, err);
    });

export {AppDataSource}