"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const ColumnModel_1 = tslib_1.__importDefault(require("../model/ColumnModel"));
const TemplateModel_1 = tslib_1.__importDefault(require("../model/TemplateModel"));
const Platform_1 = tslib_1.__importDefault(require("../entity/Platform"));
const path_1 = tslib_1.__importDefault(require("path"));
let location = 'melody.db';
if (Platform_1.default.isMac()) {
    location = path_1.default.join(process.env.HOME, 'Library', 'Application Support', 'melody', location);
}
else if (Platform_1.default.isLinux()) {
    location = path_1.default.join(process.env.HOME, '.config', location);
}
else if (Platform_1.default.isWin()) {
    location = path_1.default.join('./', location);
}
const options = {
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
};
const models = [TemplateModel_1.default, ColumnModel_1.default];
class Connection extends sequelize_typescript_1.Sequelize {
    constructor(options, models) {
        super(options);
        this.array = models;
    }
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                this.addModels(this.array);
                yield this.authenticate();
                for (let i = 0; i < this.array.length; i++) {
                    let m = this.array[i];
                    yield m.sync();
                }
                console.debug('Connection has been established successfully.');
            }
            catch (err) {
                console.error('Unable to connect to the database:%s', err);
            }
        });
    }
}
exports.Connection = Connection;
const DEFAULT_CONN = new Connection(options, models);
exports.default = DEFAULT_CONN;
