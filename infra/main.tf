terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "dynamoDB" {
  source           = "./modules/dynamodb"
  environment      = var.environment
  store_table_name = var.store_table_name
}

module "ecs" {
  source                       = "./modules/ecs"
  ecr_image_uri                = var.ecr_image_uri
  aws_region                   = var.aws_region
  environment                  = var.environment
  dynamodb_table_name          = var.store_table_name
  api_key_secret_name          = var.api_key_secret_name
  port                         = var.port
  categoryApiKeySecretName     = var.categoryApiKeySecretName
  categoryPathParameterName    = var.categoryPathParameterName
  jwtSecretName                = var.jwtSecretName
  jwtAccessTokenExpirationTime = var.jwtAccessTokenExpirationTime
}

module "parameter_store" {
  source                       = "./modules/parameter-store"
  load_balancer_parameter_name = var.load_balancer_parameter_name
  load_balancer_url            = module.ecs.load_balancer_url
}

module "secret_manager" {
  source              = "./modules/secret-manager"
  api_key_secret_name = var.api_key_secret_name
}
