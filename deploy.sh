#!/bin/bash

# Script para desplegar el proyecto en Vercel

echo "Iniciando despliegue a Vercel..."

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null
then
    echo "Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

# Desplegar a Vercel
echo "Desplegando proyecto a Vercel..."
vercel --prod

echo "Despliegue completado. Verifica la URL proporcionada por Vercel."
