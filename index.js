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
