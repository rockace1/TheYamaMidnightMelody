export interface TempFile {
    index: number | null;
    path: string | null;
}

export interface Doc {
    source: string;
    dest: string;
    finished: boolean;
    tempId: number;
    tempName: string;
}

export interface Column {
    tempId?: number;
    name?: string;
    type: number;
}

export interface Template {
    id?: number;
    name?: string;
    delimiter: string;
    columns: Column[];
    date?: Date;
}

export interface Option {
    id: number;
    key: number;
    value?: string;
}