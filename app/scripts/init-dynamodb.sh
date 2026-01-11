#!/bin/sh

echo "Waiting for DynamoDB Local to be ready..."

# Wait for DynamoDB with retries
max_retries=10
retry_count=0

while [ $retry_count -lt $max_retries ]; do
    if aws dynamodb list-tables \
        --endpoint-url "${DYNAMODB_ENDPOINT}" \
        --region "${AWS_DEFAULT_REGION}" \
        --no-cli-pager > /dev/null 2>&1; then
        echo "DynamoDB is ready!"
        break
    fi
    retry_count=$((retry_count + 1))
    echo "Attempt $retry_count/$max_retries..."
    sleep 1
done

if [ $retry_count -eq $max_retries ]; then
    echo "ERROR: Failed to connect to DynamoDB"
    exit 1
fi
echo "Creating DynamoDB table: ${DYNAMODB_TABLE_NAME}..."
aws dynamodb create-table \
    --table-name "${DYNAMODB_TABLE_NAME}" \
    --attribute-definitions \
        AttributeName=PK,AttributeType=S \
        AttributeName=SK,AttributeType=S \
        AttributeName=cnpj,AttributeType=S \
        AttributeName=emailNormalized,AttributeType=S \
        AttributeName=nameNormalized,AttributeType=S \
        AttributeName=token_access,AttributeType=S \
    --key-schema \
        AttributeName=PK,KeyType=HASH \
        AttributeName=SK,KeyType=RANGE \
    --global-secondary-indexes \
        "[
            {
                \"IndexName\": \"GSI_CNPJ\",
                \"KeySchema\": [
                    {\"AttributeName\": \"cnpj\", \"KeyType\": \"HASH\"}
                ],
                \"Projection\": {
                    \"ProjectionType\": \"ALL\"
                },
                \"ProvisionedThroughput\": {
                    \"ReadCapacityUnits\": 5,
                    \"WriteCapacityUnits\": 5
                }
            },
            {
                \"IndexName\": \"GSI_EMAIL\",
                \"KeySchema\": [
                    {\"AttributeName\": \"emailNormalized\", \"KeyType\": \"HASH\"}
                ],
                \"Projection\": {
                    \"ProjectionType\": \"ALL\"
                },
                \"ProvisionedThroughput\": {
                    \"ReadCapacityUnits\": 5,
                    \"WriteCapacityUnits\": 5
                }
            },
            {
                \"IndexName\": \"GSI_NAME\",
                \"KeySchema\": [
                    {\"AttributeName\": \"nameNormalized\", \"KeyType\": \"HASH\"}
                ],
                \"Projection\": {
                    \"ProjectionType\": \"ALL\"
                },
                \"ProvisionedThroughput\": {
                    \"ReadCapacityUnits\": 5,
                    \"WriteCapacityUnits\": 5
                }
            },
            {
                \"IndexName\": \"GSI_TOTEM\",
                \"KeySchema\": [
                    {\"AttributeName\": \"token_access\", \"KeyType\": \"HASH\"}
                ],
                \"Projection\": {
                    \"ProjectionType\": \"ALL\"
                },
                \"ProvisionedThroughput\": {
                    \"ReadCapacityUnits\": 5,
                    \"WriteCapacityUnits\": 5
                }
            }
        ]" \
    --provisioned-throughput \
        ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url "${DYNAMODB_ENDPOINT}" \
    --region "us-east-1" \
    --no-cli-pager 2>/dev/null || echo "Table may already exist"

echo "Listing tables..."
aws dynamodb list-tables \
    --endpoint-url "${DYNAMODB_ENDPOINT}" \
    --region "us-east-1" \
    --no-cli-pager

echo "Describing table..."
aws dynamodb describe-table \
    --table-name "${DYNAMODB_TABLE_NAME}" \
    --endpoint-url "${DYNAMODB_ENDPOINT}" \
    --region "us-east-1" \
    --no-cli-pager 2>/dev/null || echo "Could not describe table"

echo "DynamoDB initialization complete!"
