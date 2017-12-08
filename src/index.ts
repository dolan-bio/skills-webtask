import "babel-polyfill";
import * as mongoose from "mongoose";
import * as logger from "winston";

import { SkillAction } from "./action";

module.exports = async (context, cb) => {
    mongoose.connect(context.secrets.MONGODB_URI);

    logger.debug("Getting skills");
    const action = new SkillAction({
        customSearchEngineId: context.secrets.CSE_ID,
        apiKey: context.secrets.API_KEY,
    });

    action.CombinedObservable$.subscribe((data) => {
        cb(null, data);
    }, (err) => {
        logger.error(err);
        const errorResponse: ServerError = {
            message: "Something went wrong with the server",
        };
        cb(errorResponse);
    });
};
