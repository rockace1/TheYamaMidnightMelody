import { Doc, Option } from '../../core/entity/Model';
import { Platform } from '../../core/service/Platform';
import { Service, ConvertorCallback } from '../../core/service/Service';
import { OptionKey } from "../../core/common/Constant";
import Kit from '../../core/common/Kit';
const remote = window.require('electron').remote;
const platform: Platform = remote.require('../core/service/Platform').default;
const service: Service = remote.require('../core/service/Service').default;

export interface ConvertorController {
    convert(data: Doc, index: number, callback: ConvertorCallback): void;
    isMac(): boolean;
    isLinux(): boolean;
    isWin(): boolean;
    getSep(): string;
    chooseFile(): string | undefined;
    getDestPath(source: string): string;
}

const ConvertorControllerImpl: ConvertorController = {
    convert(data: Doc, index: number, callback: ConvertorCallback): void {
        service.convertDoc({ index, data }, callback);
    },

    isMac(): boolean {
        let result: boolean = platform.isMac();
        return result;
    },

    isLinux(): boolean {
        let result: boolean = platform.isLinux();
        return result;
    },

    isWin(): boolean {
        let result: boolean = platform.isWin();
        return result;
    },

    getSep(): string {
        let result: string = platform.sep();
        return result;
    },
    chooseFile(): string | undefined {
        let name = 'Text';
        let extOption = service.findOption(OptionKey.EXT);
        let ext = parseExtStr(extOption);
        let pathOption = service.findOption(OptionKey.BASE_FOLDER);
        let defaultPath = Kit.isNull(pathOption) ? undefined : pathOption.value;
        let result = platform.chooseFile(name, ext, true, false, true, false, defaultPath);
        if (result && result.length > 0) {
            return result[0];
        }
    },
    getDestPath(source: string): string {
        return platform.getDestPath(source);
    }
}

function parseExtStr(option: Option): string[] {
    let ext = [];
    if (Kit.isNotNull(option)) {
        let str: string = option.value;
        let array: string[] = str.split(',');
        for (let s of array) {
            ext.push(s);
        }
    } else {
        ext = ['txt'];
    }
    return ext;
}

export default ConvertorControllerImpl;
