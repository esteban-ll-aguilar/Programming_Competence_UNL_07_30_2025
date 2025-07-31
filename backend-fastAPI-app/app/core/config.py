from pydantic import BaseModel

class FastAPIConfig(BaseModel):
    APP_NAME: str = "Backend FastAPI From Competence"
    DESCRIPTION: str = "Desarrollo del backen para implementar en la solucion del problema planteado"

    class Config:
        env_file = ".env"



_SETTINGS = FastAPIConfig()