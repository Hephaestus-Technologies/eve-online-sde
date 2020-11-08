import BlueprintsApi from "./blueprints-api";
import ItemTypesApi from "./item-types-api";
import RestApi from "../utils/rest-api";
import SchematicsApi from "./schematics-api";
import ReactionsApi from "./reactions-api";

export default (endpoint: string) => {
    const restApi = new RestApi(endpoint);
    return {
        types: new ItemTypesApi(restApi),
        blueprints: new BlueprintsApi(restApi),
        schematics: new SchematicsApi(restApi),
        reactions: new ReactionsApi(restApi)
    };
}
