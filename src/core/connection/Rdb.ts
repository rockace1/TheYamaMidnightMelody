import { Sequelize } from 'sequelize-typescript';
import ColumnModel from '../model/ColumnModel';
import TemplateModel from '../model/TemplateModel';
import path from 'path';

const platform:string = process.platform;
let location = 'melody.db';
if(platform === 'darwin'){
    location = path.join(process.env.HOME!, 'Library', 'Application Support', 'melody', location);
}else if(platform === 'linux'){

}else if(platform === 'win32'){

}
console.log(location);

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
    storage: location,
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

export { db as default, init };