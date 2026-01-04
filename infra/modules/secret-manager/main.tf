resource "aws_secretsmanager_secret" "api_key" {
  name                           = var.api_key_secret_name
  force_overwrite_replica_secret = true
}

resource "aws_secretsmanager_secret_version" "api_key_version" {
  secret_id     = aws_secretsmanager_secret.api_key.id
  secret_string = random_password.api_key.result
}

resource "random_password" "api_key" {
  length  = 32
  special = true
}
