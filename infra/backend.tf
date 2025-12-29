terraform {
  backend "s3" {
    key = "store/terraform.tfstate"
  }
}
