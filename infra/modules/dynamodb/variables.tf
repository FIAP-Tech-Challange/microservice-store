variable "store_table_name" {
  description = "The name of the DynamoDB table for stores."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)."
  type        = string
}
