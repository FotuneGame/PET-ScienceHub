# Добавьте файл с верными данными переменных .env

```
PORT = 6001
URL_CORS = ["http://localhost:3000","http://localhost","https://localhost"]
SECRET_KEY = "MY_SALT"
DEPTH_HASH = 3

URL_BASE_INGRESS = "/api/v1/user/"

MAIL_SERVICE = "yandex"
MAIL_USER = "user"
MAIL_PASSWORD = "api_key"
MAIL_FROM="user@service.ru"

PHONE = "phone"
PHONE_KEY = "api_key"

GITHUB_CLIENT_ID = "id"
GITHUB_CLIENT_SECRET="secret"
GITHUB_URL_CALLBACK="/github/redirect"

GOOGLE_CLIENT_ID="id"
GOOGLE_CLIENT_SECRET="secret"
GOOGLE_URL_CALLBACK="/google/redirect"

CODE_CONFIRM_ACTIVITY_MINUNTE=15



DB_NAME = "FreeAI"
DB_USER = "postgres"
DB_PASSWORD = "1234"
DB_HOST = "localhost"
DB_PORT = 5432

KAFKA_CLIENT_ID = "user-app"
KAFKA_BROCKERS_HOST = 'localhost'
KAFKA_BROCKERS_PORT = 9092
KAFKA_BROCKERS_REPLICATION_FACTOR = 1

REDIS_NAME = ""
REDIS_PASSWORD = ""
REDIS_HOST = "localhost"
REDIS_PORT = 6379
REDIS_DB = 0
```

Полезные ссылки для настройки Google, SMS, GitHub:
```
https://console.cloud.google.com/auth/clients

https://dev.exolve.ru/applications

https://github.com/settings/developers
```