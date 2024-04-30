#!/bin/bash
set -x
export AWS_ACCESS_KEY_ID=x
export AWS_SECRET_ACCESS_KEY=x

awslocal s3 mb s3://bucket --region eu-west-1
awslocal s3api put-bucket-cors --bucket bucket --cors-configuration '{
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["PUT", "POST", "GET", "HEAD"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"]
      }
    ]
  }'

awslocal s3 ls --region eu-west-1

set +x
