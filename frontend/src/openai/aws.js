const { Upload } = require('@aws-sdk/lib-storage')
const { S3Client, S3 } = require('@aws-sdk/client-s3')
const fs = require('fs')

PORT=3000
S3_KEY=process.env.S3_KEY
S3_SECRET=process.env.S3_SECRET
S3_REGION='us-east-1'
S3_BUCKET='fus-n-touch-bucket'

imageFile = fs.readFileSync('/home/shuffles/Repos/fus-n-touch/example_input/house.png')

client = new S3Client({
    credentials: {
        accessKeyId: S3_KEY,
        secretAccessKey: S3_SECRET
    },
    region: S3_REGION
})

new Upload({
    client: client,
    params: {
        ACL: 'public-read',
        Bucket: S3_BUCKET,
        Key: Date.now().toString(),
        Body: imageFile
    }
})
    .done()
    .then(data => {
        console.log("Successfully uploaded file")
        console.log(data)
    })
    .catch(err => {
        console.error("An error occurred while uploading an image to AWS S3.")
        console.error(err)
    })