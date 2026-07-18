#!/usr/bin/env bash
# Provisions (or re-provisions) the Myriox dev infrastructure and stores secrets in Key Vault.
# Usage: ./provision.sh
set -euo pipefail

RESOURCE_GROUP="rg-myriox-dev"
LOCATION="eastus2"
BASE_NAME="myrioxdev"

az group create --name "$RESOURCE_GROUP" --location "$LOCATION"

az deployment group create \
  --resource-group "$RESOURCE_GROUP" \
  --template-file "$(dirname "$0")/../bicep/main.bicep" \
  --name "myriox-main-deploy-$(date +%s)" \
  --parameters baseName="$BASE_NAME"

COSMOS_KEY=$(az cosmosdb keys list \
  --name "${BASE_NAME}-cosmos" \
  --resource-group "$RESOURCE_GROUP" \
  --query primaryMasterKey -o tsv)

OPENAI_KEY=$(az cognitiveservices account keys list \
  --name "${BASE_NAME}-aoai" \
  --resource-group "$RESOURCE_GROUP" \
  --query key1 -o tsv)

az keyvault secret set --vault-name "${BASE_NAME}-kv" --name cosmos-key --value "$COSMOS_KEY" >/dev/null
az keyvault secret set --vault-name "${BASE_NAME}-kv" --name openai-key --value "$OPENAI_KEY" >/dev/null

echo "Provisioning complete. Secrets stored in ${BASE_NAME}-kv."
echo "Cosmos endpoint: https://${BASE_NAME}-cosmos.documents.azure.com:443/"
echo "OpenAI endpoint: https://${BASE_NAME}-aoai.openai.azure.com/"
echo "ACR login server: ${BASE_NAME}acr.azurecr.io"
