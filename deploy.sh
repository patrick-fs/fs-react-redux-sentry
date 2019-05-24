#!/bin/bash
npm run build
aws s3 sync build s3://fs-redux-sentry/ --delete
echo "Site is up at http://fs-redux-sentry.s3-website-us-east-1.amazonaws.com/"