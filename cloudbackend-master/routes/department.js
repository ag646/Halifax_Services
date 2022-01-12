const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName='department';

const getDepartments = async (req, res) => {
    const params = {
      TableName: dynamodbTableName
  }
  const alldepartments = await scanDynamoRecords(params, []);
  console.log(alldepartments);
  const body = {
      departments: alldepartments
  }
  res.send(body);
  }

  async function scanDynamoRecords(scanParams, itemArray) {
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        return itemArray;
    } catch(error) {
        console.error(error);
    }
  }

  const addDepartment = async (req, res) => {
      const params = {
          TableName: dynamodbTableName,
          Item: {department_id:req.body.department_id,
            department_name:req.body.department_name}
      }
      dynamodb.put(params).promise().then(() => {
        const body = {
          Operation: 'SAVE',
          Message: 'SUCCESS'
        }
        res.send(body);
      }).catch(err => {
        console.log(err);
      }) 
  }
  
  const modifyDepartment = async (req, res) => {
      const params = {
          TableName: dynamodbTableName,
          Key: {department_id:req.body.department_id},
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
  }

  const deleteDepartment = async (req, res) => {
      const params = {
          TableName: dynamodbTableName,
          Key: {department_id: req.body.department_id}
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

router.get("/departments", getDepartments)
router.post("/adddepartment", addDepartment)
router.patch("/modifydepartment", modifyDepartment)
router.delete("/deletedepartment", deleteDepartment)

module.exports = router;