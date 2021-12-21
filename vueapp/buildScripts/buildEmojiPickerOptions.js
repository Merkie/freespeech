const testFolder = './public/icons';
const fs = require('fs');

let customIcons = [];
let catgories = [];


fs.readdir(testFolder, (err, files) => {
	console.log(fs);
	files.forEach(file => {
		catgories.push(
			{
				name: file,
				icon:'🏝'
			});
		fs.readdir(testFolder + '/' + file, (err, icons) => {
			console.log(fs);
			icons.forEach(icon => {
				customIcons.push(
					{
						category: file,
						icon: fs.readFileSync(`${testFolder}/${file}/${icon}`, 'utf8'),
						aliases: [icon.replace('.svg', '')]
					});
			});
		});


	});

});




//TODO must be some kind of async promis thing going on

fs.writeFile('./src/staticData/emojiIcons.json', JSON.stringify(customIcons), err => {
	if (err) {
		console.error(err);
		return;
	}
	//file written successfully
});


fs.writeFile('./src/staticData/emojiIconsCategories.json', JSON.stringify(catgories), err => {
	if (err) {
		console.error(err);
		return;
	}
	//file written successfully
});
