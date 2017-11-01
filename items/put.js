'use strict';

const _ = require('lodash');
const uuid = require('uuid');
const AWS = require('aws-sdk');
const moment = require('moment');

AWS.config.update({region:'ap-southeast-2'});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.put = (event, context, callback) => {
  const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
  const data = JSON.parse(event.body);

  // todo: add validation here for input
  // todo: update text if set

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },

    ExpressionAttributeValues: {
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET  checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: `Couldn't fetch the todo item with id ${event.pathParameters.id}`,
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};