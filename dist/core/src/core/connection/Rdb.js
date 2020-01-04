"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sequelize_typescript_1 = require("sequelize-typescript");
const ColumnModel_1 = tslib_1.__importDefault(require("../model/ColumnModel"));
const TemplateModel_1 = tslib_1.__importDefault(require("../model/TemplateModel"));
const path_1 = tslib_1.__importDefault(require("path"));
const platform = process.platform;
let location = 'melody.db';
if (platform === 'darwin') {
    location = path_1.default.join(process.env.HOME, 'Library', 'Application Support', 'melody', location);
}
else if (platform === 'linux') {
}
else if (platform === 'win32') {
}
const db = new sequelize_typescript_1.Sequelize({
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
});
exports.default = db;
const models = [TemplateModel_1.default, ColumnModel_1.default];
const init = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    try {
        db.addModels(models);
        yield db.authenticate();
        yield TemplateModel_1.default.sync();
        yield ColumnModel_1.default.sync();
        console.debug('Connection has been established successfully.');
    }
    catch (err) {
        console.error('Unable to connect to the database:%s', err);
    }
});
exports.init = init;
