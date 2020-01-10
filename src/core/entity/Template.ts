import Column from './Column';

export default interface Template {

    id?: number;
    name?: string;
    delimiter?: string;
    columns: Column[];
    date?: Date;

}