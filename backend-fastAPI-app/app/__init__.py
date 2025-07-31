from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(override=True)

print("Initializing application...")

# Import database after loading environment variables
from app.core.database import db
from app.main import create_app

# Create the FastAPI application
app = create_app()