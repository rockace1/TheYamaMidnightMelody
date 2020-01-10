import { Sequelize, SequelizeOptions, ModelCtor } from 'sequelize-typescript';
import ColumnModel from '../model/ColumnModel';
import TemplateModel from '../model/TemplateModel';
import platform from '../entity/Platform';
import path from 'path';

let location: string = 'melody.db';
if (platform.isMac()) {
    location = path.join(process.env.HOME!, 'Library', 'Application Support', 'melody', location);
} else if (platform.isLinux()) {
    location = path.join(process.env.HOME!, '.config', location);
} else if (platform.isWin()) {
    location = path.join('./', location);
}

const options: SequelizeOptions = {
    database: 'melody_db',
    host: '127.0.0.1',
    dialect: 'sqlite',
    pool: {
        max: 5, min: 1, acquire: 30000, idle: 10000
    },
    define: {
        schema: 'melody'
    },
    storage: location,
}

const models = [TemplateModel, ColumnModel];

export class Connection extends Sequelize {
    private array: Array<ModelCtor>;

    constructor(options: SequelizeOptions, models: Array<ModelCtor>) {
        super(options);
        this.array = models;
    }

    async init(): Promise<void> {
        try {
            this.addModels(this.array);
            await this.authenticate();
            for (let i = 0; i < this.array.length; i++) {
                let m: ModelCtor = this.array[i];
                await m.sync();
            }
            console.debug('Connection has been established successfully.');
        } catch (err) {
            console.error('Unable to connect to the database:%s', err);
        }
    }
}

const DEFAULT_CONN = new Connection(options, models);

export default DEFAULT_CONN;