#!/bin/bash

# Script para hacer deploy del client-gateway con Docker

echo "🚀 Iniciando deploy del Client Gateway..."

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instalar Docker primero."
    exit 1
fi

# Verificar si Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instalar Docker Compose primero."
    exit 1
fi

# Verificar si existe el archivo .env
if [ ! -f ".env" ]; then
    echo "⚠️  Archivo .env no encontrado. Copiando desde .env.example..."
    cp .env.example .env
    echo "✅ Archivo .env creado. Por favor configura las variables necesarias antes de continuar."
    echo "📝 Edita el archivo .env con tus configuraciones específicas."
    read -p "Presiona Enter para continuar una vez configurado el archivo .env..."
fi

echo "🏗️  Construyendo imagen Docker..."
echo "🧹 Limpiando imágenes anteriores..."
docker-compose down --rmi local --volumes --remove-orphans 2>/dev/null || true
docker-compose build --no-cache

echo "🐳 Iniciando contenedores..."
docker-compose up -d

echo "⏳ Esperando que los servicios estén listos..."
sleep 10

# Verificar si los contenedores están corriendo
if docker-compose ps | grep -q "Up"; then
    echo "✅ Deploy completado exitosamente!"
    echo ""
    echo "🌐 Servicios disponibles:"
    echo "   - API Gateway: http://localhost:$(grep PORT .env | cut -d'=' -f2 | tr -d ' ')"
    echo "   - Swagger Docs: http://localhost:$(grep PORT .env | cut -d'=' -f2 | tr -d ' ')/api/docs"
    echo "   - NATS Monitoring: http://localhost:8222"
    echo ""
    echo "📋 Comandos útiles:"
    echo "   - Ver logs: docker-compose logs -f"
    echo "   - Parar servicios: docker-compose down"
    echo "   - Reiniciar: docker-compose restart"
else
    echo "❌ Error en el deploy. Verificando logs..."
    docker-compose logs
fi
