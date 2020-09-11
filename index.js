const Express = require("express");
const loadFile = require("./load_file");

const PORT = 60606;
const app = Express();

const getAllGroups = () => loadFile("fsd", "groupIDs");

const getAllTypes = () => loadFile("fsd", "typeIDs");

const getAllBlueprints = () => loadFile("fsd", "blueprints");

const getTypesFor = async (category) => {
    const [groups, types] = await Promise.all([getAllGroups(), getAllTypes()]);
    const groupIds = groupIdsFor(category, groups);
    return typesForGroupIds(groupIds, types);
};

const groupIdsFor = (category, groups) => {
    return Object
        .entries(groups)
        .filter(([, g]) => g.categoryID === category)
        .map(([id]) => Number(id));
};

const typesForGroupIds = (groupIds, types) => {
    return Object
        .entries(types)
        .filter(([, t]) => groupIds.includes(t.groupID))
        .map(entityFromEntry)
};

const entityById = async (entityId, getAllEntities) => {
    const entities = await getAllEntities();
    const entity = entities[entityId];
    return entity ? entityFromEntry([entityId, entity]) : null;
};

const entityFromEntry = ([entityId, value]) => ({entityID: Number(entityId), ...value});

const GET = (route, handler) => {
    app.get(route, async (req, res) => res.send(await handler(req.params, req.query)));
};

GET("/types/:typeId", ({typeId}) => entityById(Number(typeId), getAllTypes));

GET("/types", (_, {category}) => category == null ? getAllTypes() : getTypesFor(Number(category)));

GET("/icons", () => loadFile("fsd", "iconIDs"));

GET("/blueprints/:blueprintId", ({blueprintId}) => entityById(Number(blueprintId), getAllBlueprints));

GET("/blueprints", getAllBlueprints);

GET("/certificates", () => loadFile("fsd", "certificates"));

GET("/graphics", () => loadFile("fsd", "graphicIDs"));

GET("/groups", getAllGroups);

GET("/skinMaterials", () => loadFile("fsd", "skinMaterials"));

GET("/skinLicenses", () => loadFile("fsd", "skinLicenses"));

GET("/skins", () => loadFile("fsd", "skins"));

GET("/landmarks", () => loadFile("fsd", "landmarks", "landmarks"));

GET("/region/:name", async ({name}) => {
    try {
        return await loadFile("fsd", "universe", "eve", name, "region");
    }
    catch(e) {
        return await loadFile("fsd", "universe", "wormhole", name, "region");
    }
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
