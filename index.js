
//obselete
//const router = express.Router();
//var http = require('http');
// http.createServer(function (req, res) {
  // res.writeHead(200, {'Content-Type': 'text/plain'});
  // res.end('Hello World\n');
// }).listen(8081, '192.168.1.253');
// console.log('Server running at http://192.168.0.9:8081/');



const express = require('express');
const app = express();
const request = require('request-promise-native'); // use Request library + promises to reduce lines of code
const fs = require('fs');
const readline = require('readline');

//article classification
const huodongfabu = './articles/article_huodongfabu';
const zhengcewenjian = './articles/article_zhengcewenjian'
const dongtaixinxi = './articles/article_dongtaixingxi'
const xuqiuxinxi = './articles/article_xuqiuxinxi'
const chanyepingtai = './articles/article_chanyepingtai'
const jujiafuwu = './articles/article_jujiafuwu'
const banshizhinan = './articles/article_banshizhinan'



const source = './articles/'

app.use(express.urlencoded());
app.use(express.json());

//allow origin need to be changed to desitnation content
app.post("/article", async (req,res) => {
		
	//need to get page number from here page should start from 0
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	
	//get the article number and tabselection
	var filenumber = req.body.number;
	var tabselection = req.body.tabselection;
	
	if(filenumber == "undefined" && tabselection == "undefined")
	{
		res.send("");
	}
	else
	{
		//linux dependent area
		var path = source + 'article_' + tabselection + '/' + filenumber.toString() + '.content';
					//linux dependent area
					console.log(tabselection);
					var file = source + 'article_' + tabselection + '/' + filenumber.toString() + '.json';
					var file_content = fs.readFileSync(file);
					var json = JSON.parse(file_content);
					let obj = {
					"Title": json.title,
					"author": json.author,
					"date": json.date,
					"content": ""
					}
					fs.readFile(path, function (err, data ) {
					
					obj["content"] = data.toString();
					res.send(obj);
					});
		
	}
	
	
});



//populate title in the 
app.post("/main", (req, res) => {
	

	
	//need to get page number from here page should start from 0
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');


	//loop through each article directory
	var listofdir = getDirectories(source);
	var outarry = [];
	
	main_dirhandler(listofdir,res);
	
	
	console.log("too fast again");
	console.log(outarry);

});





function main_dirhandler(listofdir,res)
{
	

  

	
    var outarry = new Array(7);
	var count = 0;
	//synchronous action here should be fine
	listofdir.forEach(async function(value){
		var filecount;
		var loopcount = 5;
		console.log("what value" + value);
				
		try{
				 const promise = main_readdir(loopcount,count,value, outarry);
				 const promise2 = promise.then(function(result)
				 {
					 //return here
					 console.log("what is dat result");
					 console.log(result);
					// console.log("passing here " + outarry);
					if(result[1] == 6)
					{
						res.send(result[0]);
						
					}
				
				 }
				 
				 ,function(error) 
				 
				 {
					 console.log("no");
					 
					 
				 });
				 
				 
				
				
				}
				catch{
					console.log("something is wrnog");
				}
	
				
		count=count+1;		
		
	});
	
		
	
	return outarry;
}

 function main_readdir(loopcount,loopnumber, value, outarry)
{
		return new Promise(async(resolve,reject) => {
			
		//read the number of files in that directory
		await fs.readdir(source + value,  async (err, files) => {
			
			try{
				//please handle error
				filecount = files.length;
					
				
				
				var tmp = await main_parseandcreatejsonarry(filecount, loopcount, source + value);
				
				console.log("too fast bro");
				console.log("whati s the value" + value);
				outarry[loopnumber] =tmp;
				resolve([outarry,loopnumber]);
			}
			catch
			{
				reject("");
				
			}
			

		});			
			
			
			
		});		

				
	
}

function main_parseandcreatejsonarry(filecount, loopcount, infile)
{
			var filecounttmp = filecount /2;
			var innerarry = [];
			if(filecounttmp < loopcount)
			{
				loopcount = filecounttmp;
				
			}
			
			for(var i = filecounttmp;i > (filecounttmp - loopcount);i--)
			{
				var file = infile + '/' + i.toString() + '.json';
				var file_content = fs.readFileSync(file);
				var json = JSON.parse(file_content);
				
				let obj = {
					"Title": json.title,
					"date": json.date,
				}
				
				innerarry.push(obj);
				
			}
			
			console.log("inner array is" + innerarry);
			return innerarry;
	
}



