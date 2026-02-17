"""
Microservicio de validación de imágenes - Galería de Arte
FastAPI para validar imágenes (tamaño máximo, formato, etc.)
Futuro: procesamiento de imágenes
"""

import os
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Configuración
MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}

app = FastAPI(
    title="Galería de Arte - Validación de Imágenes",
    description="Microservicio para validar y procesar imágenes",
    version="1.0.0"
)

# CORS para permitir llamadas desde el frontend/backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ValidacionResponse(BaseModel):
    """Respuesta de validación de imagen"""
    valido: bool
    mensaje: str
    tamaño_bytes: Optional[int] = None
    extension: Optional[str] = None


@app.get("/")
async def root():
    """Endpoint raíz - información del microservicio"""
    return {
        "servicio": "Validación de Imágenes - Galería de Arte",
        "version": "1.0.0",
        "endpoints": {
            "validar": "POST /validar-imagen",
            "health": "GET /health"
        }
    }


@app.get("/health")
async def health():
    """Health check para verificar que el servicio está activo"""
    return {"estado": "ok", "servicio": "validacion-imagenes"}


@app.post("/validar-imagen", response_model=ValidacionResponse)
async def validar_imagen(file: UploadFile = File(...)):
    """
    Valida una imagen subida.
    Verifica: tamaño máximo, extensión permitida.
    Futuro: dimensiones, formato, etc.
    """
    try:
        # Leer contenido del archivo
        contenido = await file.read()
        tamaño_bytes = len(contenido)

        # Validar tamaño máximo
        if tamaño_bytes > MAX_FILE_SIZE_BYTES:
            return ValidacionResponse(
                valido=False,
                mensaje=f"La imagen supera el tamaño máximo permitido ({MAX_FILE_SIZE_MB}MB)",
                tamaño_bytes=tamaño_bytes,
                extension=os.path.splitext(file.filename or '')[1].lower()
            )

        # Validar extensión
        filename = file.filename or ''
        extension = os.path.splitext(filename)[1].lower()
        if extension not in ALLOWED_EXTENSIONS:
            return ValidacionResponse(
                valido=False,
                mensaje=f"Formato no permitido. Use: {', '.join(ALLOWED_EXTENSIONS)}",
                tamaño_bytes=tamaño_bytes,
                extension=extension
            )

        # Validación exitosa
        return ValidacionResponse(
            valido=True,
            mensaje="Imagen válida",
            tamaño_bytes=tamaño_bytes,
            extension=extension
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/validar-imagen-url")
async def validar_imagen_url(url: str):
    """
    Endpoint alternativo para validar por URL.
    (Para futura implementación con descarga de imagen)
    """
    return {
        "valido": False,
        "mensaje": "Validación por URL no implementada. Use POST /validar-imagen con archivo."
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
