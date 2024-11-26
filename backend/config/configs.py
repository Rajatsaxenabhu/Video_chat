from pydantic_settings import BaseSettings, SettingsConfigDict
class settings(BaseSettings):
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_DB: int
    HOSTS: str
    SQL_ADDRESS: str
    model_config = SettingsConfigDict(env_file=".env")
seting=settings()
print(seting.REDIS_HOST,seting.REDIS_PORT,seting.REDIS_DB,seting.HOSTS,seting.SQL_ADDRESS)