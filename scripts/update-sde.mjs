import scrapeIt from "scrape-it";
import unzipper from "unzipper";
import https from "https";
import fs from "fs";
import readline from "readline";
import path, {dirname} from "path";
import url, {fileURLToPath} from "url";
import {Readable} from "stream";
import {Writer} from "fstream";

const __dirname = dirname(fileURLToPath(import.meta.url));
const GET = (uri) => new Promise((resolve) => {const req = https.get(uri, (res) => resolve({res, req}))});

const SOURCE_URI = "https://developers.eveonline.com/resource/resources";
const PACKAGE_JSON = "../package.json";
const DESTINATION = "..";

const MiB = 1 / (1042 * 1042);

const execute = async () => {
    const {uri, version} = await infoFrom(SOURCE_URI);
    if (isCurrent(version)) return console.log("SDE is already up-to-date.");
    const sde = await downloadFolder(uri);
    await unzip(sde, DESTINATION);
};

const infoFrom = (sourceUri) => {

    const invoke = async () => {
        console.log("Pinging website...");
        const {uri, filename} = await scrape(sourceUri);
        console.log("Ping complete.");
        const version = versionFrom(filename);
        return {uri, version};
    }

    const scrape = (sourceUri) => new Promise((resolve) => {
        const uriSelector = ".content > h3:nth-child(4) + ul li:last-child a";
        const filename = ".content > h3:nth-child(6) + ul li:last-child a";
        scrapeIt(sourceUri, {
            uri: { selector: uriSelector, attr: "href" },
            filename: { selector: filename, attr: "href" }
        }, null).then((result) => {
            if (!isSuccess(result)) throw new Error("Couldn't scrape SDE link!");
            resolve(result);
        }).catch(console.error);
    });

    const isSuccess = (scrape) => {
        return (
            typeof scrape.uri === "string" &&
            typeof scrape.filename === "string"
        );
    };

    const versionFrom = (rawFilename) => {
        const filename = path.basename(url.parse(rawFilename).pathname);
        const trimmed = filename.slice(0, "_Types.zip".length);
        return trimmed.replace(/_/g, "-");
    };

    return invoke();

};

const isCurrent = (newVersion) => {
    const fileName = path.join(__dirname, PACKAGE_JSON);
    const packageJson = JSON.parse(fs.readFileSync(fileName).toString());
    return newVersion === packageJson.version;
};

const downloadFolder = (uri) => {

    const invoke = async () => {
        const buffer = await doGet();
        console.log();
        console.log("Download complete.");
        return buffer;
    };

    const doGet = () => new Promise(async (resolve) => {
        const {res, req} = await GET(uri);
        const responseSize = res.headers["content-length"];
        res.on("data", reportDownloadProgress(responseSize));
        const buffer = bufferStream(res, Number(responseSize));
        req.on("close", () => resolve(buffer))
    });

    const reportDownloadProgress = (total, current = 0) => (chunk) => {
        current += chunk.length;
        readline.clearLine(process.stdout, /**@type Direction*/0);
        readline.cursorTo(process.stdout, 0);
        const progress = `Downloading ${(current*MiB).toFixed(2)}/${(total*MiB).toFixed(2)} MiB.`;
        const percent = `${(current / total * 100).toFixed(2)}%`;
        process.stdout.write(`${progress} (${percent})`);
    };

    return invoke();

};

const unzip = (buffer, destination) => {

    const invoke = async () => {
        await toReadable(buffer)
            .pipe(unzipper.Parse())
            .on("entry", persistFile).promise();
        console.log("Extraction complete.");
    };

    const persistFile = (entry) => {
        if (entry.type === "Directory") return;
        reportUnzipProgress(entry.path);
        entry.pipe(Writer({
            path: path.join(__dirname, destination, entry.path)
        }));
    };

    const reportUnzipProgress = (filename) => {
        readline.clearLine(process.stdout, /**@type Direction*/0);
        readline.cursorTo(process.stdout, 0);
        process.stdout.write(`Extracting ${filename}`);
    };

    return invoke();

};

const toReadable = (buffer) => {
    const readable = new Readable({
        read() {
        }
    });
    readable.push(buffer);
    readable.push(null);
    return readable;
};

const bufferStream = (stream, size) => {
    const buffer = Buffer.alloc(size);
    let offset = 0;
    stream.on("data", (chunk) => chunk.forEach(c => buffer.writeUInt8(c, offset++)));
    return buffer;
};

execute().then(() => {
    console.log(`Done! SDE upgrade complete!`);
});
