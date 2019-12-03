const loadFile = require("./load_file");

const memoize = (func) => {
    let result;
    let run = false;
    return () => {
        if (run) return result;
        run = true;
        result = func();
        return result;
    }
};

const fdeMap = {
    "types": "typeIDs",
    "icons": "iconIDs",
    "categories": "categoryIDs",
    "blueprints": "blueprints",
    "certificates": "certificates",
    "graphics": "graphicIDs",
    "groups": "groupIDs",
    "skinMaterials": "skinMaterials",
    "skinLicenses": "skinLicenses",
    "skins": "skins",
    "tournamentRules": "tournamentRuleSets"
};

for (const key of Object.keys(fdeMap)) {
    exports[key] = memoize(() => loadFile("fsd", fdeMap[key]));
}

exports.landmarks = memoize(() => loadFile("fsd", "landmarks", "landmarks"));

exports.region = async (name) => {
    try {
        return await loadFile("fsd", "universe", "eve", name, "region")
    }
    catch(e) {
        return await loadFile("fsd", "universe", "wormhole", name, "region");
    }
};

exports.lookup = async (query, lang = "en") => {
    const types = await exports.types();
    return Object.entries(types).filter(matches(query, lang));
};

const matches = (query, lang) => ([, type]) => type.name[lang].includes(query);

exports.lookupById = async (id) => {
    const types = await exports.types();
    return types[id] || null;
};
