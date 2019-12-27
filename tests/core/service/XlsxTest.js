"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const Rdb_1 = require("../../../src/core/connection/Rdb");
const Convertor_1 = tslib_1.__importDefault(require("../../../src/core/service/Convertor"));
const path = 'C:\\Users\\shiqiang\\Desktop\\excel-mini.txt';
describe('Xlsx', () => {
    describe('#check xlsx handler.', () => {
        it('read file', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            Rdb_1.init();
            let dest = 'C:\\Users\\shiqiang\\Desktop\\excel-mini-dest.xlsx';
            let doc = { source: path, dest: dest, finished: false, tempId: 25, tempName: '' };
            Convertor_1.default.convert(doc, () => {
                console.log('success.');
            });
        }));
    });
});
//# sourceMappingURL=XlsxTest.js.map