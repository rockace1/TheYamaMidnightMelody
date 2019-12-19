import Column from '../../../src/core/entity/Column';
import Template from '../../../src/core/entity/Template';
import Page from '../../../src/core/entity/Page';
import repo from '../../../src/core/repo/TemplateRepo';

describe('Repo', () => {
    let id: number | undefined;

    describe('#check template repo.', () => {
        it('save', async () => {
            let col1: Column = new Column('col1', 1);
            let col2: Column = new Column('col2', 2);
            let col3: Column = new Column('col3', 3);
            let template: Template = new Template('unit_test', new Date(), [col1, col2, col3]);
            console.log("perpare save:", JSON.stringify(template));
            await repo.save(template);
            console.log(JSON.stringify(template));
            id = template.getId();
        });
        it('query', async () => {
            let result: Page<Template> = await repo.query(1, 10);
            console.log(JSON.stringify(result));
        });
        it('find', async () => {
            if (id === undefined) {
                return;
            }
            let result: Template | null = await repo.find(id);
            console.log(JSON.stringify(result));
        });
        it('destroy', async () => {
            if (id === undefined) {
                return;
            }
            await repo.destroy(id);
        });
    });
});