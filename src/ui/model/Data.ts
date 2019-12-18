import { TemplateRecord, Transfer } from './Model';

const TransferArray: Array<Transfer> = [
    {
        source: "D:\\Documents\\家乡荣耀地点词典.txt",
        dest: "D:\\Documents\\家乡荣耀地点词典.xlsx",
        finished: false,
        tempId: 1
    },
    {
        source: "D:\\Documents\\家乡荣耀地点词典1.txt",
        dest: "D:\\Documents\\家乡荣耀地点词典2.xlsx",
        finished: false,
        tempId: 2
    }
];

const TemplateRecordArray: Array<TemplateRecord> = [
    {
        id: 100,
        date: "2016-05-02",
        name: "上海市普陀区金沙江路 1518 弄",
        columns: []
    },
    {
        id: 101,
        date: "2016-05-04",
        name: "上海市普陀区金沙江路 1517 弄",
        columns: []
    },
    {
        id: 102,
        date: "2016-05-01",
        name: "上海市普陀区金沙江路 1519 弄",
        columns: []
    },
    {
        id: 103,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1516 弄",
        columns: []
    },
    {
        id: 104,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1515 弄",
        columns: []
    },
    {
        id: 105,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1514 弄",
        columns: []
    },
    {
        id: 106,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1513 弄",
        columns: []
    },
    {
        id: 107,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1512 弄",
        columns: []
    },
    {
        id: 108,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1511 弄",
        columns: []
    },
    {
        id: 109,
        date: "2016-05-03",
        name: "上海市普陀区金沙江路 1510 弄",
        columns: []
    }
];

export { TemplateRecordArray, TransferArray }