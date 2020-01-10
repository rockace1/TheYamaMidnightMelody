import service from '../../../src/core/service/Service';
import { Doc } from '../../../src/core/entity/Model';
import convertor from '../../../src/core/service/Convertor';

const path = 'C:\\Users\\shiqiang\\Desktop\\excel-mini.txt';

describe('Xlsx', () => {

    describe('#check xlsx handler.', () => {
        it('read file', async () => {
            service.initDatabase();
            let dest = 'C:\\Users\\shiqiang\\Desktop\\excel-mini-dest.xlsx';
            let doc: Doc = { source: path, dest: dest, finished: false, tempId: 25, tempName: '' };
            convertor.convert(doc, () => {
                console.debug('success.');
            });
        });
    });
});
