import * as express from "express";
import * as winston from "winston";
import * as winstonDailyRotateFile from "winston-daily-rotate-file";
import { BanchoClient } from "./common/BanchoClient";
import { MatchWorkerConfig } from "./MatchWorkerConfig";
import { router } from "./router";

export class MatchWorker {

    public static loggerTransports = [
        new winston.transports.Console({ level: "silly" }),
        new winstonDailyRotateFile({
            dirname: "logs/",
            filename: "%DATE%.log",
            level: "info",
        }),
    ];
    public static instance = new MatchWorker();

    public config = new MatchWorkerConfig();
    public bancho = new BanchoClient(this.config.osu, MatchWorker.getLogger("bancho"));
    public express = express();
    public logger = MatchWorker.getLogger();

    private constructor() {
        this.express.use("/", router);
    }

    public start() {
        return new Promise((resolve, reject) => {
            this.express.listen(this.config.http.port, this.config.http.host, async (err) => {
                if(err)
                    return reject(err);
                await this.bancho.connect();
                this.logger.info("MatchWorker started!");
                resolve();
            });
        });
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
