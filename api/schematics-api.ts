import RestApi from "../utils/rest-api";
import {SchematicRecord, toActivityEntity} from "../records/schematic-record";
import Activity from "@hephaestus-technologies/eve-entities/dist/manufacturing/activity";
import {groupBy} from "../utils/group-by";

export default class SchematicsApi {

    private _restApi: RestApi;

    public constructor(restApi: RestApi) {
        this._restApi = restApi;
    }

    public async getAll(): Promise<Activity[]> {
        const records = await this._getRaw();
        const schematics = groupBy(records, r => r.schematicID);
        return schematics.map(g => toActivityEntity(g.items));
    }

    private _getRaw(): Promise<SchematicRecord[]> {
        return this._restApi.get("schematics");
    }

}
