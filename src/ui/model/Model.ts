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

export { Transfer, TempFile }