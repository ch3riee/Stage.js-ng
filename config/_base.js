/**
 * This is the base configure file for the build process.
 * (Do NOT modify unless you want to apply to all build configures)
 * (It does NOT have the view engine files in the javascript.framework section, see default.js)
 * 
 * Base Path
 * ---------
 * All path are based on the project root. 
 * [Not relative to this configure file]
 *
 * Configure
 * ---------
 * 1. plugins:
 * 	  	settings for some gulp plugins.
 * 2. control aspects: 
 * 		dist path,
 * 		compress[minify, gzip],
 * 		js[es6, concat],
 * 		css,
 * 		template, 
 * 		assets (copy, re-dirname),
 * 		watch
 * 		
 *
 * Override (create another configure)
 * -----------------------------------
 * use `gulp -C <name> or --config <name>` to load up other configure file instead of this one.
 *
 * *Hint*: how to create another configure file? 
 * ```
 * 		module.exports = require('lodash').merge(require('./_base'), {
 * 			...
 * 		 	...
 *   	});
 *
 * 		or
 *
 * 		var config = require('./_base.js');
 * 		config.<item> = ...
 * 		...
 *
 * 		module.exports = config;
 * ```
 * 
 * Gotcha
 * ------
 * 1. All non-concatenated .js files will be treated as es6, thus should use `import` and `expose` module key words.
 * 2. Concatenated lib/vendor .js files can be used directly using their globally exposed vars.
 * 3. We embed sourcemaps inside compiled/concatenated js targets, thus resulting x3 file size.
 * 4. Minified js, css and html will not contain sourcemaps and comments (except for special / *!..* /)
 * 5. Watch task only recompile js, less and tpl.html files, skipping concatenated js targets.
 *
 * Important Note
 * --------------
 * We use babel for es6 -> commonjs and browserfiy for commonjs -> browser. Thus the package.json file in this build 
 * folder could contain npm modules in the `dependencies` block and gets bundled by browserify. Although we do NOT encourage
 * bundling browser side libraries this way, the `dependencies` block is left clean open and up to you. 
 * 
 * We highly recommend using the `gulp libs` task and bower package manager for browser side library management. 
 * 
 * 
 * @author Tim Lauv
 * @created 2015.02.19
 *
 */

module.exports = {

	//---------------dist path--------------
	output: 'public',

	//------------js (modules/libs)---------
	// 'entrypoint' compile & bundle as es6 modules (import, expose. re-process during `watch`)
	// '[...]' as vanilla js concat (won't re-process during `watch`)
	javascript: {
		//app.js
		app: 'src/entrypoint.js',

		//libs.js
		libs: [
			'libs/bower_components/detectizr/dist/detectizr.js',
			'libs/bower_components/lodash/lodash.js',
			'libs/bower_components/jquery/dist/jquery.js',
			'libs/vendor/jquery-ui/position.js',
			'libs/bower_components/fastclick/lib/fastclick.js',
			'libs/bower_components/interact/interact.js',
			'libs/bower_components/eventemitter2/lib/eventemitter2.js',
			'libs/bower_components/async/lib/async.js',
			'libs/bower_components/director/build/director.js',
			'libs/bower_components/i18next/i18next.js',
			'libs/bower_components/validator-js/validator.js',
			//------------------------ve deps:tpl engine, mvvm, fx plugins-------
			'libs/bower_components/handlebars/handlebars.js',
			'libs/bower_components/kendo-ui-core/src/js/kendo.core.js',
			'libs/bower_components/kendo-ui-core/src/js/kendo.data.js',
			'libs/bower_components/kendo-ui-core/src/js/kendo.binder.js',
			//'libs/bower_components/velocity/velocity.js', //$.velocity - animation [optional]
			//'libs/bower_components/velocity/velocity.ui.js' //$.velocity.RegisterEffect/RunSequence - animation-seq [optional]
			//------------------------no tpl framework, widgets------------------
		],

		//framework.js
		framework: [
			'libs/vendor/stagejsv2/infrastructure.js',
			'libs/vendor/stagejsv2/coop-ee2-async.js',
			'libs/vendor/stagejsv2/utils.js',
			'libs/vendor/stagejsv2/com-ajax-ws-rtc.js',
			'libs/vendor/stagejsv2/i18n-i18next.js',
			'libs/vendor/stagejsv2/validate-validator.js',
			'libs/vendor/stagejsv2/navigation-director.js',
			//------------------------view engine--------------------------------
			'libs/vendor/stagejsv2/template-helpers-hbs.js',
			'libs/vendor/stagejsv2/view-engine.js'
		]
	},

	//------------templates.json------------
	// put together with js modules under /src (re-combine during `watch`)
	templates: ['src/**/*.html'],

	//-----------------style----------------
	// into app.css, (re-compile during `watch`)
	stylesheet: 'styles/_base.less', 

	//----------------assets----------------
	//'string' --> as glob, copy as is
	//{key: value} --> copy & re-dir
	//
	// overlapping folder will be merged.
	assets: [
		//glob (copy/exclude as is)
		'assets/**/*',
		'!*.empty',
		//copy and re-dir (put in different folder) *NOT rename!*
		{
			'libs/bower_components/modernizr/modernizr.js':'js',
		},
	],

	//----------gulp plugin configs---------
	//Don't change unless sure about...
	plugins: {

		autoprefixer: {},
		'minify-css': {
			keepSpecialComments: '*' //special comment only (e.g license)
		}, //use clean-css internally
		
		babel: {}, //es6 -> commonjs
		browserify: {}, //commonjs -> browser
		uglify: {
			preserveComments: 'some' //special comment only (e.g license)
		},
		
		'minify-html': {
			empty: true,
			conditionals: true, //remove comments but not the ie ones.
			spare: true
		},

		gzip: {}

	},

	//------------watch params--------------
	//Don't change unless sure about...
	watch: {
		usePolling: true,
		delay: {
			unit: 300, // ms
			factor: { // unit * factor
				poll: 1,
				debounce: 2
			}
		},
		//watch globs (different than the corresponding tasks' globs)
		glob: {
			js: 'src/**/*.js',
			css: 'styles/**/*.less',
			//templates: as in config.templates
		}
	}
};