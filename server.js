var http = require('http')
  , util = require('util')
  , os = require('os')
  , url = require('url')
  , fs = require('fs')
  ;
var reqs = 0;

function dispStruct(res, obj, prefix) {
	if (typeof(obj) === "object") {
		res.write("\n");
		var prefix1 = prefix + "  ";
		for (k in obj) {
			res.write(prefix1 + k + ": ");
			dispStruct(res, obj[k], prefix1);
		}
	} else {
		res.write(obj + "\n");
	}
}

var server = http.createServer(function (req, res) {
	// Listener for the request end:
	req.on("end", function() {
		reqs++;
		var parsed = url.parse(req.url, true);
		res.writeHead(200, { 'content-type': 'text/plain' });
		res.write(util.format('%d requests so far.\n', reqs));
		res.write("parsed: "); dispStruct(res, parsed, "");
		res.end();
	});
})

server.listen(1105, '127.0.0.1');

console.log('Server running on 1105');