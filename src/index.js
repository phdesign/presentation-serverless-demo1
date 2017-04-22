'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = (event, context, callback) => {
    // We'll rename the resize image with this suffix
    const SUFFIX = '-small';
    const bucket = event.Records[0].s3.bucket.name;
    const fileKey = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    const newKey = fileKey.replace(/^(.*)(\.[^.]+)$/, `$1${SUFFIX}$2`);
    // Resize the image to these dimensions
    const dimensions = { width: 100, height: 100 };
    
    // Avoid infinite loop of resized image triggering another lambda
    if (new RegExp(`${SUFFIX}\.[^.]+$`).test(fileKey)) {
        callback(null, 'Skipping resized image');
        return;
    }
    
    // Get the file from S3
    S3.getObject({Bucket: bucket, Key: fileKey}).promise()
        // Use the jimp library to resize the image
        .then(data => new Promise((resolve, reject) => {
            Jimp.read(data.Body)
                .then(image => image.resize(dimensions.width, dimensions.height))
                .then(image => image.getBuffer(data.ContentType, (err, src) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({ mime: data.ContentType, buffer: src });
                }));
        }))
        // Save the resized image back to S3
        .then(data => S3.putObject({
                Body: data.buffer,
                Bucket: bucket,
                ContentType: data.mime,
                Key: newKey,
            }).promise()
        )
        .then(() => callback(null, `Saved resized image to ${bucket}\\${newKey}`))
        .catch(err => callback(err))
};
