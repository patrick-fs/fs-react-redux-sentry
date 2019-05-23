npm run build
aws s3 sync build s3://fs-redux-sentry/ --delete