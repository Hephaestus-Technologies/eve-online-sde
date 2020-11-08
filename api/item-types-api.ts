import RestApi from "../utils/rest-api";
import {Category} from "../records/category";
import ItemType from "entities/dist/node/general/item-type";
import {toItemTypeEntity} from "../records/item-type-record";

export default class ItemTypesApi {

    private _restApi: RestApi;

    public constructor(restApi: RestApi) {
        this._restApi = restApi;
    }

    public async byId(typeId: number): Promise<ItemType> {
        const record = await this._restApi.get(`types/${typeId}`);
        return toItemTypeEntity(record);
    }

    public async forCategory(category: Category): Promise<ItemType[]> {
        const records = await this._restApi.get("types", {category});
        return records.map(toItemTypeEntity);
    }

}
