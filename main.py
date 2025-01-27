from logging.config import dictConfig
from pathlib import Path

import environ
import uvicorn

from django.core.exceptions import ImproperlyConfigured

env = environ.Env()
BASE_DIR = Path(__file__).resolve().parent

try:    
    APP_NAME = env("APP_NAME")
except ImproperlyConfigured:
    env.read_env(BASE_DIR / '.env')
    APP_NAME = env("APP_NAME", default="app")
APP_DIR = env("APP_DIR", default="src")
APP_PORT = env("APP_PORT", default=8000)
ALLOWED_HOSTS = env("ALLOWED_HOSTS", default="localhost,0.0.0.0").split(',')
HOST = ALLOWED_HOSTS[1]

if __name__ == '__main__':
    uvicorn.run(
        app=f"{APP_NAME}.asgi:application",
        port=APP_PORT,
        app_dir=APP_DIR,
        host=HOST,
        reload=True,
        reload_includes=[
            "src/*.py",
            "src/**/*.py",
            "src/templates/*.html",
            "src/templates/pages/*.html",
            "src/staticfiles/css/*.css",
            "src/staticfiles/css/**/*.css",
            "src/staticfiles/js/*.js",
            "src/staticfiles/js/**/*.js",
        ],
        loop='asyncio',
    )
