import fs from 'fs';
import lineReader from 'readline';
import MelodyException from '../common/Exception';

export interface WriteCallback {
    (counter: number, data: any): void
}

export interface Deserializer {
    deserialize(source: string, prepare: Function, write: WriteCallback, finish: Function): void;
}

const DeserializerImpl: Deserializer = {

    deserialize(source: string, prepare: Function, write: WriteCallback, finish: Function): void {
        try {
            let reader: lineReader.Interface = lineReader.createInterface({
                input: fs.createReadStream(source, { encoding: 'utf8' })
            });
            let index = 0;
            prepare();
            reader.on('line', (line) => {
                write(index++, line);
            });
            reader.on('close', () => {
                finish();
            });
        } catch (err) {
            throw new MelodyException(`deserialize ${source} error.`, err);
        }
    }
}

export default DeserializerImpl;