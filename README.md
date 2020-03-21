# React Native Upload AWS S3

React Native Upload AWS S3 is a module for uploading files to S3. The base module is benjreinhart's `React Native AWS3(https://github.com/benjreinhart/react-native-aws3)`. The reason I made it new based on his module is that his module has not been uploaded for a long time and causes an SSL error.

```
npm install react-native-upload-aws-s3
yarn add react-native-upload-aws-s3
```

## Note on S3 user permissions

The user associated with the `accessKey` and `secretKey` you use must have the appropriate permissions assigned to them. My user's IAM policy looks like:

```json
{
    "Version": "2020-03-21",
    "Statement": [
        {
            "Sid": "stmt20200321",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectVersionAcl"
            ],
            "Resource": [
                "arn:aws:s3:::my-bucket/uploads/*"
            ]
        }
    ]
}
```

## Example

```javascript

import { RNS3 } from 'react-native-aws3';


async function uploadToS3(){
  const file = {
    // `uri` can also be a file system path (i.e. file://)
    uri: "assets-library://asset/asset.PNG?id=655DBE66-8008-459C-9358-914E1FB532DD&ext=PNG",
    name: "image.png",
    type: "image/png"
  }

  const options = {
    keyPrefix: "uploads/",
    bucket: "your-bucket",
    region: "us-east-1",
    accessKey: "your-access-key",
    secretKey: "your-secret-key",
    successActionStatus: 201
  }

  try{
    const response = await RNS3.put(file, options)
    if (response.status === 201){
      console.log("Success: ", response.body)
      /**
       * {
       *   postResponse: {
       *     bucket: "your-bucket",
       *     etag : "9f620878e06d28774406017480a59fd4",
       *     key: "uploads/image.png",
       *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
       *   }
       * }
       */
    } else {
      console.log("Failed to upload image to S3: ", response)
    }
  } catch(error){
    console.log(error)
  }
}
```

## Usage

### put(file, options)

Upload a file to S3.

Arguments:

1. `file`
  * `uri` **required** - File system URI, can be assets library path or `file://` path
  * `name` **required** - The name of the file, will be stored as such in S3
  * `type` **required** - The mime type, also used for `Content-Type` parameter in the S3 post policy
2. `options`
  * `acl` - The [Access Control List](http://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html) of this object. Defaults to `public-read`
  * `keyPrefix` - Prefix, or path to the file on S3, i.e. `uploads/` (note the trailing slash)
  * `bucket` **required** - Your S3 bucket
  * `region` **required** - The region of your S3 bucket
  * `accessKey` **required** - Your S3 `AWSAccessKeyId`
  * `secretKey` **required** - Your S3 `AWSSecretKey`
  * `successActionStatus` - HTTP response status if successful, defaults to 201
  * `awsUrl` - [AWS S3 url](http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region). Defaults to `s3.amazonaws.com`
  * `timeDelta` - Devices time offset from world clock in milliseconds, defaults to 0

Returns an object that wraps an `XMLHttpRequest` instance and behaves like a promise, with the following additional methods:

* `progress` - accepts a callback which will be called with an event representing the progress of the upload. Event object is of shape
  * `loaded` - amount uploaded
  * `total` - total amount to upload
  * `percent` - number between 0 and 1 representing the percent completed
* `abort` - aborts the xhr instance

Examples:
```javascript
RNS3.put(file, options)
  .progress((e) => console.log(e.loaded / e.total)); // or console.log(e.percent)

RNS3.put(file, option)
  .abort();
```


## License

MIT License

Copyright (c) 2020 Joshua Kim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
