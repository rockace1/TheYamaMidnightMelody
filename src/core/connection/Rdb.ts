import path from 'path';
import { Sequelize, SequelizeOptions, ModelCtor } from 'sequelize-typescript';
import ColumnTable from '../table/ColumnTable';
import TemplateTable from '../table/TemplateTable';
import OptionTable from '../table/OptionTable';
import platform from '../service/Platform';
import MelodyException from '../common/Exception';

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

const models = [TemplateTable, ColumnTable, OptionTable];

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
        } catch (err) {
            throw new MelodyException(`Unable to connect to the database:${options.database}`, err);
        }
    }
}

const DEFAULT_CONN = new Connection(options, models);

export default DEFAULT_CONN;