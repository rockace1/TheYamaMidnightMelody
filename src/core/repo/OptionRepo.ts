import rdb from '../connection/Rdb';
import OptionTable from '../table/OptionTable';
import { Option } from '../entity/Model';
import MelodyException from '../common/Exception';

export interface OptionRepo {
    save(array: Option[]): Promise<void>;
    all(): Promise<Array<Option>>;
    find(key: number): Option | undefined;
}

let OptionCache: Map<number, Option> = new Map();

const OptionRepoImpl: OptionRepo = {
    async save(array: Option[]): Promise<void> {
        await rdb.transaction(async (t) => {
            await OptionTable.destroy({
                transaction: t
            });
            for (let data of array) {
                let result: OptionTable = await OptionTable.create<OptionTable>(data, { transaction: t });
                Object.assign(data, { id: result.id });
            }
            this.all();
        }).catch((err: Error) => {
            throw new MelodyException(`save option error.`, err);
        });
    },

    async all(): Promise<Option[]> {
        try {
            let result: OptionTable[] = await OptionTable.findAll({
                order: [
                    ['KEY', 'ASC']
                ]
            });
            let array: Option[] = [];
            OptionCache = new Map();
            for (let t of result) {
                let temp = { id: t.id, key: t.key, value: t.value };
                array.push(temp);
                OptionCache.set(t.key, t);
            }
            return array;
        } catch (err) {
            throw new MelodyException(`query all Option error.`, err);
        }
    },

    find(key: number): Option | undefined {
        return OptionCache.get(key);
    }
}

export default OptionRepoImpl;