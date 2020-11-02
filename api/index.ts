import BlueprintsApi from "./blueprints-api";
import ItemTypesApi from "./item-types-api";
import RestApi from "../utils/rest-api";
import SchematicsApi from "./schematics-api";
import ReactionsApi from "./reactions-api";

export default () => {
    const restApi = new RestApi("http://localhost:60606");
    return {
        types: new ItemTypesApi(restApi),
        blueprints: new BlueprintsApi(restApi),
        schematics: new SchematicsApi(restApi),
        reactions: new ReactionsApi(restApi)
    };
}
