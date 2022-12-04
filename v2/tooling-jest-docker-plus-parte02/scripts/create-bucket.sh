BUCKET_NAME=treinamento-aws-ew-ti

# mb -> CRIAR UM BUCKET
aws \
  s3 mb s3://$BUCKET_NAME \
  --endpoint-url=http://localhost:4566

aws \
  s3 ls \
  --endpoint-url=http://localhost:4566