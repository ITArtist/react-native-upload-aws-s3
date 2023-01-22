/**
 * RNS3
 */

import { Request } from './Request'
import { S3Policy } from './S3Policy'

const AWS_DEFAULT_S3_HOST = 'amazonaws.com'

const EXPECTED_RESPONSE_KEY_VALUE_RE = {
  key: /<Key>(.*)<\/Key>/,
  etag: /<ETag>"?([^"]*)"?<\/ETag>/,
  bucket: /<Bucket>(.*)<\/Bucket>/,
  location: /<Location>(.*)<\/Location>/,
}

const entries = o =>
  Object.keys(o).map(k => [k, o[k]])

const extractResponseValues = (responseText) =>
  entries(EXPECTED_RESPONSE_KEY_VALUE_RE).reduce((result, [key, regex]) => {
    const match = responseText.match(regex)
    return { ...result, [key]: match && match[1] }
  }, {})

const setBodyAsParsedXML = (response) =>
  ({
    ...response,
    body: { postResponse: response.text == null ? null : extractResponseValues(response.text) }
  })

export class RNS3 {
  static put(file, options) {
    options = {
      ...options,
      key: (options.keyPrefix || '') + file.name,
      date: new Date,
      contentType: file.type
    }

    var url = 'https://s3.' + options.region + '.' + (options.awsUrl || AWS_DEFAULT_S3_HOST) + '/' + options.bucket;
    const method = "POST"
    const policy = S3Policy.generate(options)

    return Request.create(url, method, policy)
      .set("file", file)
      .send()
      .then(setBodyAsParsedXML)
  }
}
