output "ec2_public_ip" {
  value = aws_instance.calculator_ec2.public_ip
}

output "ec2_instance_id" {
  value = aws_instance.calculator_ec2.id
}

output "vpc_id" {
  value = aws_vpc.calculator_vpc.id
}

output "subnet_id" {
  value = aws_subnet.calculator_public_subnet.id
}