const getDirectories = source =>
	fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)


//article post should perform IO operation here to read file
app.post("/" ,async (req, res) => {
	

	//need to get page number from here page should start from 0
       // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    
	
  
	var pagenumber = req.body.pagenumber;
	var tabselection = req.body.tabselection;
	
	console.log(tabselection)
	
	if(!pagenumber && !tabselection)
	{
		res.send("");
	}
	else
	{
		switch(tabselection) {
		  case "dongtaixingxi":
			// code block
			tabselection = dongtaixinxi;
			break;
		  case "zhengcewenjian":
			// code block
			tabselection = zhengcewenjian;
			break;
		
		  case "xuqiuxinxi":
		    tabselection = xuqiuxinxi;
			break;
		  case "chanyepingtai":
		    tabselection = chanyepingtai;
			break;
			
		  case "banshizhinan":
		    tabselection = banshizhinan;
			break;
		   case "huodongfabu":
		    tabselection = huodongfabu;
			break;
		   case "jujiafuwu":
		   tabselection = jujiafuwu;
			break;
		  default:
			// code block
			tabselection = rencaiyizhan;
		}
		
		var filecount;
		var latestfile;
		var numofarticletodisplay = 6;
		var wordstoread = 800; //800 bytes please do conversion here later; only need to store 800 byte (800 character for chinese it is 2/bytes per chinese character 400 words)
		var outarry = [];
		
		
		//read the number of files in that directory
		await fs.readdir(tabselection, async (err, files) => {
			
			//please handle error
			filecount = files.length;
			
			
			
			filecount=filecount/2;
			restoffilecount = filecount - (pagenumber * numofarticletodisplay);
			var loopcount = 6;
			//article overflow error
			if(restoffilecount >0 && restoffilecount < numofarticletodisplay)
			{
				loopcount = restoffilecount % numofarticletodisplay;
				try{
				 const promise = readfile(tabselection,outarry,restoffilecount,loopcount, wordstoread);
				 const promise2 = promise.then(function(result)
				 {
					 //return here
					 res.send(outarry);
				 }
				 
				 ,function(error) 
				 
				 {
					 console.log("no");
					 
					 
				 });
				 
				 
				
				
				}
				catch{
					console.log("something is wrnog");
				}
				
			}
			else
			{
				//nothing to display
				res.send("")
				
			}

		

		});
		
	}
	


	
});



async function readfile(tabselection, outarry,restoffilecount , loopcount, wordstoread)
{
		//var obj = JSON.parse(fs.readFileSync('file', 'utf8'));
		for (var i = restoffilecount;i > (restoffilecount- loopcount); i--)
		{
			var file = tabselection + '/' + i.toString() + '.json';
			var file_content = fs.readFileSync(file);
			var json = JSON.parse(file_content);
			var articlef = tabselection + '/' +  json.content;
			var stats = fs.statSync(articlef)
			var fileSizeInBytes = stats["size"]
			
			//check the size of the file < 800 byte do what, > 800 byte
			if(fileSizeInBytes < 800)
			{
				wordstoread = fileSizeInBytes;
				
			}
			readfile(file,json,articlef);
			var fd = fs.openSync(articlef,'r');
			var b = new Buffer.alloc(wordstoread);
			
			//has to do this to make a asynchronous callback
			var obj = await parsefileandcreatejson(fd,b,json, wordstoread);		

			//destroying obejct/reset object
			outarry.push(obj);
			fs.closeSync(fd);
			wordstoread = 800;	
		}
		
	
		return outarry;
	
	
	
}

function parsefileandcreatejson(fd,b,json,wordstoread)
 {
	return new Promise((resolve,reject) => {
		
		fs.read(fd, b, 0, wordstoread, 0, (err,bytesRead, buffer) => {
			if(err) 
			{
				reject("");	
			}
			else
			{				
				let obj = {
					"Title": json.title,
					"author": json.author,
					"date": json.date,
					"content": buffer.toString()
			}			
				resolve(obj);
					
			}
		});
	});	
 }



app.listen(8081, '192.168.0.9', function()
{
	//console.log("... port %d in %s mode", app.address().port, app.settings.env);
	
});