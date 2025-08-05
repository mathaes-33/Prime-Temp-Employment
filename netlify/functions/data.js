const path = require('path');
const fs = require('fs');

exports.handler = async function(event, context) {
  try {
    const filePath = path.resolve(__dirname, '../../db.json');
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);

    return {
      statusCode: 200,
      body: JSON.stringify(json),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to read db.json' })
    };
  }
};
