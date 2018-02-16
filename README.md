csv-file-creator
-----

[![Greenkeeper badge](https://badges.greenkeeper.io/DrPaulBrewer/csv-file-creator.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/DrPaulBrewer/csv-file-creator.svg?branch=master)](https://travis-ci.org/DrPaulBrewer/csv-file-creator)

## install

    npm i csv-file-creator -S

## instantiate it, rename it

`require(csv-file-creator)` will return a JS function, but a JS function can not have dashes in the name, so you will have to call it something else.  

Perhaps:

    const createCSVFile = require('csv-file-creator');
    
or maybe:

    var csvFileCreator = require('csv-file-creator')
    
though I think most people reading code later would probably prefer the first form. 

You can name it anything you like via assignment:

    var anythingYouLike = require('csv-file-creator')
    
provided you call it consistently later.

    anythingYouLike(fname, data);
    
## browserify

Using `require("csv-file-creator")` on the browser typically requires using [browserify](http://browserify.org/) to bundle your code with the module code.

## calling it

Assuming it is instantiated as `const createCSVFile = require('csv-file-creator');` call it like this:

    createCSVFile(fname, data);
    
where:

`fname: string` is the filename to create, i.e. "data.csv"

`data: Array[Array[number|string]]` is an array of rows, each row itself an array of numbers and/or strings. Each row can be a different length. 

There is no return value.  The function will attempt to cause a csv file containing the data to be written out from a browser to the user's filesystem, or from nodejs to the host's filesystem.  In this form there is no indication of success or failure.  The creation process itself is asynchronous on nodeJS, and usually involves a modal "save file" dialogue on the browser.  In some browsers the modal save file dialogue can be disabled manually by the user, but not from browser javascript code.

##

## Limitations: 
 * automated testing can only test nodejs functionality

 * automated testing of browsers seems to be blocked by modal dialogue boxes for "save-as" and the like.  If you know of an automated testing solution that can test muliple browsers and avoids the file dialogue box, please open an issue and let me know. For now, we have to be satisfied with testing the csv string for correct content.  

 * browser-dependent limitations may exist on the size of datafiles produced in this way. For instance, currently 10,000 rows x 2 cols works OK in Firefox, but 100,000 rows x 2 cols gives an error.

 * row format written is "field","field","field",...,"field"\n

 * any zero length rows will written as '""\n'.  

 * sufficient memory must exist to create the csv file as a string from the data

 * the conversion as written is atomic, and will wind up blocking the browser or nodejs event loop if data is large.

 * when used on nodejs, files will be written on the server only.

 * when used on the browser, files will be written on the user's computer only.

 * only works on recent browsers

### Why are there no callbacks for successful creation, only errors?

The targeted application is writing out small-medium csv files for use by an end user or developer.  Further automated processing of these files is not envisioned.  On the browser-side, which is the primary target, there is currently (2016) no automated means of reading a file from the users file system into the browser, because of security considerations the user must manually select an existing file.  

## example - make a csv file from simulated dice roll data

    const createCSVFile = require('csv-file-creator');
    var data = [['roll','diceResult']];
    var i,l;
    /* generate data consisting of 10000 rolls of a six sided "random" die */
    /* the data should be an array of array of numbers or strings */
    for(i=1,l=10000;i<=l;++i) 
        data[i] = [i, 1+Math.floor(6*Math.random())];
    /* output the csv file */
    createCSVFile("dicerolls.csv", data);

## test it out quickly on your web server / web browser

On your web server

    cd /path/to/your/webserver/directory/
    git clone http://github.com/drpaulbrewer/csv-file-creator
    
On your web browser, visit http://your.web.address/path/to/csv-file-creator/example/index.html

When done, be sure to remove the unneeeded files.

## custom error handling

    createCSVFile("fubar.csv", data, function(error, fname){ 
         //do something
    });

The callback is **only** called on error.  


In the error callback:  

`error` is a string containing an error message

`fname` is the file name passed to createCSVFile, here `"fubar.csv"`

# Principle of Operation

First, csv-file-creator looks for certain data structures on IE, then data structures for Chrome/Firefox, then "fs" in nodeJS.  If any of these are found, 
appropriate code is run to create a file containing a copy of the data
formatted as a quoted, comma separated file, or csv file.  


## Copyright 2016

Paul Brewer, Economic and Financial Technology Consulting LLC

Stack Overflow Contributors adaneo and Manu Sharma

Based on code from html5csv.js and 
[this Stack Overflow posting](http://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction)

## License: MIT
