csv-file-creator
-----

##install

    npm i csv-file-creator -S

##instantiate

    const csvFileCreator = require('csv-file-creator');

Using `require("csv-file-creator")` on the browser typically requires using [browserify](http://browserify.org/) to bundle your code with the module code.

##call

    csvFileCreator(fname, data);

`fname: string` the filename to create, i.e. "data.csv"

`data: Array[Array[number|string]]` array of rows, each row itself an array of numbers and/or strings. Each row can be a different length. 

##Limitations: 

 * browser-dependent limitations may exist on the size of datafiles produced in this way.

 * row format written is "field","field","field",...,"field"\n

 * any zero length rows will written as '""\n'.  

 * sufficient memory must exist to create the csv file as a string from the data

 * the conversion as written is atomic, and will wind up blocking the browser or nodejs event loop if data is large.

 * when used on nodejs, files will be written on the server only.

 * when used on the browser, files will be written on the browser only.

 * only works on recent browsers

### Why are there no callbacks for successful creation, only errors?

The targeted application is writing out small-medium csv files for use by an end user or developer.  Further automated processing of these files is not envisioned.  On the browser-side, which is the primary target, there is currently (2016) no automated means of reading a file from the users file system into the browser, because of security considerations the user must manually select an existing file.  

##example - make a csv file from simulated dice roll data

    var data = [['roll','diceResult']];
    var i,l;
    /* generate data consisting of 10 rolls of a six sided "random" die */
    /* the data should be an array of array of numbers or strings */
    for(i=1,l=10;i<=l;++i) 
        data[i] = [i, 1+Math.floor(6*Math.random())];
    /* output the csv file */
    csvFileCreator("dicerolls.csv", data);

##custom error handling

    csvFileCreator("fubar.csv", data, function(error, fname){ 
         //do something
    });

The callback is **only** called on error.  


In the error callback:  

`error` is a string containing an error message

`fname` is the file name passed to csvFileCreator, here `"fubar.csv"`

# Principle of Operation

First, csv-file-creator looks for certain data structures on IE, then data structures for Chrome/Firefox, then "fs" in nodeJS.  If any of these are found, 
appropriate code is run to create a file containing a copy of the data
formatted as a quoted, comma separated file, or csv file.  


##Copyright 2016

Paul Brewer, Economic and Financial Technology Consulting LLC

Stack Overflow Contributors adaneo and Manu Sharma

Based on code from html5csv.js and 
[this Stack Overflow posting](http://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction)

