#!/bin/bash

# Script para upload de badges para S3
# Uso: ./upload-to-s3.sh

set -e

# Configurações
BUCKET_NAME="fwc26-team-badges"
BUCKET_PREFIX="team-badges"

echo "🚀 Upload de Badges para S3"
echo "============================"
echo ""

# Upload dos badges (seleções + FIFA)
echo "📤 Uploading team badges..."
BADGES_COUNT=0
if [ -d "public/team-badges" ]; then
  for file in public/team-badges/*.png; do
    if [ -f "$file" ]; then
      filename=$(basename "$file")
      aws s3 cp "$file" "s3://${BUCKET_NAME}/${BUCKET_PREFIX}/${filename,,}" \
        --acl public-read \
        --content-type image/png \
        --cache-control "max-age=31536000"
      BADGES_COUNT=$((BADGES_COUNT + 1))
    fi
  done
  echo "✅ $BADGES_COUNT badges uploaded!"
else
  echo "❌ Directory not found: public/team-badges"
fi

echo ""

# Listar arquivos no S3
echo "📋 Files in S3:"
echo ""
aws s3 ls s3://${BUCKET_NAME}/${BUCKET_PREFIX}/ | head -10
echo "  ... ($(aws s3 ls s3://${BUCKET_NAME}/${BUCKET_PREFIX}/ | wc -l) total)"

echo ""
echo "✅ Upload completo!"
echo ""
echo "🔗 URLs de exemplo:"
echo "   FIFA Badge: https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${BUCKET_PREFIX}/fifa.png"
echo "   Badge BRA: https://${BUCKET_NAME}.s3.us-east-1.amazonaws.com/${BUCKET_PREFIX}/bra.png"
