const loadFile = require("./load_file");

exports.types = () => loadFile("fsd", "typeIDs");

exports.icons = () => loadFile("fsd", "iconIDs");

exports.blueprints = () => loadFile("fsd", "blueprints");

exports.certificates = () => loadFile("fsd", "certificates");

exports.graphics = () => loadFile("fsd", "graphicIDs");

exports.groups = () => loadFile("fsd", "groupIDs");

exports.skinMaterials = () => loadFile("fsd", "skinMaterials");

exports.skinLicenses = () => loadFile("fsd", "skinLicenses");

exports.skins = () => loadFile("fsd", "skins");

exports.landmarks = () => loadFile("fsd", "landmarks", "landmarks");

exports.region = async (name) => {
    try {
        return await loadFile("fsd", "universe", "eve", name, "region");
    }
    catch(e) {
        return await loadFile("fsd", "universe", "wormhole", name, "region");
    }
};

exports.lookup = async (query, lang = "en") => {
    return Object
        .entries(await exports.types())
        .filter(matches(query, lang))
        .map(([id, value]) => ({...value, id: Number(id)}));
};

const matches = (query, lang) => ([, type]) => {
    return type.name && type.name[lang] && type.name[lang].includes( query );
};

exports.typesForCategory = async (category) => {
    const [groups, types] = await Promise.all([exports.groups(), exports.types()]);
    const groupIds = Object
        .entries(groups)
        .filter(([,g]) => g.categoryID === category)
        .map(([id]) => id);
    return Object
        .entries(types)
        .filter(([,t]) => groupIds.includes(t.groupID))
        .map((id, t) => ({id: Number(id), ...t}));
};

exports.lookupById = async (id) => {
    const types = await exports.types();
    const result = types[id];
    if (!result) return null;
    return {...result, id: Number(id)};
};
