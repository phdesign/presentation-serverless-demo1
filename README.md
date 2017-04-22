# Presentation Serverless - Demo 1 (S3 Image Resize)

## To build code 

```
npm install
npm start
```

The built file will be in `build/Index.js`.

## To use

1. Log in to AWS.

2. Create a new Lambda named `paulhDemoImageResize`

3. Select Blank template

4. Have no trigger

5. Create new role with the following policy:

   ```
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Sid": "Stmt1492742055000",
               "Effect": "Allow",
               "Action": [
                   "s3:PutObject",
                   "s3:GetObject"
               ],
               "Resource": [
                   "arn:aws:s3:::*"
               ]
           }
       ]
   }
   ```

6. Run hello world sample

7. Create a new S3 bucket named `paulh-demo`

8. In the Lambda, configure a trigger for S3, all creation events for the bucket you just created

9. Build this project and copy the code from `build/index.js` to the Lambda code

10. Upload an image to the bucket

11. Watch it get resized and another image saved next to it with suffix `-small`