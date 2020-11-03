import RestApi from "../utils/rest-api";
import Activity from "entities/manufacturing/activity";
import {toReactionEntity} from "../records/blueprint-record";

export default class ReactionsApi {

    private _restApi: RestApi;

    public constructor(restApi: RestApi) {
        this._restApi = restApi;
    }

    public async getAll(): Promise<Activity[]> {
        const results = await this._restApi.get("blueprints");
        return Object
            .values(results)
            .map(toReactionEntity);
    }

}
