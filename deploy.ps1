# Script para hacer deploy del client-gateway con Docker en PowerShell

Write-Host "🚀 Iniciando deploy del Client Gateway..." -ForegroundColor Green

# Verificar si Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker no está instalado. Por favor instalar Docker primero." -ForegroundColor Red
    exit 1
}

# Verificar si Docker Compose está instalado
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose no está instalado. Por favor instalar Docker Compose primero." -ForegroundColor Red
    exit 1
}

# Verificar si existe el archivo .env
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Archivo .env no encontrado. Copiando desde .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Archivo .env creado. Por favor configura las variables necesarias antes de continuar." -ForegroundColor Green
    Write-Host "📝 Edita el archivo .env con tus configuraciones específicas." -ForegroundColor Cyan
    Read-Host "Presiona Enter para continuar una vez configurado el archivo .env"
}

Write-Host "🏗️  Construyendo imagen Docker..." -ForegroundColor Blue
Write-Host "🧹 Limpiando imágenes anteriores..." -ForegroundColor Yellow
docker-compose down --rmi local --volumes --remove-orphans 2>$null
docker-compose build --no-cache

Write-Host "🐳 Iniciando contenedores..." -ForegroundColor Blue
docker-compose up -d

Write-Host "⏳ Esperando que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar si los contenedores están corriendo
$status = docker-compose ps
if ($status -match "Up") {
    Write-Host "✅ Deploy completado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Servicios disponibles:" -ForegroundColor Cyan
    
    # Leer el puerto del archivo .env
    $envContent = Get-Content ".env" | Where-Object { $_ -match "^PORT=" }
    $port = if ($envContent) { ($envContent -split "=")[1].Trim() } else { "3000" }
    
    Write-Host "   - API Gateway: http://localhost:$port" -ForegroundColor White
    Write-Host "   - Swagger Docs: http://localhost:$port/api/docs" -ForegroundColor White
    Write-Host "   - NATS Monitoring: http://localhost:8222" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 Comandos útiles:" -ForegroundColor Cyan
    Write-Host "   - Ver logs: docker-compose logs -f" -ForegroundColor White
    Write-Host "   - Parar servicios: docker-compose down" -ForegroundColor White
    Write-Host "   - Reiniciar: docker-compose restart" -ForegroundColor White
} else {
    Write-Host "❌ Error en el deploy. Verificando logs..." -ForegroundColor Red
    docker-compose logs
}
