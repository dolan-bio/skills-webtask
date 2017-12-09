import "babel-polyfill";
import * as mongoose from "mongoose";

import { Skill } from "./skill-model";

module.exports = async (context, cb) => {
    mongoose.connect(context.secrets.MONGODB_URI);

    console.log("Getting skills");
    const data = await Skill.find();

    cb(null, data);
};
