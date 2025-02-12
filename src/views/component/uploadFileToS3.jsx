import AWS from 'aws-sdk';

export const uploadFileToS3 = (file, poFileChange) => {
  AWS.config.update({
    accessKeyId: 'USDXRENI3CQ7AX70LPD7',
    secretAccessKey: '6yRewo6kV5cc1z96LIbwwetL3y7r3REWVoodnDdh',
    region: 'ap-southeast-1'
  });

  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint('https://s3.ap-southeast-1.wasabisys.com'),
    s3ForcePathStyle: true // Use path style addressing
  });
  const bucketName = 'svgjpr';
  const fileType = file?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg';
  const key = `fleetask/${file}`;
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: poFileChange || '',
    ACL: 'public-read',
    ContentType: fileType
  };
  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
    } else {
      console.log('Upload successful:', data?.Location);
    }
  });
};
