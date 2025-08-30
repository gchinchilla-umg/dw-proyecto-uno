#!/bin/bash

# Script para realizar commit de cambios en Git

# Verificar si se proporcionó un mensaje de commit
if [ -z "$1" ]; then
    echo "Error: Debes proporcionar un mensaje de commit."
    echo "Uso: ./commit.sh \"Mensaje de commit\""
    exit 1
fi

# Verificar si Git está inicializado
if [ ! -d ".git" ]; then
    echo "Inicializando repositorio Git..."
    git init
fi

# Agregar todos los archivos
echo "Agregando archivos al staging area..."
git add .

# Realizar commit
echo "Realizando commit con mensaje: $1"
git commit -m "$1"

# Verificar si existe un remote
if git remote -v | grep -q "origin"; then
    echo "¿Deseas hacer push a origin? (s/n)"
    read respuesta
    if [ "$respuesta" = "s" ] || [ "$respuesta" = "S" ]; then
        echo "Haciendo push a origin..."
        git push origin master
    fi
else
    echo "No hay remote configurado. Para agregar un remote, usa:"
    echo "git remote add origin <URL_DEL_REPOSITORIO>"
fi

echo "Commit completado exitosamente."
