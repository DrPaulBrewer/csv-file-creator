/* jshint node:true,esnext:true,eqeqeq:true,undef:true,lastsemic:true,unused:false */
/* globals fs:true, window:true, document:true, navigator:true, Blob:false */

/* detect if window and document exist, if they do not, set them false */

(function(){
    var win,doc;
    // set window and document to false if they do not exist
    // and defines fs
    try { 
	/* next assignment fails on nodejs, are OK on browser */
	win = window;
    } catch(e){ 
	window = false; 
	document = false;
	fs = require('fs');
    }
})();

/* jshint strict:true, unused:true */
module.exports = function(fname, rows, onError){
    "use strict";
    /* writes Array-of-Array data in rows in csvfile format to fname */
    /* isomorphic javascript for recent IE/Chrome/FF/nodeJS(server-side) */
    /* this code adapted and separated from code origially appearing in 
     * "html5csv" at http://github.com/drpaulbrewer/html5csv
     * Copyright 2016 
     * Dr Paul Brewer Economic & Financial Technology Consulting LLC 
     * and Stack Overflow Contributors adaneo, Manu Sharma
     * License: MIT
     *
     * isomorphic CSV file creator.  Does not require nodejs server.
     *
     * Forces the browser to "download" a browser generated .csv file
     * consisting of comma-separated data from an Array of Arrays.  
     *
     * This is done via blob(IE) or dataURL and self-clicking link (Chrome/FF)
     *
     * I would like to thank adeneo, http://stackoverflow.com/users/965051/adeneo
     * for inspiration and showing me how to use a data URL this way
     * in http://stackoverflow.com/questions/17836273/export-javascript-data-to-csv-file-without-server-interaction
     * Adaneo's solution works on Firefox and Chrome
     * Later Manu Sharma proposed an IE solution
     * in http://stackoverflow.com/a/27699027/103081
     *
     *
     * I have added a method that detects nodeJS environments and 
     * attempts to write a csvString asynchronously to the file named fname
     * in an overwriting, one time operation. This makes a heroic assumption
     * that the file system can handle an instruction to write csvString
     * without needing some kind of chunking to the block size of the device.
     */

    var i, l, csvString='', errormsg='';
    /* by creating a csvString representing csv file content
     * this code has the limitation that 2x the csv data must fit in memory
     */
    for(i=0,l=rows.length; i<l; ++i)
	csvString += '"'+rows[i].join('","')+'"'+"\n";
    // try IE solution first from Manu Sharma
    if (window && window.navigator && window.navigator.msSaveOrOpenBlob) {
	try {
	    var blob = new Blob(
		[decodeURIComponent(encodeURI(csvString))], {
		    type: "text/csv;charset=utf-8;"
		});
	    navigator.msSaveBlob(blob, fname);
	} catch(e){ 
	    errormsg = "error on html5-csv-download, file: "+fname+", IE blob branch:"+e;
	    if (typeof(onError)==='function'){
		return onError(errormsg, fname);
	    } else {
		return console.log(errormsg);
	    }
	}
    } else if (document && document.createElement) {
	// try adeneo's Firefox/Chrome solution here
	try {
	    var a = document.createElement('a');
	    if (!('download' in a)) throw "a does not support download";
	    a.href = 'data:attachment/csv,'+encodeURIComponent(csvString);
	    a.target = '_blank';
	    // use class instead of id here -- PJB 2015.01.10
	    a.class = 'dataURLdownloader';
	    a.download = fname;
	    document.body.appendChild(a);
	    a.click();
	} catch(e){
	    errormsg = "error on html5-csv-download, file: "+fname+", Chrome/Firefox branch:"+e;
	    if (typeof(onError)==='function'){
		return onError(errormsg, fname);
	    } else {
		return console.log(errormsg);
	    }   
	}
    } else if (fs && fs.writeFile){
	// nodeJS Hail Mary pass
	fs.writeFile(fname, csvString, function(e){
	    if (e){
		errormsg = "error on html5-csv-download, file: "+fname+", nodeJS branch:"+e;
		if (typeof(onError)==='function'){
		    return onError(e,fname);
		} else {
		    return console.log(errormsg);
		}
	    }
	});
    }
};
