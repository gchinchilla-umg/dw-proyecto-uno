#!/bin/bash

# Script para inicializar el proyecto

echo "Inicializando el proyecto Alamedas de Santa Ana..."

# Crear directorio lib si no existe
if [ ! -d "lib" ]; then
    echo "Creando directorio lib..."
    mkdir -p lib
fi

# Descargar SQL.js
echo "Descargando SQL.js..."
curl -o lib/sql-wasm.js https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js
curl -o lib/sql-wasm.wasm https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm

# Iniciar el servidor
echo "Configuración completada. Iniciando servidor..."
echo "Puedes acceder al sitio en: http://localhost:8000"
python -m http.server 8000
