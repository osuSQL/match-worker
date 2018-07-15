import { BanchoClient as BanchojsClient, BanchoUser } from "bancho.js";
import * as winston from "winston";
import { Permission } from "./common/enums";
import { MatchWorker } from "./MatchWorker";

export class BanchoClient {
    public instance: BanchojsClient;
    private logger: winston.Logger = MatchWorker.getLogger("bancho");

    public constructor(app: MatchWorker) {
        this.instance = new BanchojsClient(app.config.osu);
        this.instance.on("connected", () => {
            this.logger.info("Connected to Bancho!");
        });
        this.instance.on("disconnected", (err) => {
            this.logger.warn("Disconnected from Bancho!", err);
        });
    }

    public async connect() {
        return await this.instance.connect();
    }

    public async disconnect() {
        return await this.instance.disconnect();
    }

    public getPermission(user: BanchoUser): Permission {
        switch(user.ircUsername) {
            case "ThePooN":
            case "Ascendance":
            case "Yauxo":
                return Permission.Admin;
            default:
                return Permission.None;
        }
    }
}
