variable "ecr_image_uri" {
  description = "The ECR image URI for the backend container"
  type        = string
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
}

variable "dynamodb_table_name" {
  description = "DynamoDB table name for the application"
  type        = string
}

variable "api_key_secret_name" {
  description = "The name of the API key secret in AWS Secrets Manager"
  type        = string
}

variable "environment" {
  description = "Environment name (development, staging, production)"
  type        = string
}

variable "port" {
  description = "Port on which the application will run"
  type        = string
}

variable "categoryPathParameterName" {
  description = "The name of the SSM Parameter Store parameter for category paths"
  type        = string
}

variable "categoryApiKeySecretName" {
  description = "The name of the API key secret for category service in AWS Secrets Manager"
  type        = string
}

variable "jwtSecretName" {
  description = "The name of the JWT secret in AWS Secrets Manager"
  type        = string
}

variable "jwtAccessTokenExpirationTime" {
  description = "Expiration time for JWT access tokens"
  type        = string
}
