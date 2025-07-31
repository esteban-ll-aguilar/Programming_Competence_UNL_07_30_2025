import uvicorn
import os
from app import app
from app.core.config import _SETTINGS

# Server configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8080"))

if __name__ == "__main__":
    # Print only the main banner, not duplicated initialization info
    print("\n" + "=" * 60)
    print(f"Starting {_SETTINGS.APP_NAME}")
    print("=" * 60)
    print(f"API available at: http://{HOST}:{PORT}")
    print(f"Documentation: http://{HOST}:{PORT}/docs")
    print(f"Redoc: http://{HOST}:{PORT}/redoc")
    print(f"For testing endpoints, use a token from the configured list")
    print("=" * 60 + "\n")
    
    uvicorn.run(
        "app:app",
        host=HOST,
        port=PORT,
        reload=True,
        log_level="info"
    )