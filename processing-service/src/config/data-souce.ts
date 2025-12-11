import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.OUTBOX_DB_HOST || 'outbox_db',
    port: Number(process.env.OUTBOX_DB_PORT) || 5432,
    username: process.env.OUTBOX_DB_USER || 'outbox',
    password: process.env.OUTBOX_DB_PASSWORD || '1234',
    database: process.env.OUTBOX_DB_NAME || 'outbox_db',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../**/*.migrations{.ts,.js}'],
    schema: 'public',
    synchronize: true,
    logging: true,
    migrationsRun: true,
});
