const Express = require("express");
const loadFile = require("./load_file");

const PORT = 60606;
const app = Express();

const GET = (route, handler) => {
    app.get(route, async (req, res) => res.send(await handler(req.params)));
};

GET("/types", () => loadFile("fsd", "typeIDs"));

GET("/icons", () => loadFile("fsd", "iconIDs"));

GET("/blueprints", () => loadFile("fsd", "blueprints"));

GET("/certificates", () => loadFile("fsd", "certificates"));

GET("/graphics", () => loadFile("fsd", "graphicIDs"));

GET("/groups", () => loadFile("fsd", "groupIDs"));

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
