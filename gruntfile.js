
module.exports = function(grunt) {
	grunt.initConfig({
		compass: {
			dist: {
		        options: {
		        	config: 'public/config.rb',
					basePath: 'public/'
		        }
		    }
		},

		watch: {
			hbs: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['server/**'],
				options: {
					livereload: true
				}
			},
			css: {
				files: 'public/sass/*.scss',
				tasks: ['compass']
			}
		},

		nodemon: {
			dev: {
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['node_modulse/**'],
					watchedExtensions: ['js'],
					watchedFolders: ['server'],
					debug: true,
					delayTime: 1,
					cwd: __dirname/*,
					env: {
						PORT: 3000
					}*/
				}
			}
		},

		concurrent: {
			tasks: ['watch', 'nodemon'],
			options: {
				logConcurrentOutput: true
			}
		}// ,

		// mochaTest: {
		// 	options: {
		// 		reporter: 'spec'
		// 	},
		// 	src: ['test/**.js']
		// }
	});


	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	// grunt.loadNpmTasks('grunt-mocha-test');

	grunt.option('force', true);
	grunt.registerTask('default', ['concurrent']);
	// grunt.registerTask('test', ['mochaTest']);
};