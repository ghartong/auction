var grunt = require('grunt');

/* change to match your environment, map drives as needed or make symlinks, etc. */
/* ******  MAC ******* */
var devFolder = '/Volumes/wwwroot/auction/';
var svnFolder = '/Volumes/wwwroot/auction/';
var stageFolder = '/Volumes/wwwroot/auction/';
var localBase = '/';
var devBase = '/auction/';
var stageBase = '/auction/';

/* replace: replaces some text in CSS and index.html after build. local/dev/stage directory structures
	are all different and webpack/sass doesn't play nice with ../ in background images. The index.html 
	file gets updated by changing the base href based on environment */
grunt.initConfig({
	replace:{
		local:{
			src:['deploy/css/style.css'],
			dest:['deploy/css/style.css'],
			replacements:[{
				from:'url("../fonts',
				to:'url("/fonts'
			},{
				from:'url("../img',
				to:'url("/img'				
			}]
		},
		local_index:{
			src:['deploy/index.html'],
			dest:['deploy/index.html'],
			replacements:[{
				from:/base href=".*"/g,
				to:'base href="' + localBase + '"'				
			}]
		},
		dev:{
			src:['deploy/css/style.css'],
			dest:['deploy/css/style.css'],
			replacements:[{
				from:'url("/fonts',
				to:'url("../fonts'
			},{
				from:'url("/img',
				to:'url("../img'				
			}]
		},
		dev_index:{
			src:['deploy/index.html'],
			dest:['deploy/index.html'],
			replacements:[{
				from:/base href=".*"/g,
				to:'base href="' + devBase + '"'				
			}]
		},
		stage:{
			src:['deploy/css/style.css'],
			dest:['deploy/css/style.css'],
			replacements:[{
				from:'url("/fonts',
				to:'url("../fonts'
			},{
				from:'url("/img',
				to:'url("../img'				
			}]
		},
		stage_index:{
			src:['deploy/index.html'],
			dest:['deploy/index.html'],
			replacements:[{
				from:/base href=".*"/g,
				to:'base href="' + stageBase + '"'				
			}]
		}
	},
	copy:{
		build:{
			files:[
				{expand: true, cwd: 'src', src: ['index.html'], dest: 'deploy/'},
				{expand: true, cwd: 'src', src: ['fonts/**'], dest: 'deploy/'},
				{expand: true, cwd: 'src', src: ['img/**'], dest: 'deploy/'},
				{expand: true, cwd: 'src', src: ['css/*.css'], dest: 'deploy/'},
				{expand: true, cwd: 'src', src: ['pdf/**'], dest: 'deploy/'},
				{expand: true, cwd: 'src', src: ['client.min.js'], dest: 'deploy/'},
			],
		}
	},
	rsync: {
		options: {
			args: ['--verbose','-ua'],
			exclude: ['.git*','*.scss','*.sass','node_modules','deploy','.svnbuild','.DS_Store','*.zip','*.bak','*.sublime*','*.log'],
			recursive: true
		},
		svn: {
			options: {
				src: './',
				dest: svnFolder
			}
		},
		dev: {
			options: {
				src: 'deploy/',
				dest: devFolder
			}
		},
		stage: {
			options: {
				src: 'deploy/',
				dest: stageFolder
			}
		}
	},
});

grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-jslint');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-deploy');
grunt.loadNpmTasks('grunt-rsync');
grunt.loadNpmTasks('grunt-text-replace');

grunt.registerTask('default', 'default task description', function(){
	console.log('hello world');
});

// Build task(s).
grunt.registerTask('build', ['copy:build', 'replace:local', 'replace:local_index']);
grunt.registerTask('deploy-dev', ['copy:build', 'replace:dev', 'replace:dev_index', 'rsync:dev', 'rsync:svn']);
grunt.registerTask('deploy-stage', ['copy:build', 'replace:stage', 'replace:stage_index', 'rsync:stage']);
grunt.registerTask('deploy-svn', ['replace:dev', 'replace:dev_index', 'rsync:svn']);
