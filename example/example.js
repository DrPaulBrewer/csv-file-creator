const csvFileCreator = require('csv-file-creator');

var i,l;

var data = [["roll","diceResult"]];

for(i=1,l=10000;i<=l;++i)
    data[i] = [i, 1+Math.floor(6*Math.random())];

csvFileCreator("dicerolls.csv", data);

