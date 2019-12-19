import { Sequelize } from 'sequelize-typescript';
import ColumnModel from '../model/ColumnModel';
import TemplateModel from '../model/TemplateModel';

const db = new Sequelize({
    database: 'melody_db',
    host: '127.0.0.1',
    dialect: 'sqlite',
    pool: {
        max: 5, min: 1, acquire: 30000, idle: 10000
    },
    define: {
        schema: 'melody'
    },
    storage: './melody.db',
});

const models = [TemplateModel, ColumnModel];

const init = async () => {
    try {
        db.addModels(models);
        await db.authenticate();
        await TemplateModel.sync();
        await ColumnModel.sync();
        console.debug('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:%s', err);
    }
};

init();

export default db;