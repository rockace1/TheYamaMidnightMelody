interface TempFile {
    id: number | null;
    path: string | null;
}

interface Transfer {
    source: string;
    dest: string;
    finished: boolean;
    tempId: number;
}

interface ExcelColumn {
    name: string | null;
    type: number | null;
}

interface TemplateRecord {
    id: number | null;
    name: string | null;
    date: string | null;
    columns: Array<ExcelColumn>
}

export { Transfer, TempFile, ExcelColumn, TemplateRecord }