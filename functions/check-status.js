const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const pollUrl = event.queryStringParameters.poll;

  if (!pollUrl) {
    return {
      statusCode: 400,
      body: "Missing poll URL",
    };
  }

  try {
    const res = await fetch(pollUrl);
    const text = await res.text();

    if (text.toLowerCase().includes("paid")) {
      return {
        statusCode: 200,
        body: JSON.stringify({ paid: true }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ paid: false }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Error checking payment: " + err.toString(),
    };
  }
};