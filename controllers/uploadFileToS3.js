const AWS = require("aws-sdk");
const axios = require("axios");

const s3 = new AWS.S3();

exports.handler = async (event, context) => {
  try {
    const { signedRequest, file, options, bucketName, objectKey } = event;

    const response = await axios.put(signedRequest, file, options);

    await s3
      .putObject({
        Bucket: bucketName,
        Key: objectKey,
        Body: file,
        ACL: "public-read",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully",
        location: `https://${bucketName}.s3.amazonaws.com/${objectKey}`,
      }),
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error uploading file",
      }),
    };
  }
};
