import path from 'path';
import { Doc } from '../entity/Model';
import Repo from '../repo/TemplateRepo';
import kit from '../common/Kit';
import serializer from '../func/Serializer';
import deserializer from '../func/Deserializer';
import MelodyException from '../common/Exception';

interface Convertor {
    convert(data: Doc, cb: Function): void;
}

const ConvertorImpl: Convertor = {
    convert(data: Doc, callback: Function): void {
        Repo.find(data.tempId!).then((template) => {
            if (kit.isNull(template)) {
                throw new MelodyException(`template ${data.tempId} not exist.`);
            }
            let source: string = path.normalize(data.source);
            let dest: string = path.normalize(data.dest);
            let param = { template: template!, source: source, dest: dest };
            let initData: any;
            deserializer.deserialize(source, () => {
                initData = serializer.prepare(param);
            }, (counter: number, data: any) => {
                serializer.write(counter, data, initData, template!);
            }, () => {
                serializer.finish(initData, callback);
            });
        }).catch((err) => {
            throw new MelodyException(`convert ${data.source} error.`, err);
        });
    }
}

export default ConvertorImpl;