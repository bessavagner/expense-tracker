import os
import logging
from pathlib import Path

import uvicorn

logger = logging.getLogger('app')
ch = logging.StreamHandler()
formatter = logging.Formatter("%(levelname)s (%(filename)s at %(lineno)d): %(message)s")
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logger.setLevel(logging.DEBUG)
logger.addHandler(ch)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "app.settings")

# Read environment variables from .env file
env_file_path = Path(__file__).parent / '.env'
if env_file_path.exists():
    with env_file_path.open() as f:
        for line in f:
            key, value = line.strip().split('=', maxsplit=1)
            os.environ[key] = value

APP_NAME = os.environ.get('APP_NAME', 'app')
APP_DIR = os.environ.get('APP_DIR', 'src')
APP_PORT = int(os.environ.get('APP_PORT', 8000))
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,0.0.0.0').split(',')
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
            "src/templates/includes/*.html",
            "src/templates/account/*.html",
            "src/templates/transactions/*.html",
            "src/staticfiles/css/*.css",
            "src/staticfiles/css/**/*.css",
            "src/staticfiles/js/*.js",
            "src/staticfiles/js/**/*.js",
        ],
        loop='asyncio',
    )
