variable "aws_region" {
  default     = "us-east-1"
  description = "The AWS region to deploy resources in."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)."
  type        = string
}

variable "ecr_image_uri" {
  description = "The URI of the ECR image for the ECS service."
  type        = string
}

variable "store_table_name" {
  description = "The name of the DynamoDB table for store."
  type        = string
  default     = "Store"
}

variable "api_key_secret_name" {
  description = "The name of the API key secret in AWS Secrets Manager"
  type        = string
  default     = "store_api_key"
}

variable "load_balancer_parameter_name" {
  description = "The parameter name for the load balancer url"
  type        = string
  default     = "/store/load_balancer_url"
}

variable "port" {
  description = "The port on which the application will run."
  type        = string
  default     = "3000"
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
  default     = "10000"
}
