
module.exports = function(grunt) {
	grunt.initConfig({
		compass: {
			dist: {
		        options: {
		        	config: './public/config.rb',
					basePath: './public/'
		        }
		    }
		},

		concat: {
			options: {
				separator: ';',
				stripBanners: true
			},
			dist: {
				src: [
					"./public/js/service.js",
					"./public/js/filter.js",
					"./public/js/controller.js",
					"./public/js/directive.js",
					"./public/js/main.js"
				],
				dest: "./public/js/build/main.js"
			}
		},

		uglify: {
			dist: {
				files: {
					'./public/js/build/main.min.js': './public/js/build/main.js'
				}
			}
		},

		watch: {
			serverJs: {
				files: ['./server/**'],
				options: {
					livereload: true
				}
			},
			publicJs: {
				files: './public/js/*.js',
				tasks: ['concat', 'uglify']
			},

			css: {
				files: './public/sass/*.scss',
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
					cwd: __dirname
				}
			}
		},

		concurrent: {
			tasks: ['watch', 'nodemon'],
			options: {
				logConcurrentOutput: true
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');

	grunt.option('force', true);
	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('build-sass', ['compass']);
	grunt.registerTask('build', ['concat', 'uglify']);
};