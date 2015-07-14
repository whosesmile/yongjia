/* global module:false, require:true, __dirname:true */

var rules = [
  [/(\/\w+\/)+\w*\.jsp/, '/index.html'],
  [/\/(\w+)\/$/, '/index.html'],
  [/\w+?\/img/, '/img/'],
  [/^\/account/, '/interface/account/'],
  [/^\/user\/web\/puser\/(\w+).json/, '/interface/account/$1.json']
];

var rewrite = function (url) {
  rules.forEach(function (rule) {
    url = url.replace(rule[0], rule[1]);
  });

  return url;
};

module.exports = function (grunt) {
  var fs = require('fs');
  var path = require('path');
  var util = require('util');
  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      folder: 'temp',
      port: 8888,
      livereload: 35740
    },

    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
    // '<%= grunt.template.today("yyyy-mm-dd HH:MM:dd") %>\n' +
    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    clean: {
      dev: ['<%= config.folder %>']
    },

    imagemin: { // Task
      dynamic: { // Another target
        files: [{
          expand: true, // Enable dynamic expansion
          cwd: 'app/img', // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif,ico,bmp}'], // Actual patterns to match
          dest: 'app/img' // Destination path prefix
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      dev: {
        src: ['temp/app.min.js']
      },
      hotcycle: {
        src: ['temp/js/hotcycle.min.js']
      }
    },

    html2js: {
      options: {
        module: 'templates',
        htmlmin: {
          removeComments: true,
          collapseWhitespace: true
        },
        rename: function (name) {
          return name.replace('../app/', '');
        }
      },
      dev: {
        src: ['app/**/templates/**/*.html'],
        dest: 'app/templates.js'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dev: {
        files: [{
          expand: true,
          cwd: '<%= config.folder %>',
          src: '**/*.js',
          dest: '<%= config.folder %>'
        }]
      }
    },

    concat: {
      options: {
        stripBanners: true
      },
      alljs: {
        src: ['app/app.js', 'app/config/supports.js', 'app/config/config.js', 'app/config/**/*.js', 'app/modules/**/module.js', 'app/modules/**/*.js', 'app/templates.js'],
        dest: '<%= config.folder %>/app.min.js'
      }
    },

    uglify: {
      options: {
        banner: '<%= banner %>',
        enclose: {}
      },
      alljs: {
        src: '<%= concat.alljs.dest %>',
        dest: '<%= config.folder %>/app.min.js'
      }
    },

    cssmin: {
      dev: {
        src: 'app/app.css',
        dest: '<%= config.folder %>/app.min.css'
      }
    },

    watch: {
      options: {
        livereload: '<%= config.livereload%>'
      },
      gruntfile: {
        options: {
          reload: true
        },
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: ['app/**/*.js', '!app/templates.js'],
        tasks: ['concat']
      },
      html2js: {
        files: ['app/*/**/*.html'],
        tasks: ['html2js:dev', 'concat:alljs']
      },
      css: {
        files: ['app/app.css'],
        tasks: ['copy:css']
      }
    },

    connect: {
      dev: {
        options: {
          // 经过测试 connect插件会依照base的定义顺序检索文件
          // 这意味着如果存在相同文件，定义在前面的会优先返回
          base: ['<%= config.folder %>', '.'],
          port: '<%= config.port %>',
          // open: 'http://127.0.0.1:<%= config.port %>/index.html',
          livereload: '<%= config.livereload%>',
          hostname: '*',
          middleware: function (connect, options, middlewares) {
            var support = ['POST', 'PUT', 'DELETE'];
            middlewares.unshift(function (req, res, next) {
              req.url = rewrite(req.url);
              // 处理POST请求，以及rewrite, 请求的地址必须是文件
              if (support.indexOf(req.method.toUpperCase()) !== -1) {
                for (var i = 0; i < options.base.length; i++) {
                  var filepath = path.join(options.base[i], req.url);
                  if (filepath.indexOf('?') >= 0) {
                    filepath = filepath.substring(0, filepath.indexOf('?'));
                  }
                  if (fs.existsSync(filepath) && fs.statSync(filepath).isFile()) {
                    return res.end(fs.readFileSync(filepath));
                  }
                }
              }

              return next();
            });

            return middlewares;
          }
        }
      }
    },

    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: 'app',
          src: ['*.html', '**/*.{ico,png,txt,gif,jpg,jpeg,svg,eot,ttf,woff,json}'],
          dest: '<%= config.folder %>'
        }]
      },
      html: {
        files: [{
          src: 'app/index.html',
          dest: '<%= config.folder %>/index.html'
        }]
      },
      css: {
        files: [{
          src: 'app/app.css',
          dest: '<%= config.folder %>/app.min.css'
        }]
      },
      vendor: {
        files: [{
          expand: true,
          cwd: 'vendor',
          src: ['**/*'],
          dest: '<%= config.folder %>/vendor'
        }]
      }
    }
  });

  // 开发
  grunt.registerTask('default', function () {
    grunt.config('config.folder', 'temp');
    grunt.task.run([
      'clean:dev',
      'copy',
      'html2js:dev',
      'concat',
      'connect:dev',
      'watch'
    ]);
  });

  // 打包
  grunt.registerTask('dist', function () {
    grunt.config('config.folder', 'dist');
    grunt.task.run([
      'clean:dev',
      'copy',
      'cssmin:dev',
      'html2js:dev',
      'ngAnnotate:dev',
      'concat',
      'uglify',
    ]);
  });

  // 语法检查
  grunt.registerTask('hint', function () {
    grunt.config('config.folder', 'temp');
  });

};