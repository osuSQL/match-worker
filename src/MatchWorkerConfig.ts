import { BanchoClientOptions } from "bancho.js";
import * as fs from "fs";
import * as _ from "lodash";

export class MatchWorkerConfig {
    public osu: BanchoClientOptions;

    constructor(load: boolean = true) {
        if(load)
            this.load();
    }

    public load(configPath: string = "config.json") {
        this.parseConfig(fs.readFileSync(configPath).toString(), fs.readFileSync("config.defaults.json").toString());
    }

    private parseConfig(fileContent: string, defaultFileContent: string) {
        const fileContentJson = JSON.parse(fileContent);
        const defaultFileContentJson = JSON.parse(defaultFileContent);

        const configObj = _.defaultsDeep(fileContentJson, defaultFileContentJson);

        this.osu = configObj.osu;
    }
}
