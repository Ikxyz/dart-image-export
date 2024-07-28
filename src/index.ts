#!/usr/bin/env node
import _fs from 'fs';
const { version } = require("../package.json");

const image_extensions = ['png', 'jpg', 'jpeg', 'svg'];

const fs = _fs.promises;


const doesFileNeedChange = (newFilePath: string, content: string) => {
    try {
        return content !== _fs.readFileSync(newFilePath).toString();
    } catch (error) {
        return true;
    }
}


const exportAll = async (path: string, force: string): Promise<string | undefined> => {

    const dir = await fs.readdir(path);

    const fileName = path.split('/').pop();

    const length = dir.length;

    const files: Array<string> = [];


    for (let i = 0; i < length; i++) {



        const stat = await fs.stat(path + '/' + dir[i]);

        if (stat.isDirectory()) {
            const exportFile = await exportAll(path + '/' + dir[i], force);

            if (exportFile) {
                files.push(exportFile);
            }
        }
        const imageType = dir[i].split('.').pop();
        if (imageType && image_extensions.includes(imageType)) {
            console.log('exporting image ', dir[i], path + '/' + dir[i]);
            files.push(path + '/' + dir[i]);
        }

    }

    if (files.length == 0) {
        console.log("No files to export in ", path);
        return;
    }

    const fileExtension = '.dart';
    const getImageVariableName = (file: string) => file.split('/').pop()?.split('.')[0] ?? '';
    const newFilePath = `${path}/_${fileName}Files${fileExtension}`;

    const content = files.map((e) => `static const String ${camelCase(getImageVariableName(e))} = "${e}";\n`).join('');


    const className = capitalize(path.split('/').pop() ?? '');

    const classContent = `
class Local${className} {
${content}
}`

    if (doesFileNeedChange(newFilePath, content) === false) {
        // console.log("No change required");
        return;
    }
    await _fs.writeFile(newFilePath, classContent, _ => _);

    console.log('exported --> ', newFilePath);

    return `./${fileName}/_${fileName}Files${fileExtension}`;
}

const statExport = async () => {
    const [_, __, path, ...args] = process.argv;

    if (path === "-v" || path === "--version") {
        return console.log('Dart Export version ', version);
    }

    if (!path) return console.log("No Path Provider");

    const force = args.find((e) => e === "-f") ?? '';
    const watch = args.find((e) => e === "-w") ?? '';

    console.log("Exporting")

    console.log('export from: ', path);

    await exportAll(path, force);

    if (watch) {
        console.log('Watching Directory for changes');
        _fs.watch(path, { recursive: true, persistent: true }, (event, file) => {
            // console.log("Event: ", event, ". File: ", file);
            exportAll(path, force);
        })
    }


}


const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

statExport();
function camelCase(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
