'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');

const router = express.Router();
router.get('/', (req, res) => {
    res.json({
      "message": "I'm a Chatbot WebService"
    })
});

// Facebook
router.get('/webhook/', (req, res) =>{
  if (req.query['hub.verify_token'] === "yacin235") {
      res.send(req.query['hub.challenge'])
  }
  res.send('Wrong token');
});
//  Send 
router.post('/webhook/', (req, res) =>{
  let messaging_events = req.body.entry[0].messaging;
  for (let i = 0 ; i < messaging_events.length; i++){
      let event = messaging_events[i]
      let sender = event.sender.id;
      if (event.message && event.message.text){
          let text = event.message.text;
          sendText(sender, "Text echo" + text.substring(0,100));
      }
  }
});

function sendText(sender, text){
  let messageData = {text: text};
  request({
      url : "https://graph.facebook.com/v2.6/me/messages",
      qs: {access_token: token},
      method: "POST",
      json: {
          recipient : {id: sender},
          message: messageData
      }
  }, (error, response, body)=>{
      if (error) {
          console.log("sending error");
      }else if (response.body.error) {
          console.log(response.body.error)
      }
  })
}


app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda


module.exports = app;
module.exports.handler = serverless(app);
