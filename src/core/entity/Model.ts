export interface Doc {
    source: string;
    dest: string;
    finished: boolean;
    tempId?: number;
    tempName?: string;
    tempIndex?: number;
}

export interface ColumnProp {
    decimalPlaces?: number;
    symbol?: string;
    isNum?: boolean;
    digits?: number;
}

export interface Column {
    tempId?: number;
    name?: string;
    type: number;
    fmt?: string;
    prop_str?: string;
    prop?: ColumnProp;
}

export interface Template {
    id?: number;
    name?: string;
    delimiter: string;
    columns: Column[];
    date?: Date;
}

export interface Option {
    id?: number;
    key: number;
    value?: string;
}