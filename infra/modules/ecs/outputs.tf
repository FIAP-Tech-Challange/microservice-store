output "load_balancer_url" {
  description = "URL of the Application Load Balancer"
  value       = "http://${aws_lb.store_alb.dns_name}"
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.store_cluster.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.store_service.name
}
