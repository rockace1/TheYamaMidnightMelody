import Column from '../../../src/core/entity/Column';
import Template from '../../../src/core/entity/Template';
import Page from '../../../src/core/entity/Page';
import repo from '../../../src/core/repo/TemplateRepo';

describe('Repo', () => {
    let id: number | undefined;

    describe('#check template repo.', () => {
        it('save', async () => {
            let col1: Column = new Column(1, 'col1');
            let col2: Column = new Column(2, 'col2');
            let col3: Column = new Column(3);
            let template: Template = new Template([col1, col2, col3], 'unit_test', ',');
            console.debug("perpare save:", JSON.stringify(template));
            await repo.save(template);
            console.debug(JSON.stringify(template));
            id = template.getId();
        });
        it('query', async () => {
            let result: Page<Template> = await repo.query(1, 10);
            console.debug(JSON.stringify(result));
        });
        it('update', async () => {
            let col1: Column = new Column(1, 'col11');
            let col2: Column = new Column(2, 'col21');
            let col3: Column = new Column(3, 'col31');
            let template: Template = new Template([col1, col2, col3], 'unit_test2', '.', id);
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