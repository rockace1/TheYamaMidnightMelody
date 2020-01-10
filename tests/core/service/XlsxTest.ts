import { init } from '../../../src/core/connection/Rdb';
import { Doc } from '../../../src/core/entity/Model';
import service from '../../../src/core/service/Convertor';

const path = 'C:\\Users\\shiqiang\\Desktop\\excel-mini.txt';

describe('Xlsx', () => {

    describe('#check xlsx handler.', () => {
        it('read file', async () => {
            init();
            let dest = 'C:\\Users\\shiqiang\\Desktop\\excel-mini-dest.xlsx';
            let doc: Doc = { source: path, dest: dest, finished: false, tempId: 25, tempName: '' };
            service.convert(doc, () => {
                console.debug('success.');
            });
        });
    });
});
