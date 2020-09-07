const loadFile = require("./load_file");

const memoize = (func) => {
    const results = {};
    return async (...args) => {
        const key = args.length ? args.join("") : "__empty__";
        if (!results[key])  results[key] = await func(...args) || "__empty__";
        return results[key] ;
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

exports.region = memoize(async (name) => {
    try {
        return await loadFile("fsd", "universe", "eve", name, "region")
    }
    catch(e) {
        return await loadFile("fsd", "universe", "wormhole", name, "region");
    }
});

exports.lookup = memoize(async (query, lang = "en") => {
    const types = await exports.types();
    return Object.entries(types).filter(matches(query, lang));
});

const matches = (query, lang) => ([, type]) => {
    return type.name && type.name[lang] && type.name[lang].includes( query );
};

exports.lookupById = memoize(async (id) => {
    const types = await exports.types();
    return types[id] || null;
});
