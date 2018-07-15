import promiseRouter from "express-promise-router";
import { APIError } from "../common/APIError";

export const router = promiseRouter();

router.get("/", (req, res) => res.json({error: false, message: "Hello World!"}));

router.use("*", () => { throw APIError.NOT_FOUND; });
router.use((err, req, res, next) => {
    if(err) {
        if(err instanceof APIError) {
            if(!res.headersSent)
                res.status(err.httpCode).json({error: err.name});
        }
    } else
        next();
});
