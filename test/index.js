const assert = require('assert');
const exec = require('child_process').exec;
const fs = require('fs');

var bundleFileName = "./example/csv-file-creator-example-bundle.js";


describe(
    'run 10000 dice rolls csv generation example via "npm example"',
    function(){
	var error = false;
	before(function(done){
	    try {
		fs.unlinkSync("./dicerolls.csv");
	    } catch(e) {};
	    exec('npm run-script example', 
		 function(e, stdout, stderr){
		     error = e;
		     done();
		 });
	});
	after(function(){
	    try {
		fs.unlinkSync("./dicerolls.csv");
	    } catch(e) {};
	});
	it('should run without throwing an error', function(){
	    assert.ok(!error, error);
	});
	it('should create a file called dicerolls.csv', function(){
	    /* see:
	       http://stackoverflow.com/questions/4482686/check-synchronously-if-file-directory-exists-in-node-js
	    */
	    fs.accessSync("./dicerolls.csv", fs.F_OK);
	});
	it('the dicerolls.csv file should have 10001-10002 lines', function(){
	    var data = (fs
			.readFileSync("./dicerolls.csv", {encoding:"utf8"})
			.split("\n")
		       );
	    assert.ok((data.length === 10001) || (data.length === 10002));
	});
	it('the 10001th line should be "10000","<n>" where n is between 1 and 6', function(){
	    var data = (fs
			.readFileSync("./dicerolls.csv", {encoding:"utf8"})
			.split("\n")
		       );
	    var rowstring = data[10000];
	    var row = JSON.parse('['+rowstring+']');
	    assert.ok(row[0] === "10000");
	    assert.ok( (+row[1]<=6) && (+row[1]>0) );
	});
    }
);

describe('browserify bundling the example and module code ', function(){
    var error = 0;
    before(function(done){
	try {
	    fs.unliknkSync(bundleFileName);
	} catch(e){}
	exec('cd ./example && ./makeBundle.sh', 
	     function(e,stdout,stderr){
		 error = e;
		 done();
	     });
    });
    after(function(){
	try {
	    fs.unlinkSync(bundleFileName);
	} catch(e) {}
    });
    it('should run without throwing an error', function(){
	assert.ok(!error, error);
    });
    it('should create the bundle file '+bundleFileName, function(){
	fs.accessSync(bundleFileName, fs.F_OK);
    });
});

/* 
 * disable automated firefox testing.  Modal dialogue download/save-as box blocks testing 
 * the export-to-file functionality.

describe('running example in firefox ', function(){
    var error=0, mystderr=0;
    after(function(){
	try {
	    fs.unlinkSync(bundleFileName);
	} catch(e) {}
    });
    before(function(done){
	var firefox;
	try {
	    fs.unlinkSync("./dicerolls.csv");
	} catch(e){}
	var forceQuit = function(){
	    firefox.kill();
	    setTimeout(done, 5000);
	};
	setTimeout(forceQuit, 10000);
	firefox = exec('cd ./example && firefox index.html', 
		       function(e, stdout, stderr){
			   error=e;
			   mystderr=stderr;
		       });
    });
    after(function(){
	try {
	    fs.unlinkSync("./dicerolls.csv");
	} catch(e) {};
    });
    it('should run firefox without error', function(){
	assert(!error, error+" "+mystderr);
    });
    it('should create the file dicerolls.csv',
       function(){
	   fs.accessSync("./dicerolls.csv", fs.F_OK);
       });
});


*/
