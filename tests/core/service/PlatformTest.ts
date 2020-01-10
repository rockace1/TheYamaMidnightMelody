import platform from '../../../src/core/service/Platform';

describe('Platform', () => {

    describe('#check platform service.', () => {
        it('getDestPath', async () => {
            let source = 'C:\\Users\\shiqiang\\Desktop\\excel-mini-source.xlsx';
            let dest = platform.getDestPath(source);
            console.log(`dest path: ${dest}`);
        });
    });
});