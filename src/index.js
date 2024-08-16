const fs = require("fs");
const path = require("path");

// Function to traverse the directory and gather image files
function traverseDirectory(dir, basePath = "") {
	let files = [];

	const items = fs.readdirSync(dir);
	items.forEach((item) => {
		const fullPath = path.join(dir, item);
		const stat = fs.statSync(fullPath);

		if (stat.isDirectory()) {
			const subFiles = traverseDirectory(fullPath, path.join(basePath, item));
			files = files.concat(subFiles);
		} else if (stat.isFile() && /\.(png|jpg|jpeg|gif|bmp|webp|svg)$/i.test(item)) {
			files.push(path.join(basePath, item));
		}
	});

	return files;
}

// Function to generate Dart class from the collected files
function generateDartClass(folderName, files) {
	const className = `Local${capitalize(folderName)}`;
	let classContent = `class ${className} {\n`;

	files.forEach((file) => {
		const fileName = path.basename(file, path.extname(file));
		const variableName = camelCase(fileName);
		const filePath = `assets/${file.replace(/\\/g, "/")}`;
		classContent += `  static const String ${variableName} = "${filePath}";\n`;
	});

	classContent += "}\n";
	return classContent;
}

// Helper functions
function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function camelCase(string) {
	return string.replace(/[-_ ](.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
}

// Main function
function main() {
	const folderPath = process.argv[2];
	const dartFilePath = process.argv[3];

	if (!folderPath) {
		console.error("Please provide a folder path.");
		return;
	}

	if (!dartFilePath) {
		console.error("Please provide the Dart file output location.");
		return;
	}

	const folderName = path.basename(folderPath);
	const files = traverseDirectory(folderPath);

	if (files.length === 0) {
		console.error("No images found in the specified folder.");
		return;
	}

	const dartClassContent = generateDartClass(folderName, files);

	const outputPath = path.resolve(dartFilePath);
	fs.writeFileSync(outputPath, dartClassContent);

	console.log(`Dart class generated successfully at ${outputPath}`);
}

// Execute the script
main();
