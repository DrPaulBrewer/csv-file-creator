const csvFileCreator = require("../index.js");
/* 
 * This example is for testing purposes only.
 * A production version would not require ../index.js; instead:
 * const csvFileCreator = require("csv-file-creator")
 * and run "npm i csv-file-creator -S" in the shell to download the library
 * into the development environment and save the dependency in package.json
 */

var i,l;

var data = [["roll","diceResult"]];

for(i=1,l=10000;i<=l;++i)
    data[i] = [i, 1+Math.floor(6*Math.random())];

csvFileCreator("dicerolls.csv", data);

