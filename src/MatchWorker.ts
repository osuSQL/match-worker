import * as winston from "winston";
import * as winstonDailyRotateFile from "winston-daily-rotate-file";
import { BanchoClient } from "./common/BanchoClient";
import { MatchWorkerConfig } from "./MatchWorkerConfig";

export class MatchWorker {
    public static loggerTransports = [
        new winston.transports.Console({ level: "silly" }),
        new winstonDailyRotateFile({
            dirname: "logs/",
            filename: "%DATE%.log",
            level: "info",
        }),
    ];

    public config = new MatchWorkerConfig();
    public bancho = new BanchoClient(this.config.osu, MatchWorker.getLogger("bancho"));
    public logger = MatchWorker.getLogger();

    public async start() {
        await this.bancho.connect();
        this.logger.info("MatchWorker started!");
    }

    public async stop() {
        await this.bancho.disconnect();
        this.logger.info("MatchWorker stopped!");
    }

    public static getLogger(label?: string): winston.Logger {
        return winston.createLogger({
            format: winston.format.combine(
                winston.format.label({ label }),
                winston.format.timestamp(),
                winston.format.json(),
            ),
            transports: MatchWorker.loggerTransports,
        });
    }
}
