module.exports = function(grunt) {
	'use strict';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
		, clean: {
			pre: ['compiled', 'dist']
			, post: ['compiled']
		}
		, ngmin: {
			main: {
				files: [{
					src: 'src/<%= pkg.name %>.js'
					, dest: 'compiled/<%= pkg.name %>.min.js'
				}]
			}
		}
		, uglify: {
			options: {
				banner: '/**\n' +
					' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
					' * <%= pkg.homepage %>\n' +
					' *\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
					' * Licensed <%= pkg.license %>\n' +
					' */\n'
				, sourceMap: 'dist/<%= pkg.name %>.min.map'
			}
			, main: {
				files: {
					'dist/<%= pkg.name %>.min.js': ['compiled/*.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-ngmin');

	grunt.registerTask('default', [
		'clean:pre', 'ngmin', 'uglify', 'clean:post'
	]);
};
