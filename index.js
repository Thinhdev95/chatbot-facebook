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


app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'thinh_dev_95') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
// app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

// server.listen(app.get('port'), app.get('ip'), function() {
    server.listen(process.env.PORT, function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});
