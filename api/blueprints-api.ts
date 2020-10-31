import Blueprint from "@hephaestus-technologies/eve-entities/dist/manufacturing/blueprint";
import BlueprintAdapter from "./adapters/blueprint-adapter";
import RestApi from "./utils/rest_api";

export default class BlueprintsApi {

    private _restApi: RestApi;

    public constructor(restApi: RestApi) {
        this._restApi = restApi;
    }

    public async getAll(): Promise<Blueprint[]> {
        const results = await this._restApi.get("blueprints");
        return Object
            .entries(results)
            .map(([id, r]) => new BlueprintAdapter(id, r))
            .map(a => a.toBlueprint());
    }

    public async byId(blueprintId: number): Promise<BlueprintAdapter> {
        const {entityID, ...result} = await this._restApi.get(`blueprints/${blueprintId}`);
        return new BlueprintAdapter(entityID, result);
    }
}
