import ItemTypesApi from "./item-types-api";
import BlueprintsApi from "./blueprints-api";
import SchematicsApi from "./schematics-api";
import ReactionsApi from "./reactions-api";

export default interface ISdeApi {

    types: ItemTypesApi;

    blueprints: BlueprintsApi;

    schematics: SchematicsApi;

    reactions: ReactionsApi;

}
