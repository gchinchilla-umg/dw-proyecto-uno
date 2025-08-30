#!/bin/bash

# Script para inicializar un nuevo repositorio Git

echo "Inicializando nuevo repositorio Git para Alamedas de Santa Ana..."

# Verificar si Git está inicializado
if [ -d ".git" ]; then
    echo "El repositorio Git ya está inicializado."
    exit 0
fi

# Inicializar repositorio Git
echo "Inicializando repositorio Git..."
git init

# Verificar si se proporcionó una URL de repositorio remoto
if [ -n "$1" ]; then
    echo "Configurando repositorio remoto origin: $1"
    git remote add origin "$1"
else
    echo "No se proporcionó URL de repositorio remoto."
    echo "Para agregar un remote, usa:"
    echo "git remote add origin <URL_DEL_REPOSITORIO>"
fi

# Crear archivo README.md si no existe
if [ ! -f "README.md" ]; then
    echo "Creando archivo README.md..."
    echo "# Residencial Alamedas de Santa Ana - Portal Web" > README.md
    echo "" >> README.md
    echo "Este proyecto es un portal web para el residencial \"Alamedas de Santa Ana\" que permite mostrar información general, noticias, calendario de actividades y consulta de pagos de cuotas de mantenimiento." >> README.md
fi

# Realizar primer commit
echo "Realizando primer commit..."
git add .
git commit -m "Inicialización del proyecto"

# Verificar si se configuró un remote y preguntar si se desea hacer push
if git remote -v | grep -q "origin"; then
    echo "¿Deseas hacer push a origin? (s/n)"
    read respuesta
    if [ "$respuesta" = "s" ] || [ "$respuesta" = "S" ]; then
        echo "Haciendo push a origin..."
        git push -u origin master
    fi
fi

echo "Repositorio Git inicializado exitosamente."
