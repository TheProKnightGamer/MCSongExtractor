const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const { stringify } = require("querystring");
//Args for script:
const saveTo = "/path/to/folder/";
const loadFrom = "/path/to/folder/";

let amount = 0;
function extractor(zip, path, saveTo, temp) {
    zip.extractEntryTo(path, saveTo + temp, false, true);
    console.log("[INFO]:extracted:", path);   
}
function extractMusicFromJar(pathList, toBeDone) {
    pathList.forEach(pathVar => {
        try {
            const zip = new AdmZip(loadFrom + pathVar);
            if (pathVar.endsWith(".jar")) {
                let temp = pathVar.split(".")[0];
                temp = temp.split(" ")[0];
                console.log("[INFO]:Extracting songs from:", pathVar)
                let pather = zip.getEntries();
                const jsonOutput = JSON.stringify(pather, null, 2);
                pather.forEach(path => {
                    path = path.entryName;
                    try {
                        if (path.includes("asset")) {
                            if (path.includes("music/")) {
                                extractor(zip, path, saveTo, temp);
                            } else if (path.includes("records/")) {
                                extractor(zip, path, saveTo, temp);
                            } else if (path.includes("ambience/")) {
                                extractor(zip, path, saveTo, temp);
                            }  else if (path.includes(".ogg")) {
                                if  (path.includes("music")) {
                                    extractor(zip, path, saveTo, temp);
                                } else if  (path.includes("-")) {
                                    extractor(zip, path, saveTo, temp);
                                }
                            }
                        }
                    } catch (err) {
                        console.error("[ERROR]:Error with jar:", path, ":", err);
                    }
                });
            } else {
                console.error("[ERROR]:File not jar:", pathVar);
            }
        } catch (err) {
            console.error("Error with task:", err)
        }
        amount += 1;
        console.log("[PROGRESS]:Loading:", (amount/toBeDone)*100, "%");
    });
}
console.log("[INFO]:Extract:", loadFrom, "To:", saveTo)
console.log("[INFO]:listing dir", loadFrom, "...");
try {
    const files = fs.readdirSync(loadFrom);
    console.log("[INFO]:Listing complete: ", files);
    console.log("[INFO]:Begining extraction process to", saveTo);
    const toBeDone = files.length;
    extractMusicFromJar(files, toBeDone);
    console.log("[INFO]:Completed, ", toBeDone, "extracted to:", saveTo);
} catch (err) {
    console.error("[ERROR]:Something went wrong with the extraction:", err);
}
