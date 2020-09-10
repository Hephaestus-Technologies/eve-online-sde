const path = require("path");
const jsYaml = require("js-yaml");
const fs = require("fs");

const memoize = (func) => {
    const results = {};
    return async (...args) => {
        const key = args.length ? args.join("") : "__empty__";
        if (!results[key])  results[key] = await func(...args) || "__empty__";
        return results[key] ;
    }
};

module.exports = memoize(async (...pathParts) => {
    const fileName = fileNameFrom(pathParts);
    const fileContents = await readAsync(fileName);
    return jsYaml.safeLoad(fileContents);
});

const fileNameFrom = (pathParts) => {
    const yamlFileName = path.join(__dirname, "sde", ...pathParts) + ".yaml";
    const dataFileName = path.join(__dirname, "sde", ...pathParts) + ".staticdata";
    if (exists(yamlFileName)) return yamlFileName;
    if (exists(dataFileName)) return dataFileName;
    throw new Error("File does not exist");
};

const readAsync = (fileName, encoding = "utf-8") => {
    return new Promise((resolve, reject) => {
        fs.readFile(
            fileName,
            encoding,
            (err, data) => err ? reject(err) : resolve(data)
        );
    });
};

const exists = (fileName) => fs.existsSync(fileName);
