import Blueprint from "entities/dist/node/manufacturing/blueprint";
import RestApi from "../utils/rest-api";
import {toBlueprintEntity} from "../records/blueprint-record";

export default class BlueprintsApi {

    private _restApi: RestApi;

    public constructor(restApi: RestApi) {
        this._restApi = restApi;
    }

    public async getAll(): Promise<Blueprint[]> {
        return Object
            .entries(await this._getRaw(""))
            .map(BlueprintsApi.castToRecord)
            .map(([id, record]) => toBlueprintEntity(id, record))
            .filter(Boolean);
    }

    private static castToRecord([entityID, record]): [any, any] {
        return [entityID, record];
    };

    public async byId(blueprintId: number): Promise<Blueprint> {
        const {entityID, ...record} = await this._getRaw(`/${blueprintId}`);
        return toBlueprintEntity(entityID, record);
    }

    private _getRaw(url: string) {
        return this._restApi.get(`blueprints${url}`);
    }

}
