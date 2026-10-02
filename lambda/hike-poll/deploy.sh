#!/usr/bin/env bash
# Creates (or updates) the hike-poll Lambda and prints its public Function URL.
# The hike-poll DynamoDB table and hike-poll-lambda-role IAM role already exist.
set -euo pipefail
export AWS_REGION=us-west-2
FN=hike-poll
ROLE_ARN=$(aws iam get-role --role-name hike-poll-lambda-role --query Role.Arn --output text)
ZIP=$(mktemp -d)/hike-poll.zip

cd "$(dirname "$0")"
zip -q "$ZIP" index.mjs

if aws lambda get-function --function-name "$FN" >/dev/null 2>&1; then
  aws lambda update-function-code --function-name "$FN" --zip-file "fileb://$ZIP" >/dev/null
else
  aws lambda create-function --function-name "$FN" --runtime nodejs22.x \
    --role "$ROLE_ARN" --handler index.handler --timeout 10 --memory-size 256 \
    --zip-file "fileb://$ZIP" --environment "Variables={TABLE_NAME=hike-poll}" >/dev/null
  aws lambda wait function-active-v2 --function-name "$FN"
  aws lambda create-function-url-config --function-name "$FN" --auth-type NONE \
    --cors '{"AllowOrigins":["https://philipknott.net","https://www.philipknott.net","http://localhost:5173","http://127.0.0.1:4173"],"AllowMethods":["GET","POST"],"AllowHeaders":["content-type"],"MaxAge":300}' >/dev/null
  aws lambda add-permission --function-name "$FN" --statement-id public-url \
    --action lambda:InvokeFunctionUrl --principal '*' --function-url-auth-type NONE >/dev/null
  aws lambda add-permission --function-name "$FN" --statement-id public-invoke \
    --action lambda:InvokeFunction --principal '*' --invoked-via-function-url >/dev/null
fi

aws lambda get-function-url-config --function-name "$FN" --query FunctionUrl --output text
