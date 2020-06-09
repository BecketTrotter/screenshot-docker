var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var express = require('express');
var app = express();
var md5sum = crypto.createHash('md5');
var { Builder } = require('selenium-webdriver');
var chromedriver = require('chromedriver');


function spin_driver(){
  var chrome = require('selenium-webdriver/chrome');
  var options = new chrome.Options();
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--no-sandbox');
  options.addArguments('--headless');

  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  return driver;
  }

driver = spin_driver();


const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}



async function ss(url) {
  var hash = crypto.createHash('md5').update(url).digest('hex');
  url = 'http://www.' + url;
  
  await driver.get(url).catch((error) => {
    console.error(error);
  });

  driver.takeScreenshot().then(
  function(image, err) {
      require('fs').writeFile(hash + '.png', image, 'base64', function(err) {
          console.log(err);
          return 1;
  });});}


async function check(filepath) {
  if(fs.existsSync(filepath)) {
      return 1;
  } else {
      await sleep(750);
      await check(filepath);
  }
}

async function serve_file(filepath, res){
  await check(filepath);

  const file = fs.createReadStream(filepath);
  file.pipe(res);
  
  fs.unlink(filepath, (err) => {
      console.log(err);});
}

app.get("/req/:tagID",async function(req, res){
  var hash = crypto.createHash('md5').update(req.params.tagID).digest('hex');
	
  filepath = './' + hash + '.png';
  
  url = 'http://www.' + req.params.tagID;

  await driver.get(url).catch((error) => {
    console.error(error);
  });

  driver.takeScreenshot().then(
  function(image, err) {
      require('fs').writeFile(hash + '.png', image, 'base64', function(err) {
          console.log(err);
          return 1;
      });
  }
  );
  serve_file(filepath, res);
});

app.listen(8080);
//app.listen(process.env.PORT || 8080)