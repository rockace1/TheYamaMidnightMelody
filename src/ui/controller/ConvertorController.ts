import { Doc } from '../../core/entity/Model';
import { Platform } from '../../core/entity/Platform';
import { Service, ConvertorCallback } from '../../core/service/Service';
const remote = window.require('electron').remote;
const platform: Platform = remote.require('../core/entity/Platform').default;
const service: Service = remote.require('../core/service/Service').default;

export interface ConvertorController {
    convert(data: Doc, index: number, callback: ConvertorCallback): void;
    isMac(): boolean;
    isLinux(): boolean;
    isWin(): boolean;
    getSep(): string;
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
    }
}

export default ConvertorControllerImpl;
