let babel = require('@babel/core');

module.exports = {
	process: function(src, filename) {
		if (filename.endsWith('.js')) {
			return babel.transform(src, {
				filename,
				plugins: ['transform-es2015-modules-commonjs'],
				retainLines: true
			}).code;
		}

		return src;
	}
};
