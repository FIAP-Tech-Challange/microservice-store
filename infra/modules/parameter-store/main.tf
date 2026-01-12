resource "aws_ssm_parameter" "load_balancer_url" {
  name      = var.load_balancer_parameter_name
  type      = "String"
  value     = var.load_balancer_url
  overwrite = true
}
