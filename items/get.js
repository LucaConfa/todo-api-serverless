'use-strict';

const AWS = require('aws-sdk');
AWS.config.update({region:'ap-southeast-2'});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

// Get a single item
module.exports.get = (event, context, callback) => {
  console.log(event.pathParameters)
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };
  // fetch a single item from the database
  dynamoDb.get(params, (error, result) => {

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
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
