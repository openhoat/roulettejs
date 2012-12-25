var fs = require('fs')
  , path = require('path');

function convertToAbsolutePaths(paths) {
  var rootPath = fs.realpathSync('.');
  for (var i = 0; i < paths.length; i++) {
    paths[i] = rootPath + '/' + paths[i];
  }
}

var dir = {
    reports    :'reports',
    controllers:'controllers',
    models     :'models',
    spec       :'spec'
  }
  , jsLintFiles = ['app.js', 'config.js', 'lib/**/*.js', dir.controllers + '/**/*.js', dir.models + '/**/*.js'];

module.exports = function (grunt) {
  convertToAbsolutePaths(jsLintFiles);
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-jslint');
  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.registerTask('verify', 'jslint');
  if ((fs.existsSync ? fs : path).existsSync(dir.spec)) {
      grunt.registerTask('test', 'jasmine_node');
  } else {
    grunt.registerTask('test', function () {
      grunt.log.writeln('no test found');
    });
  }
  grunt.registerTask('default', 'verify test');
  var gruntConfig = {
    pkg         :'<json:package.json>',
    clean       :{
      default:[dir.reports]
    },
    jslint      :{
      files     :jsLintFiles,
      directives:{
        require:false,
        node   :true,
        sloppy :true,
        white  :true,
        nomen  :true,
        stupid :true,
        regexp: true,
        unparam: true
      },
      options   :{
        errorsOnly :true,
        jslintXml  :dir.reports + '/jslint.xml',
        failOnError:false
      }
    },
    jasmine_node:{
      specNameMatcher:'.*Spec',
      projectRoot    :dir.spec,
      requirejs      :false,
      forceExit      :true,
      jUnit          :{
        report        :true,
        savePath      :dir.reports + '/',
        useDotNotation:true,
        consolidate   :true
      }
    }
  };
  var testOption = grunt.option('test');
  if (testOption) {
    gruntConfig.jasmine_node.specNameMatcher = testOption;
  }
  grunt.initConfig(gruntConfig);
};
