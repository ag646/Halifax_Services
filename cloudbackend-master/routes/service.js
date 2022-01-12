const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const { sendEmail } = require('../sendEmail');
AWS.config.update({
    region: 'us-east-1',
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName='services';

const getServices = async (req, res) => {
  const params = {
    TableName: dynamodbTableName
}
const allservices = await scanDynamoRecords(params, []);
console.log(allservices);
const body = {
    services: allservices
}
res.send(body);
}

const getProviderServices = async (req, res) => {
  let whereVariables = {
    ":provider_id": req.body.provider_id
  }
  let expression = "provider_id = :provider_id"
  if(req.body.service_status) {
    whereVariables[":service_status"] = req.body.service_status
    expression = expression + " AND service_status = :service_status"
  }
  const params = {
    TableName: dynamodbTableName,
    FilterExpression: expression,
    ExpressionAttributeValues: whereVariables
  }
  const allservices = await scanDynamoRecords(params, []);
  const body = {
      services: allservices
  }
  res.send(body);
}

async function scanDynamoRecords(scanParams, itemArray) {
  try {
      const dynamoData = await dynamodb.scan(scanParams).promise();
      itemArray = itemArray.concat(dynamoData.Items);
      return itemArray;
  } catch(error) {
      console.error('',error);
  }
}

// const getService = async (req, res) => {
//   const params = {
//     TableName: dynamodbTableName,
//     Key: {services_id:req.body.services_id}
//   }
// }
const addService = async (req, res) => {
  const params = {
    TableName: dynamodbTableName,
    Item: {
      service_id: req.body.service_id,
      service_type: req.body.service_type,
      service_charge: req.body.service_charge,
      service_status: req.body.service_status,
      client_id: req.body.client_id,
      client_name: req.body.client_name,
      client_email: req.body.client_email,
      provider_id: req.body.provider_id,
      provider_name: req.body.provider_name,
      provider_email: req.body.provider_email
    }
  }
    dynamodb.put(params).promise().then(async () => {
    const body = {
      Operation: 'SAVE',
      Message: 'SUCCESS'
    }
    var createTopic = require("../createTopic")
    await createTopic.createTopic(req.body.service_id,req.body.client_email,req.body.provider_email)
    res.send(body);
  }).catch(err => {
    console.log(err);
  }) 
}

const modifyService = async (req, res) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {service_id: req.body.service_id},
    UpdateExpression: `set ${req.body.updateKey} = :value`,
    ExpressionAttributeValues: {
      ':value': req.body.updateValue
    }
  }
    dynamodb.update(params).promise().then(() => {
    const body = {
      Operation: 'UPDATE',
      Message: 'SUCCESS'
    }
    res.send(body);
  }).catch(err => {
    console.log(err);
  })
  if (req.body.updateKey == 'service_status' && req.body.updateValue == 'Rejected') {
      var sendEmail = require("../sendEmail")
      sendEmail.sendEmail(`Status of Service "${req.body.service_type}" is changed to active.`, req.body.service_id)
    }
  if (req.body.updateKey == 'service_status' && req.body.updateValue == 'InProgress') {
      var sendEmail = require("../sendEmail")
      sendEmail.sendEmail(`Status of Service "${req.body.service_type}" is changed to in Progress.`, req.body.service_id)
    }
  if (req.body.updateKey == 'service_status' && req.body.updateValue == 'Finished') {
      var sendEmail = require("../sendEmail")
      sendEmail.sendEmail(`Status of Service "${req.body.service_type}" is changed to Finished.`, req.body.service_id)
    }
}

const deleteService = async (req, res) => {
  const params = {
    TableName: dynamodbTableName,
    Key: {service_id: req.body.service_id}
  }
  dynamodb.delete(params).promise().then(() => {
    const body = {
      Operation: 'DELETE',
      Message: 'SUCCESS',
    }
    res.send(body);
  }).catch(err => {
    console.log(err)
  })
}
const handleDummy = (req, res) => {
  res.send("Here is dummy.")
}

router.get("/services", getServices)
router.post("/provider_services", getProviderServices)
// router.get("service", getService)
router.post("/addservice", addService)
router.patch("/modifyservice", modifyService)
router.post("/deleteservice", deleteService)

module.exports = router