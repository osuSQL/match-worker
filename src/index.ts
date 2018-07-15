import { MatchWorker } from "./MatchWorker";

const app = new MatchWorker();
app.start();

process.on("SIGINT", async () => {
    await app.stop();
    process.exit(0);
});
