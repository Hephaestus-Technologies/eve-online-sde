import RestApi from "./utils/rest_api";
import BlueprintAdapter from "./adapters/blueprint-adapter";
import Activity from "@hephaestus-technologies/eve-entities/dist/manufacturing/activity";

export default class ReactionsApi {

    private _restApi: RestApi;

    public constructor(restApi: RestApi) {
        this._restApi = restApi;
    }

    public async getAll(): Promise<Activity[]> {
        const results = await this._restApi.get("blueprints");
        return Object
            .entries(results)
            .map(([id, r]) => new BlueprintAdapter(id, r))
            .map(a => a.toReaction());
    }

}
