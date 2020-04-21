var http = require('http');
const express = require('express');
const router = express.Router();
const request = require('request-promise-native'); // use Request library + promises to reduce lines of code

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8081, '192.168.1.253');
console.log('Server running at http://192.168.0.9:8081/');



router.post("/" , async (req, res) => {
	
	  const date = req.body.hello;
  const id = req.body.hello1;
  
  console.log(date);
  console.log(id);
});