const fs = require("fs");
const path = require("path");
const jsYaml = require("js-yaml");

exports.raw = (...yamlPath) => {
    const filepath = ["sde", ...yamlPath].filter(x => x.indexOf("/") === -1 && x.indexOf("\\") === -1).join("/");
    return new Promise((resolve, reject) => {
        fs.stat(path.join(__dirname, `${filepath}.yaml`), (err) => {
            if (err) {
                fs.stat(path.join(__dirname, `${filepath}.staticdata`), (err) => {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(path.join(__dirname, `${filepath}.staticdata`));
                    }
                });
            }
            else {
                resolve(path.join(__dirname, `${filepath}.yaml`));
            }
        });
    }).then(path => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, "utf-8", (err, data) => {
                if (err) return reject(err);
                try {
                    const obj = jsYaml.safeLoad(data);
                    return resolve(obj);
                }
                catch (e) {
                    return reject(e);
                }
            });
        });
    });
};

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
    exports[key] = memoize(() => {
        return exports.raw("fsd", fdeMap[key]);
    });
}

exports.landmarks = memoize(() => exports.raw("fsd", "landmarks", "landmarks"));

exports.region = (name) => {
    return exports.raw("fsd", "universe", "eve", name, "region")
        .catch(() => {
            return exports.raw("fsd", "universe", "wormhole", name, "region"); 
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
