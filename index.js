//var http = require('http');


const express = require('express');
const app = express();
//const router = express.Router();
const request = require('request-promise-native'); // use Request library + promises to reduce lines of code

// http.createServer(function (req, res) {
  // res.writeHead(200, {'Content-Type': 'text/plain'});
  // res.end('Hello World\n');
// }).listen(8081, '192.168.1.253');
// console.log('Server running at http://192.168.0.9:8081/');

app.use(express.urlencoded());
app.use(express.json());

app.post("/" , (req, res) => {
	
	 var date = req.body.hello;
  var id = req.body.hello1;
  
  console.log(date);
  console.log(id);
res.send(date);
});


app.listen(8081, '192.168.0.9', function()
{
	//console.log("... port %d in %s mode", app.address().port, app.settings.env);
	
});