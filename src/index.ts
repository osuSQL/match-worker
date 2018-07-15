import { MatchWorker } from "./MatchWorker";

const app = MatchWorker.instance;
app.start();

process.on("SIGINT", async () => {
    await app.stop();
    process.exit(0);
});
