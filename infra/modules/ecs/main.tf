# ------------------------------
# Default VPC + Subnets (AWS Academy)
# ------------------------------
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "public" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_iam_role" "lab_role" {
  name = "LabRole"
}

# ------------------------------
# Security Groups
# ------------------------------

# ALB security group – libera :80 pro mundo
resource "aws_security_group" "store_alb_sg" {
  name        = "store-alb-sg"
  description = "Security group for store ALB"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS security group – permite ALB acessar :3000
resource "aws_security_group" "store_ecs_sg" {
  name        = "store-ecs-sg"
  description = "Security group for store ECS tasks"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.store_alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ------------------------------
# ECS Cluster
# ------------------------------
resource "aws_ecs_cluster" "store_cluster" {
  name = "store-cluster"
}

# ------------------------------
# ALB
# ------------------------------
resource "aws_lb" "store_alb" {
  name               = "store-lb"
  load_balancer_type = "application"
  security_groups    = [aws_security_group.store_alb_sg.id]
  subnets            = data.aws_subnets.public.ids
}

resource "aws_lb_target_group" "store_tg" {
  name_prefix = "notif-"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.default.id
  target_type = "ip"

  health_check {
    path = "/health"
  }
}

resource "aws_lb_listener" "store_listener" {
  load_balancer_arn = aws_lb.store_alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.store_tg.arn
  }
}

# ------------------------------
# Task Definition
# ------------------------------
resource "aws_ecs_task_definition" "store_app" {
  family                   = "store-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = data.aws_iam_role.lab_role.arn
  task_role_arn            = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([
    {
      name      = "store-app"
      image     = var.ecr_image_uri
      essential = true

      portMappings = [
        {
          containerPort = 3000
        }
      ]

      environment = [
        {
          name  = "DYNAMODB_TABLE_NAME"
          value = var.dynamodb_table_name
        },
        {
          name  = "API_KEY_SECRET_NAME"
          value = var.api_key_secret_name
        },
        {
          name  = "CATEGORY_PATH_PARAMETER_NAME",
          value = var.categoryPathParameterName
        },
        {
          name  = "CATEGORY_API_KEY_SECRET_NAME",
          value = var.categoryApiKeySecretName
        },
        {
          name  = "JWT_SECRET_NAME",
          value = var.jwtSecretName
        },
        {
          name  = "JWT_ACCESS_TOKEN_EXPIRATION_TIME",
          value = var.jwtAccessTokenExpirationTime
        },
        {
          name  = "PORT"
          value = var.port
        }
      ]
    }
  ])
}

# ------------------------------
# ECS Service
# ------------------------------
resource "aws_ecs_service" "store_service" {
  name            = "store-service"
  cluster         = aws_ecs_cluster.store_cluster.id
  task_definition = aws_ecs_task_definition.store_app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.public.ids
    security_groups  = [aws_security_group.store_ecs_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.store_tg.arn
    container_name   = "store-app"
    container_port   = 3000
  }

  depends_on = [
    aws_lb_listener.store_listener
  ]
}
