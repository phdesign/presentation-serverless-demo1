'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    const bucket = event.Records[0].s3.bucket.name;
    const fileKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const newKey = 
    console.log(`bucket: ${bucket}, fileKey: ${fileKey}`);
    
    S3.getObject({Bucket: bucket, Key: fileKey}).promise()
        .then(data => new Promise((resolve, reject) => {
            Jimp.read(data.Body)
              .then(image => image.resize(100, 100))
              .then(image => image.getBuffer(Jimp.AUTO, (err, src) => { 
                  if (err) {
                      reject(err);
                      return;
                  }
                  resolve({ mime: image.getMIME(), buffer: src }); 
              }));
        }))
        .then(data => S3.putObject({
            Body: data.buffer,
            Bucket: bucket,
            ContentType: data.mime,
            Key: newKey,
          }).promise()
        )
        //.then(result => console.log(result))
        .then(() => callback(null, `Saved resized image to ${bucket}\\${newKey}`))
        .catch(err => callback(err))
};
