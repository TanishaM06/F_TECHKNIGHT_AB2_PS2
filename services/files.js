const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Use environment variable
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Use environment variable
  region: 'us-east-1',
});


async function uploadFile(projectId, fileBuffer, fileName) {
  try {
    const params = {
      Bucket: 'ui-design-platform-bucket',
      Key: `${projectId}/${fileName}`,
      Body: fileBuffer,
    };
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Could not upload file');
  }
}


module.exports = { uploadFile };
