resource "aws_dynamodb_table" "store_table" {
  name         = var.store_table_name
  hash_key     = "PK"
  range_key    = "SK"
  billing_mode = "PAY_PER_REQUEST"

  # Primary key attributes
  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  # GSI_EMAIL attributes
  attribute {
    name = "emailNormalized"
    type = "S"
  }

  # GSI_CNPJ attributes
  attribute {
    name = "cnpj"
    type = "S"
  }

  # GSI_NAME attributes
  attribute {
    name = "nameNormalized"
    type = "S"
  }

  # GSI_TOTEM attributes
  attribute {
    name = "token_access"
    type = "S"
  }

  # GSI for querying by email
  global_secondary_index {
    name            = "GSI_EMAIL"
    hash_key        = "emailNormalized"
    projection_type = "ALL"
  }

  # GSI for querying by CNPJ
  global_secondary_index {
    name            = "GSI_CNPJ"
    hash_key        = "cnpj"
    projection_type = "ALL"
  }

  # GSI for querying by name
  global_secondary_index {
    name            = "GSI_NAME"
    hash_key        = "nameNormalized"
    projection_type = "ALL"
  }

  # GSI for querying by totem access token
  global_secondary_index {
    name            = "GSI_TOTEM"
    hash_key        = "token_access"
    projection_type = "ALL"
  }

  tags = {
    Name        = var.store_table_name
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
