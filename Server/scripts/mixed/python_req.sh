#!/bin/sh

# ==== Configuración de colores ====
NC='\033[0m'       # Sin color
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
BLUE='\033[1;34m'
BOLD='\033[1m'

# ==== Rutas y nombres de archivos ====
REQ_DIR="/app"
REQ_FILE="requirements.txt"
REQ_PATH="$REQ_DIR/$REQ_FILE"
REQ_TEMP="$REQ_DIR/requirements.tmp"

clear
# ==== Verificación de pip ====
if ! command -v pip >/dev/null 2>&1; then
    printf "\t${RED}[ERROR] pip no está instalado o no está en el PATH.${NC}\n"
    exit 1
fi

# ==== Entorno virtual ====
printf "${BLUE}→ Generando archivo temporal de requerimientos...${NC}\n"
if [ -z "$VIRTUAL_ENV" ]; then
    printf "\n${YELLOW}[ADVERTENCIA] No estás dentro de un entorno virtual. Se usarán los paquetes del sistema.${NC}\n"
else
    printf "\n${GREEN}[OK] Entorno virtual detectado:${NC} %s\n" "$VIRTUAL_ENV"
fi

# ==== Generación del archivo temporal ====
printf "\n${BLUE}→ Generando archivo temporal de requerimientos...${NC}\n"
pip freeze > "$REQ_TEMP"

if [ $? -eq 0 ]; then
    printf "\t${GREEN}[✓] Archivo temporal generado correctamente.${NC}\n"

    if [ -f "$REQ_PATH" ]; then
        TIMESTAMP=$(date +"%Y%m%d_%H%M")
        BACKUP_FILE="$REQ_DIR/requirements_old_$TIMESTAMP.txt"
        printf "\n${YELLOW}↪ Se detectó un archivo existente. Renombrando a:${NC} %s\n" "$BACKUP_FILE"
        mv "$REQ_PATH" "$BACKUP_FILE"
    fi

    mv "$REQ_TEMP" "$REQ_PATH"
    printf "\t${GREEN}[✓] Nuevo archivo ${BOLD}%s${NC}${GREEN} actualizado correctamente.${NC}\n" "$REQ_FILE"
else
    printf "\t${RED}[✗] Error al generar el archivo de requerimientos. No se realizaron cambios.${NC}\n"
    rm -f "$REQ_TEMP"
    exit 2
fi
