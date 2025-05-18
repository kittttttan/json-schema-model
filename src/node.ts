import fs from "node:fs/promises";
import { toPhpModel } from './model-php';
import { substringBefore } from './substring-before';
import { version, url, formats } from './version';

const format = process.argv[2] ?? null;
const path = process.argv[3] ?? null;
(async () => {
    await main(format, path);
})()

async function main(format: string, path: string | null) {
    if (!format || !path || ['-h', '-v'].includes(format)) {
        console.log(`options:
format  ${formats.join(',')}
path    path to json file or deirectory

version: ${version}
url: ${url}`);
        return;
    }

    if (!formats.includes(format.toLowerCase())) {
        console.error(`invalid format: ${format}`);
        return;
    }

    const stat = await fs.stat(path);
    if (stat.isFile()) {
        const content = await fs.readFile(path, 'utf8');
        // console.log(content);

        const json = JSON.parse(content);
        const model = toPhpModel(json);
        console.log(model);
        return;
    }

    if (stat.isDirectory()) {
        const outDir = 'output/php/';
        try {
            await fs.mkdir(outDir, { recursive: true });
        } catch (e) {
            // console.warn(e);
        }

        const files = await fs.readdir(path);
        for (const file of files) {
            if (!file.endsWith('.json')) {
                console.log(`ignore ${file}`);
                continue;
            }

            const filepath = `${path}/${file}`;
            const content = await fs.readFile(filepath, 'utf8');
            // console.log(content);

            const filename = substringBefore(file, '.');
            const json = JSON.parse(content);
            const model = toPhpModel(json);
            fs.writeFile(`${outDir}/${filename}.php`, model);
        }
    }
}
