const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName='user';
const getUsers = async (req, res) => {
    const params = {
        TableName: dynamodbTableName
    }
    const allusers = await scanDynamorecords(params, []);
    console.log(allusers);
    const body = {
        users: allusers
    }
    res.send(body);
}
async function scanDynamorecords(scanParams, itemArray) {
    try {
        const dynamoData = await dynamodb.scan(scanParams).promise();
        itemArray = itemArray.concat(dynamoData.Items);
        return itemArray        
    } catch (error) {
        console.log(error)        
    }
}

const addUser = async (req, res) => {
    const params = {
        TableName: dynamodbTableName,
        Item: {
            user_id: req.body.user_id, 
            user_type: req.body.user_type,
            user_email: req.body.user_email,
            user_name: req.body.user_name,
            department_id: req.body.department_id,
            department_name: req.body.department_name
        }
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

const modifyUser = async (req, res) => {
    const params = {
        TableName: dynamodbTableName,
        Key: {user_id: req.body.user_id},
        UpdateExpression: `set ${req.body.updateKey} = :value`,
          ExpressionAttributeValues: {
            ':value': req.body.updateValue
          }
    }
    dynamodb.update(params).promise().then(() =>{
        const body = {
            Operation: 'UPDATE',
            Message: 'SUCCESS'
          }
          res.send(body);
        }).catch(err => {
          console.log(err);
    })
}

const deleteUser = async (req, res) => {
    const params = {
        TableName: dynamodbTableName,
        Key: {user_id: req.body.user_id}
    }
    dynamodb.delete(params).promise().then(() => {
        const body = {
            Operation: 'DELETE',
            Message: 'SUCCESS',
          }
          res.send(body);
        }).catch(err => {
            res.send(err)
          console.log(err)
        })

}

const searchUserByDepartment = async (req, res) => {
    const params = {
        TableName: dynamodbTableName,
        FilterExpression: 'department_name = :department_name',
            ExpressionAttributeValues: {
                ':department_name': {'S': req.body.department_name}
            },
            ProjectionExpression: "department_name",

    } 
    console.log(params);
    try{
        let itemArray = []
    const dynamodata = await dynamodb.scan(params).promise()
    itemArray = itemArray.concat(dynamodata.Items)
        const body = {
            users: dynamodata
        }
        res.send(body);
    }catch(err){
        console.log(err)
    }
    
}

router.get("/users", getUsers)
// router.get("/user", getUser)
router.post("/adduser", addUser)
router.patch("/modifyuser", modifyUser)
router.post("/deleteuser", deleteUser)
router.get("/searchuserbydepartment", searchUserByDepartment)

module.exports = router