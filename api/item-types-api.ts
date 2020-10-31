import ItemTypeAdapter from "./adapters/item-type-adapter";
import RestApi from "./utils/rest_api";
import {Category} from "../records/category";
import ItemType from "@hephaestus-technologies/eve-entities/dist/general/item-type";

export default class ItemTypesApi {

    private _restApi: RestApi;

    public constructor(restApi: RestApi) {
        this._restApi = restApi;
    }

    public async byId(typeId: number): Promise<ItemType> {
        const result = await this._restApi.get(`types/${typeId}`);
        const adapter = new ItemTypeAdapter(result);
        return adapter.toEntity();
    }

    public async forCategory(category: Category): Promise<ItemType[]> {
        const result = await this._restApi.get("types", {category});
        return result.map(r => new ItemTypeAdapter(r)).map(a => a.toEntity());
    }

}
