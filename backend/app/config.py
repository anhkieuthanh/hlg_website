from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://hlg:hlg_secret@localhost:5432/hlg_academy"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    UPLOAD_DIR: str = "/app/uploads"
    ALLOWED_EMAIL_DOMAIN: str = ""  # e.g. "hoanglong.com" — empty = allow all

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
