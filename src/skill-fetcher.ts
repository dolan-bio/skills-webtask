import { ISkillDocument, Skill } from "./skill-model";

export class SkillsFetcher {

    public async fetch(): Promise<ISkillDocument[]> {
        return Skill.find();
    }
}
