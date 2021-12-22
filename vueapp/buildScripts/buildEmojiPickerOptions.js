const fs = require('fs');
const path = require('path');
const html = require('node-html-parser');

const iconsDir = path.resolve('./','public','icons');
const categoriesIconsDir = 'categoriesIcons';

let customIcons = [];
let categories = [];

let categoryIcons = fs.readdirSync(path.resolve(iconsDir, categoriesIconsDir));


let categoriesDirectories = fs.readdirSync(path.resolve(iconsDir));
categoriesDirectories.filter(x => x !== categoriesIconsDir).forEach(directory => {

	let fileName = categoryIcons.filter(x => x === directory + '.svg')[0];
	if(fileName === undefined){
		console.error('There is not a category icon for: ' + directory);
		process.exit(1);
	}
	let svg = getSvg(path.resolve(iconsDir, categoriesIconsDir, fileName));
	categories.push(
		{
			name: directory,
			icon: svg.toString()
		});

	let icons = fs.readdirSync(path.resolve(iconsDir, directory));
	icons.forEach( icon => {
		let iconSvg = getSvg(path.resolve(iconsDir,directory,icon));
		customIcons.push(
			{
				category: directory,
				data: iconSvg.toString(),
				aliases: [icon.replace('.svg', '')],
				filename: icon
			});
	});
});




//TODO must be some kind of async promis thing going on

let staticDataroot = path.resolve('./' , 'src', 'staticData/');

fs.writeFile(path.resolve(staticDataroot, 'emojiIcons.json'), JSON.stringify(customIcons), err => {
	if (err) {
		console.error(err);
		return;
	}
	//file written successfully
});


fs.writeFile(path.resolve(staticDataroot, 'emojiIconsCategories.json'), JSON.stringify(categories), err => {
	if (err) {
		console.error(err);
		return;
	}
	//file written successfully
});


/***
 * Gets the HTMLNode of the svg
 * @param path
 * @returns {*}
 */
function getSvg(path){
	let svg = fs.readFileSync(path, 'utf8');
	let parsedSvg = html.parse(svg);
	let svgElement = parsedSvg.querySelector('svg');
	if(svgElement === null){
		console.error('This does not appear to be an svg Image: ' + path);
		process.exit(1);
	}

	return  setAttributes(svgElement);
}

/**
 * Sets the height and width
 * @param svgElement
 * @returns {*}
 */
function setAttributes(svgElement){
	svgElement.setAttribute('height', 32);
	svgElement.setAttribute('width', 32);
	return svgElement;
}
