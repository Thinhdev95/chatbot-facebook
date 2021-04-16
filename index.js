var logger = require('morgan');
var http = require('http');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
const verify_token = "thinh_dev_95";
const verify_access_token = "EAACzCfdQZBI0BAKNA3aflxZAcbETIpZC6h5T9MpvH8atfSx4ESLRIS5o7NNi9mSmFxiNsVdxSpyZBJcSeVZC5ZBxAGDNAWob8UW895xQBKeRDoCwXjZBljzKt9imc2lP3Ynw4ZCuwQchtyAJi9iV4lSLJ1eD5CtGrzek8ir0ddJon045entuzbBs";


app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'thinh_dev_95') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});
app.post('/webhook', (req, res) => {  

    // Parse the request body from the POST
    let body = req.body;
  
    // Check the webhook event is from a Page subscription
    if (body.object === 'page') {
  
      // Iterate over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Get the webhook event. entry.messaging is an array, but 
        // will only ever contain one event, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log('Sender PSID: ' + sender_psid);
        
      });
  
      // Return a '200 OK' response to all events
      res.status(200).send('EVENT_RECEIVED');
  
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
  });

// app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
// app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

// server.listen(app.get('port'), app.get('ip'), function() {
    server.listen(process.env.PORT, function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});
