const fetch = require("node-fetch");
const crypto = require("crypto");

exports.handler = async (event, context) => {
  const integrationId = "22728"; // your Paynow Integration ID
  const integrationKey = "a0fe927d-f148-4c96-a300-1ba8714161b8"; // your Paynow Integration Key

  const amount = "1.00"; // amount in USD or ZWL depending on your setup

  // Paynow API URL
  const url = "https://www.paynow.co.zw/interface/initiatetransaction";

  // Build payload
  let payload = {
    id: integrationId,
    amount: amount,
    currency: "USD",
    description: "Unlock Access",
    returnurl: "https://your-site.netlify.app/success.html", // change to your actual site
    resulturl: "https://your-site.netlify.app/success.html", // change to your actual site
    authemail: "takunda@test.com", // optional: customer email
  };

  // Convert payload to URL-encoded string
  const formBody = new URLSearchParams(payload).toString();

  try {
    // Send POST request to Paynow
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formBody,
    });

    const text = await res.text();

    // Extract redirect URL from Paynow response
    const redirectUrl = text.match(/redirecturl=([^&]+)/);
    const pollUrl = text.match(/pollurl=([^&]+)/);

    if (!redirectUrl || !pollUrl) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Paynow error", raw: text }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        redirect: decodeURIComponent(redirectUrl[1]),
        poll: decodeURIComponent(pollUrl[1]),
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: "Server Error: " + err.toString(),
    };
  }
};