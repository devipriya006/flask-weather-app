import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration with environment variable support."""
    WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')  # API Key from .env
    DEBUG = False
    TESTING = False

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
