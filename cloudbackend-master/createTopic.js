const {CreateTopicCommand } = require( "@aws-sdk/client-sns");
const {snsClient } = require( "./snsClient.js");
const {SubscribeCommand } = require( "@aws-sdk/client-sns");

// Set the parameters


exports.createTopic = async function (topic,clientemail,provideremail){


const topic_params = { Name: topic }; //TOPIC_NAME
const subscriber_params = {
    Protocol: "email" /* required */,
    TopicArn: 'arn:aws:sns:us-east-1:188195630059:'+topic, //TOPIC_ARN
    Endpoint: clientemail, //EMAIL_ADDRESS
  };
const subscriber_param = {
    Protocol: "email" /* required */,
    TopicArn: 'arn:aws:sns:us-east-1:188195630059:'+topic, //TOPIC_ARN
    Endpoint: provideremail, //EMAIL_ADDRESS
  };

const run = async () => {
  try {
    const data1 = await snsClient.send(new CreateTopicCommand(topic_params));
    const data2 = await snsClient.send(new SubscribeCommand(subscriber_params));
    const data3 = await snsClient.send(new SubscribeCommand(subscriber_param));

    console.log("Success.",  data1);
    console.log("Success.",  data2);
    console.log("Success.",  data3);
    return data1; // For unit tests.
  } catch (err) {
    console.log("Error", err.stack);
  }
};
await run();
};
