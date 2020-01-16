import { Template, Column } from '../../../src/core/entity/Model';
import Page from '../../../src/core/common/Page';
import repo from '../../../src/core/repo/TemplateRepo';
import rdb from '../../../src/core/connection/Rdb';

describe('Repo', () => {
    let id: number | undefined;

    describe('#check template repo.', () => {
        rdb.init();
        it('save', async () => {
            let col1: Column = { type: 1, name: 'col1' };
            let col2: Column = { type: 2, name: 'col2' };
            let col3: Column = { type: 3 };
            let template: Template = { columns: [col1, col2, col3], name: 'unit_test', delimiter: ',' };
            console.debug("perpare save:", JSON.stringify(template));
            await repo.save(template);
            console.debug(JSON.stringify(template));
            id = template.id;
        });
        it('query', async () => {
            let result: Page<Template> = await repo.query(1, 10);
            console.debug(JSON.stringify(result));
        });
        it('update', async () => {
            let col1: Column = { type: 1, name: 'col11' };
            let col2: Column = { type: 2, name: 'col21' };
            let col3: Column = { type: 3, name: 'col31' };
            let template: Template = { columns: [col1, col2, col3], name: 'unit_test2', delimiter: '.', id: id };
            await repo.update(template);
        });
        it('find', async () => {
            if (id === undefined) {
                return;
            }
            let result: Template | null = await repo.find(id);
            console.debug(JSON.stringify(result));
        });
        it('destroy', async () => {
            if (id === undefined) {
                return;
            }
            await repo.destroy(id);
        });
    });
});