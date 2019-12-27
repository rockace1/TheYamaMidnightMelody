interface TempFile {
    index: number | null;
    path: string | null;
}

interface Doc {
    source: string;
    dest: string;
    finished: boolean;
    tempId: number;
    tempName: string;
}

export { Doc, TempFile }