import RestApi from "./utils/rest_api";
import SchematicAdapter from "./adapters/schematic-adapter";
import Blueprint from "@hephaestus-technologies/eve-entities/dist/manufacturing/blueprint";

export default class SchematicsApi {

    private _restApi: RestApi;

    public constructor(restApi: RestApi) {
        this._restApi = restApi;
    }

    public async getAll(): Promise<Blueprint[]> {
        const results = await this._restApi.get("schematics");
        const schematics = groupBy(results, r => r.schematicID);
        return schematics.map((g) => SchematicAdapter.toEntity(g.key, g.items));
    }

}

interface Grouping<T> {
    key: string,
    items: T[]
}

function groupBy<T>(arr: T[], key: (T) => string): Grouping<T>[] {
    const reducer = (groups: {}, item: T): {} => {
        const k = key(item);
        return {
            ...groups,
            [k]: [
                ...groups[k],
                item
            ]
        }
    };
    return Object.values(arr.reduce(reducer, {}));
}
