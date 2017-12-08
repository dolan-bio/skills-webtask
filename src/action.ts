import * as request from "request";

import { ImageFetcher } from "./image-fetcher";
import { SkillsFetcher } from "./skill-fetcher";

interface ISkillCombinedResult {
    image: string;
    name: string;
}

export class SkillAction {
    private skillsFetcher: SkillsFetcher;
    private imageFetcher: ImageFetcher;
    private combinedObservable$: Observable<ISkillCombinedResult[]>;

    constructor(config: GoogleSearchConfig) {
        this.skillsFetcher = new SkillsFetcher();
        this.imageFetcher = new ImageFetcher(config);

        this.combinedObservable$ = this.skillsFetcher.Skills$.flatMap((skills) => {
            const observables: Observable<ISkillCombinedResult>[] = [];
            skills.forEach((skill) => {
                observables.push(this.imageFetcher.findImage(skill.name).flatMap((image) => {
                    const getAsObservable = Observable.bindCallback<[Error, request.RequestResponse, Buffer]>(request.get);
                    return getAsObservable({
                        url: image.url,
                        encoding: null,
                    }).map(([err, response, body]) => {
                        const type = response.headers["content-type"];
                        const prefix = "data:" + type + ";base64,";
                        const base64 = body.toString("base64");
                        return prefix + base64;
                    });
                }).map((base64) => {
                    return {
                        image: base64,
                        name: skill.name,
                    };
                }));
            });
            return Observable.forkJoin(observables);
        });
    }

    public get CombinedObservable$(): Observable<ISkillCombinedResult[]> {
        return this.combinedObservable$;
    }
}
