var coberturaBadger = require('istanbul-cobertura-badger');
 
var coberturaFile = "shippable/codecoverage/cobertura-coverage.xml";
var destinationPath = "shippable";
 
coberturaBadger(coberturaFile, destinationPath, function() {
  console.log("Badge created at " + destinationPath + "/cobertura.svg");
});