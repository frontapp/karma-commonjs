var path = require('path');
var fs = require('fs');
var os = require('os');
var _ = require('underscore');

var templateJs = _.template(fs.readFileSync(__dirname + '/../templates/js.tpl', {
  encoding: 'utf8'
}));

var createPreprocesor = function(logger, config) {
  var log = logger.create('preprocessor.commonjs');
  var modulesRootPath = path.resolve(config && config.modulesRoot ? config.modulesRoot : path.join(basePath, 'node_modules'));
  //normalize root path on Windows
  if (process.platform === 'win32') {
    modulesRootPath = modulesRootPath.replace(/\\/g, '/');
  }

  log.debug('Configured root path for modules "%s".', modulesRootPath);

  return function(content, file, done) {
    var filePath = file.path;

    if (_.isFunction(config.pathModifier))
      filePath = config.pathModifier(filePath);

    var output =
      'require.register("' +
      filePath +
      '", function(exports, require, module){' +
      content + os.EOL +
      '});';

    done(output);
  };
};
createPreprocesor.$inject = ['logger', 'config.commonjsPreprocessor'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:commonjs': ['factory', createPreprocesor]
};
