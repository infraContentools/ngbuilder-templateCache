'use strict';

/**
 * - read all HTML from /views folder
 * - transform into JS and build the templateCache
 * - write it to /src/views.js
 */

module.exports = (function() {
	var vinyl, templateCache, multipipe, path, htmlMinifyOptions, _initialized;

	function init() {
		if (_initialized) return;

		vinyl = require('vinyl-fs');
		templateCache = require('gulp-templatecache');
		multipipe = require('multipipe');
		path = require('path');

		htmlMinifyOptions = {
			collapseBooleanAttributes: true,
			collapseWhitespace: true
		};

		_initialized = true;
	}

	function run(context, options, next) {
		init();

		var modulePath = context.modulePath,
			moduleName = context.moduleName,
			basePath = path.join(modulePath, 'views'),
			outputPath = path.join(modulePath, '/src');

		var pipe = multipipe(
			vinyl.src(path.join(basePath, '/**/*.html')),
			templateCache({
				output: 'views.js',
				strip: basePath,
				moduleName: moduleName,
				minify: htmlMinifyOptions
			})
		);

		pipe.on('error', next);
		pipe.on('end', next);
		pipe.on('finish', next);

		pipe.pipe(vinyl.dest(outputPath));
	};

	return {
		name: 'templateCache',
		watcher: '/**/*.html',
		run: run
	};
})();