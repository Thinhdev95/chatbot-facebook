var logger = require('morgan');
var http = require('http');
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser')
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

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === verify_token) {
        res.send(req.query['hub.challenge']);
    }
    res.send('Error, wrong validation token');
});
app.post('/webhook', (req, res) => {
    let body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            }
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});
function handleMessage(sender_psid, received_message) {
    let response;
    let textreponse = "Hello bạn , tôi là bot đây";
    if (received_message.text) {  
        console.log(received_message.text)
        switch(true){
            case received_message.text.includes("Hello"): textreponse = "Hello bạn"
            break;
            case received_message.text.includes("hi"): textreponse = "Hi bạn"
            break;
            default: textreponse = "Bạn nói gì vậy"
        }
      response = {
        "text": textreponse
      }
    }  
    callSendAPI(sender_psid, response); 
}
function handlePostback(sender_psid, received_postback) {

}
function callSendAPI(sender_psid, response) {
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }
    request({
        "uri": "https://graph.facebook.com/v2.6/me/messages",
        "qs": { "access_token": verify_access_token },
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send message:" + err);
        }
    });
}
server.listen(process.env.PORT, function () {
    console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});
