const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const {promisify} = require('util');
const sass = require('node-sass');

const request = require('request');
const rp = require('request-promise-native');

const fontkit = require('fontkit');

const userAgents = `
Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.9.1.3) Gecko/20090913 Firefox/3.5.3
Mozilla/5.0 (Windows; U; Windows NT 6.1; en; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)
Mozilla/5.0 (Windows; U; Windows NT 5.2; en-US; rv:1.9.1.3) Gecko/20090824 Firefox/3.5.3 (.NET CLR 3.5.30729)
Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.1.1) Gecko/20090718 Firefox/3.5.1
Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/532.1 (KHTML, like Gecko) Chrome/4.0.219.6 Safari/532.1
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; InfoPath.2)
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0; SLCC1; .NET CLR 2.0.50727; .NET CLR 1.1.4322; .NET CLR 3.5.30729; .NET CLR 3.0.30729)
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.2; Win64; x64; Trident/4.0)
Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; SV1; .NET CLR 2.0.50727; InfoPath.2)Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)
Mozilla/4.0 (compatible; MSIE 6.1; Windows XP)
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246
Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36
Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_7; da-dk) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1
Opera/9.80 (Windows NT 6.1; U; es-ES) Presto/2.9.181 Version/12.00
Mozilla/5.0 (Linux; U; Android 2.3.4; fr-fr; HTC Desire Build/GRJ22) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1
Mozilla/5.0 (Linux; Android 7.0; SAMSUNG SM-N920C Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/6.2 Chrome/56.0.2924.87 Mobile Safari/537.36
Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.43 BIDUBrowser/2.x Safari/537.31
Mozilla/5.0 (Linux; U; Android 4.4.2; zh-cn; GT-I9500 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 MQQBrowser/5.0 QQ-URL-Manager Mobile Safari/537.36
Mozilla/5.0 (Android 8.0.0; Tablet; rv:57.0) Gecko/57.0 Firefox/57.0
Mozilla/5.0 (Android 8.1.0; Mobile; rv:61.0) Gecko/61.0 Firefox/61.0
`.split('\n').filter(x => !!x).map(x => x.trim());


async function readFontLigatures(fontFilePath) {

    let font = await promisify(fontkit.open)(fontFilePath);
    let lookupList = font.GSUB.lookupList.toArray();
    let lookupListIndexes = font.GSUB.featureList[0].feature.lookupListIndexes;

    let result = {};

    lookupListIndexes.forEach(index => {
        let subTable = lookupList[index].subTables[0];

        let leadingCharacters = [];
        subTable.coverage.rangeRecords.forEach((coverage) => {
            for (let i = coverage.start; i <= coverage.end; i++) {
                let character = font.stringsForGlyph(i)[0];
                leadingCharacters.push(character);
            }
        });

        let ligatureSets = subTable.ligatureSets.toArray();

        ligatureSets.forEach((ligatureSet, ligatureSetIndex) => {

            let leadingCharacter = leadingCharacters[ligatureSetIndex];

            ligatureSet.forEach(ligature => {
                let character = font.stringsForGlyph(ligature.glyph)[0];
                let characterCode = character.charCodeAt(0).toString(16).toUpperCase();

                let ligatureText = ligature
                    .components
                    .map(x => font.stringsForGlyph(x)[0])
                    .join('');

                ligatureText = leadingCharacter + ligatureText;
                result[ligatureText] = characterCode;
            });
        });
    });

    return result;
}

function downloadFile(url, outputFilePath) {
    return new Promise((resolve, reject) => {
        let file = fs.createWriteStream(outputFilePath);
        let r = request.get(url);

        let onError = (error) => {
            fs.unlink(outputFilePath, () => {
                reject((error && error.message) || error);
            });
        };

        r.on('response', (response) => {
            let hasError = (400 <= response.statusCode) && (response.statusCode < 600);
            if (hasError) {
                return onError(`Invalid response status code ${response.statusCode}`);
            }

            r.pipe(file);
        });

        file.on('finish', () => file.close(resolve));
        r.on('error', onError);
        file.on('error', onError);

    });
}


const outputDirPath = path.resolve(__dirname, '..', 'dist');
const outputFontsDirPath = path.resolve(outputDirPath, 'fonts');
const srcDirPath = path.resolve(__dirname, '..', 'src');

async function writeVariablesSCSSFile(outputFilePath, fontLigatures){
    let keys = Object.keys(fontLigatures);
    keys.sort();
    let lines = keys.map(key => `\t"${key}": ${fontLigatures[key].toLowerCase()},`);

    let content = `$material-icons-codepoints: () !default;
$material-icons-codepoints: map-merge((
${lines.join('\n')}
), $material-icons-codepoints);`;

    await promisify(fs.writeFile)(outputFilePath, content);
}

async function buildScss(sourceScssFilePath, outputCssFilePath) {

    console.log(`generating css file "${outputCssFilePath}" ...`);
    let content = await promisify(sass.render)({
        file: sourceScssFilePath,
    });

    await promisify(fs.writeFile)(outputCssFilePath, content.css);
}

async function main() {


    let sourceScssFilePath = path.resolve(srcDirPath, 'material-design-icons.scss');
    let outputCssFilePath = path.resolve(outputDirPath, 'material-design-icons.css');

    await buildScss(sourceScssFilePath, outputCssFilePath);
    return;

    if (!await promisify(fs.exists)(outputFontsDirPath)) {
        await promisify(mkdirp)(outputFontsDirPath);
    }

    let url = 'https://fonts.googleapis.com/icon?family=Material+Icons';
    let fontName = 'MaterialIcons-Regular';

    let fontsUrls = {};
    await Promise.all(userAgents.map(async userAgent => {
        let options = {
            url: url,
            headers: {
                'User-Agent': userAgent
            }
        };

        let content = await rp.get(options);

        let matches = /url\((.*?)\)/g.exec(content);
        let fontUrl = matches[1];
        let extension = fontUrl.substr(fontUrl.lastIndexOf('.') + 1);

        fontsUrls[extension] = fontUrl;

    }));

    await Promise.all(Object.keys(fontsUrls).map(async extension => {
        let url = fontsUrls[extension];

        let outputFilePath = path.resolve(outputFontsDirPath, `${fontName}.${extension}`);

        console.log(`downloading "${outputFilePath}" ...`);
        await downloadFile(url, outputFilePath);

        if (extension === 'ttf') {
            let fontLigatures = await readFontLigatures(outputFilePath);
            let outputLigaturesJsonFilePath = path.resolve(outputFontsDirPath, `${fontName}.json`);

            console.log(`extracted mapping to "${outputLigaturesJsonFilePath}" ...`);
            await promisify(fs.writeFile)(outputLigaturesJsonFilePath, JSON.stringify(fontLigatures, null, 4));

            let outputVariablesScssFilePath = path.resolve(srcDirPath, '_variables.scss');

            console.log(`generating codepoints to "${outputVariablesScssFilePath}" ...`);
            await writeVariablesSCSSFile(outputVariablesScssFilePath, fontLigatures);


            let sourceScssFilePath = path.resolve(srcDirPath, 'material-design-icons.scss');
            let outputCssFilePath = path.resolve(outputDirPath, 'material-design-icons.css');

            console.log(`generating css file "${cssFilePath}" ...`);
            await promisify(sass.render)({
                file: sourceScssFilePath,
                outFile: outputCssFilePath
            });
        }
    }));
}


main()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));


