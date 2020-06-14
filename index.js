const fs = require('fs'),
	compressor = require('node-minify');

const icons = JSON.parse(fs.readFileSync('node_modules/css.gg/icons/all.json'));
let scriptfile = '';

scriptfile += '(function(global, factory) {\n' +
	'\ttypeof exports === \'object\' && typeof module !== \'undefined\'\n' +
	'\t\t? module.exports = factory()\n' +
	'\t\t:\n' +
	'\t\ttypeof define === \'function\' && define.amd\n' +
	'\t\t\t? define(\'uikitgg\', factory)\n' +
	'\t\t\t:\n' +
	'\t\t\t(global = global || self, global.uikitggIcons = factory());\n' +
	'}(this, function() {\n' +
	'\t\'use strict\';\n' +
	'\n' +
	'\tfunction plugin(UIkit) {\n' +
	'\t\tif (plugin.installed) {\n' +
	'\t\t\treturn;\n' +
	'\t\t}\n' +
	'\n' +
	'\t\tUIkit.icon.add({\n';

if (!!icons) {
	for (let icon of Object.keys(icons)) {
		scriptfile += '\t\t\t\'' + 'gg-' + icon + '\': \'' +
			icons[icon][0][0]['svg_path'].replace(/\r?\n/g, '').
				replace(/\s+/g, ' ') + '\',\n';
	}
}

scriptfile += '\t\t});\n' +
	'\t}\n' +
	'\n' +
	'\tif (typeof window !== \'undefined\' && window.UIkit) {\n' +
	'\t\twindow.UIkit.use(plugin);\n' +
	'\t}\n' +
	'\treturn plugin;\n' +
	'}));';

const minify = () => {
	compressor.minify({
		compressor: 'uglifyjs',
		input: 'dist/uikit-css-gg-icons.js',
		output: 'dist/uikit-css-gg-icons.min.js'
	});
};

fs.writeFile('dist/uikit-css-gg-icons.js', scriptfile, {flag: 'w'},
	err => {console.log(err); minify()});

