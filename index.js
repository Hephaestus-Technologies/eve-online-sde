const loadFile = require("./load_file");

function memoize(f) {
    let result;
    let run = false;
    return (...args) => {
        if (run) return result;
        run = true;
        result = f(...args);
        return result;
    }
}

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

exports.region = (name) => {
    return loadFile("fsd", "universe", "eve", name, "region")
        .catch(() => {
            return loadFile("fsd", "universe", "wormhole", name, "region");
        });
};

exports.lookup = (name, lang) => {
    lang = lang || "en";
    return exports.types().then((types) => {
        return Object.keys(types).map(id => [id, types[id]]).filter(([, type]) => type.name && type.name[lang] && type.name[lang].startsWith(name)).map(([id, type]) => {
            type.id = +id;
            return type;
        })[0];
    });
};

exports.lookupByID = (id) => {
    return exports.types().then(types => types[id]);
};
