terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1"
}

# -------------------------
# VPC
# -------------------------

resource "aws_vpc" "calculator_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "calculator-vpc"
  }
}

# -------------------------
# Public Subnet
# -------------------------

resource "aws_subnet" "calculator_public_subnet" {
  vpc_id                  = aws_vpc.calculator_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "ap-south-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "calculator-public-subnet"
  }
}

# -------------------------
# Internet Gateway
# -------------------------

resource "aws_internet_gateway" "calculator_igw" {
  vpc_id = aws_vpc.calculator_vpc.id

  tags = {
    Name = "calculator-igw"
  }
}

# -------------------------
# Public Route Table
# -------------------------

resource "aws_route_table" "calculator_public_rt" {
  vpc_id = aws_vpc.calculator_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.calculator_igw.id
  }

  tags = {
    Name = "calculator-public-rt"
  }
}

# -------------------------
# Route Table Association
# -------------------------

resource "aws_route_table_association" "calculator_public_association" {
  subnet_id      = aws_subnet.calculator_public_subnet.id
  route_table_id = aws_route_table.calculator_public_rt.id
}

# -------------------------
# Security Group
# -------------------------

resource "aws_security_group" "calculator_sg" {
  name   = "calculator-sg"
  vpc_id = aws_vpc.calculator_vpc.id

  ingress {
    description = "Allow SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Allow HTTP"
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

  tags = {
    Name = "calculator-sg"
  }
}

# -------------------------
# EC2 Instance
# -------------------------

resource "aws_instance" "calculator_ec2" {
  ami           = "ami-050c78efa486a0196"
  instance_type = "t3.micro"

  subnet_id = aws_subnet.calculator_public_subnet.id

  vpc_security_group_ids = [
    aws_security_group.calculator_sg.id
  ]

  associate_public_ip_address = true

  tags = {
    Name = "calculator-ec2"
  }
}
