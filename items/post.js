'use-strict';

const _ = require('lodash');
const uuid = require('uuid');
const AWS = require('aws-sdk');
const moment = require('moment');

AWS.config.update({region:'ap-southeast-2'});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Create a single item
module.exports.post = (event, context, callback) => {

  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      body: data.body.trim(),
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo item to the database
  dynamoDb.put(params, (error) => {
    // if ther are errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};