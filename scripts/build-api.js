const path = require("path");
const {writeFileSync} = require("fs");
const {exec} = require("child_process");

const run = async () => {
    await spawnChild("npm", "install")
    await spawnChild("tsc", "--project", "tsconfig.json");
    writeFileSync(".bin/api/package.json", JSON.stringify(packageJson(), null, 2));
};

const packageJson = () => {
    return {
        "name": "@hephaestus-technologies/eve-online-sde",
        "version": version(),
        "description": "Just an API exposing the data from the EVE Online static data export",
        "main": "api/index.js",
        "license": "MIT",
        "dependencies": {
            "entities": "npm:@hephaestus-technologies/eve-entities@^0.2.0",
            "axios": "^0.19.0"
        }
    };
};

const version = () => {
    const versionArg = process.env.version;
    if (!versionArg) throw new Error("Missing version");
    return versionArg[0] === 'v' ? versionArg.substr(1) : versionArg;
};

const spawnChild = (command, ...args) => {
    return new Promise(async (resolve) => {
        const child = exec(`${await commandName(command)} ${args.join(" ")}`);
        child.stdout.pipe(process.stdout);
        child.stderr.pipe(process.stderr);
        child.on("exit", resolve);
    });
};

const commandName = async (command) => {
    if (await exists(command)) return command;
    const name = command.replace(/\//gi, '\\') + ".cmd";
    return path.join(__dirname, "../node_modules/.bin", name);
};

const exists = (command) => {
    return new Promise((resolve) => {
        const child = exec(`whereis ${command}`);
        child.on("exit", () => {
            resolve(false);
        });
        child.stdout.on("data", () => {
            resolve(true);
            child.removeAllListeners("exit");
        });
    });
};

run();
