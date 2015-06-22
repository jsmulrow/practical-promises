'use strict';

var Promise = require('bluebird');
var async = require('async');
var exerciseUtils = require('./utils');

var readFile = exerciseUtils.readFile;
var promisifiedReadFile = exerciseUtils.promisifiedReadFile;

var green = exerciseUtils.green;
var red = exerciseUtils.red;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * A. log poem two stanza one and stanza two, in any order
 *    but log 'done' when both are done
 *
 */

// callback version
async.each(['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'],
	function (filename, eachDone) {
		readFile(filename, function (err, stanza) {
			console.log('-- A. callback version --');
			green(stanza);
			eachDone();
		});
	},
	function (err) {
		console.log('-- A. callback version done --');
	}
);

// promise version
var files = ['poem-two/stanza-01.txt', 'poem-two/stanza-02.txt'].map(function(file) {
	return promisifiedReadFile(file).then(function(contents) {
		console.log('-- A. promise version --')
		green(contents);
	});
});

Promise.all(files).then(function() {
	console.log('-- A. Promise done --');
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * B. log all the stanzas in poem two, in any order
 *    and log 'done' when they're all done
 *
 */

var filenames = [1,2,3,4,5,6,7,8].map(function (n) {
	return 'poem-two/' + 'stanza-0' + n + '.txt';
});

// callback version
async.each(filenames,
	function (filename, eachDone) {
		readFile(filename, function (err, stanza) {
			console.log('-- B. callback version --');
			green(stanza);
			eachDone();
		});
	},
	function (err) {
		console.log('-- B. callback version done --');
	}
);

// promise version
var files = [1,2,3,4,5,6,7,8].map(function(num) {
	return promisifiedReadFile('poem-two/' + 'stanza-0' + num + '.txt').then(function (contents) {
		console.log('-- B. promise version --');
		green(contents);
	});
});

Promise.all(files).then(function() {
	console.log('-- B. Promise done');
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * C. log all the stanzas in poem two, *in order*
 *    and log 'done' when they're all done
 *
 */

// callback version
async.eachSeries(filenames,
	function (filename, eachDone) {
		readFile(filename, function (err, stanza) {
			console.log('-- C. callback version --');
			green(stanza);
			eachDone();
		});
	},
	function (err) {
		console.log('-- C. callback version done --');
	}
);

// promise version
Promise.reduce(filenames, function(total, file) {
	return promisifiedReadFile(file).then(function(contents) {
		console.log('-- C. promise version  --');
		green(contents);
	});
}, null).then(function() {
	console.log('-- C. Promises done');
});


 /* * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * D. log all the stanzas in poem two, *in order*
 *    making sure to fail for any error and log it out
 *    and log 'done' when they're all done
 */
 

var randIdx = Math.floor(Math.random() * filenames.length);
filenames[randIdx] = 'wrong-file-name.txt';

// callback version
async.eachSeries(filenames,
	function (filename, eachDone) {
		readFile(filename, function (err, stanza) {
			console.log('-- D. callback version --');
			if (err) return eachDone(err);
			green(stanza);
			eachDone();
		});
	},
	function (err) {
		if (err) red(err);
		console.log('-- D. callback version done --');
	}
);

// promise version
Promise.reduce(filenames, function(total, file) {
	return promisifiedReadFile(file).then(function(contents) {
		console.log('-- D. promise version --');
		green(contents);
	}, function(err) {
		red(err);
		// if we want to stop the remaining promises, throw this error
		// throw err;
	});
}, null).then(function() {
	console.log('-- D. Promises done');
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * E. make a promisifed version of fs.writeFile
 *
 */

var fs = require('fs');
function promisifiedWriteFile (filename, str) {
	return new Promise(function (resolve, reject) {
		fs.writeFile(filename, str, function(err) {
			if (err) reject(err);
			else resolve();
		});
	});
}

// for testing
promisifiedWriteFile('test.txt', 'this is a test').then(function() {
	green('the file was written');
}, function(err) {
	red('there was an error');
});


