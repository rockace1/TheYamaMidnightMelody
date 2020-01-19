import { Option } from '../../core/entity/Model';
import { Platform } from '../../core/service/Platform';
import { Service } from '../../core/service/Service';
const remote = window.require('electron').remote;
const platform: Platform = remote.require('../core/service/Platform').default;
const service: Service = remote.require('../core/service/Service').default;

export interface OptionController {
    chooseFile(): string | undefined;
    save(data: any): Promise<void>;
    all(): Promise<Option[]>;
}

const OptionControllerImpl: OptionController = {
    async save(data: any): Promise<void> {
        try {
            await service.saveOption(data);
        } catch (err) {
            return err;
        }
    },

    async all(): Promise<Option[]> {
        try {
            let data: Option[] = await service.allOption();
            return data;
        } catch (err) {
            return err;
        }
    },

    chooseFile(): string | undefined {
        let name = 'Folder';
        let ext = [];
        let result = platform.chooseFile(name, ext, false, true, false, false);
        if (result && result.length > 0) {
            return result[0];
        }
    }
}

export default OptionControllerImpl;
