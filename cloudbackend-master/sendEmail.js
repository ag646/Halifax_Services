const express = require('express')


const {PublishCommand } =  require("@aws-sdk/client-sns");
const {snsClient } = require("./snsClient");

exports.sendEmail = function (message, service_id) {
  var params = {
    Message: message, // MESSAGE_TEXT
    TopicArn: `arn:aws:sns:us-east-1:188195630059:${service_id}`, //TOPIC_ARN
  };
  
  const run = async () => {
    try {
      const data = await snsClient.send(new PublishCommand(params));
      console.log("Success.",  data);
      return data; // For unit tests.
    } catch (err) {
      console.log("Error", err.stack);
    }
  };
  run();
      
    
  };
  
