import uvicorn
from app import app


if __name__ == "__main__":
    print("Iniciando servidor FastAPI...")
    print("La documentación estará disponible en: http://localhost:8000/docs")
    print("Para probar los endpoints, use un token que comience con 'test_'")
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
        log_level="info"
    )