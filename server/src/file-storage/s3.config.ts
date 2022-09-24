import AWS from 'aws-sdk';

const Bucket = 'bzwr-mirza';
const clientConfig: AWS.S3.ClientConfiguration = {
  accessKeyId: 'AKIAYNEOQTI4FD65UGWW',
  apiVersion: '2006-03-01',
  region: 'us-west-2',
  secretAccessKey: 'z53UyDT5hynyJIu4cDV+iLuFzrHF3ZNnB2EiTjLt',
};
const putObjectRequestConfig = {
  Bucket,
  SSEKMSKeyId:
    'arn:aws:kms:us-west-2:577971984952:key/6c510864-02a3-4c8c-bc75-2b311ea1c100',
  ServerSideEncryption: 'aws:kms',
};

export default () => ({
  s3Client: new AWS.S3(clientConfig),
  s3UploadOptions: putObjectRequestConfig,
  Bucket,
});
