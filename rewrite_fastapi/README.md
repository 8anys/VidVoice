# VidVoice FastAPI Rewrite

Це переписана версія VidVoice на:

- `HTML`
- `CSS`
- `JavaScript`
- `Python`
- `FastAPI`
- `PostgreSQL`

Оригінальний React-проєкт у корені репозиторію не змінюється.

Згенеровані audio/video файли зберігаються в `backend/storage`. База даних PostgreSQL використовується для реєстрації, профілю користувача та майбутнього збереження проєктів.

## Структура

```text
rewrite_fastapi/
  backend/
    app/
      api/
      core/
      services/
      main.py
    requirements.txt
  frontend/
    assets/
      css/
      js/
    index.html
    auth.html
    projects.html
    profile.html
    settings.html
    credits.html
  database/
    README.md
    init/
      001_schema.sql
```

## 1. Підготуй PostgreSQL

Якщо база ще не створена, відкрий **SQL Shell (psql)** і зайди в стандартну базу `postgres`:

```text
Server [localhost]:
Database [postgres]: postgres
Port [5432]:
Username [postgres]: postgres
Password for user postgres: твій_пароль
```

Створи базу:

```sql
CREATE DATABASE vidvoice;
```

Вийди:

```sql
\q
```

Зайди знову, але вже в базу `vidvoice`:

```text
Server [localhost]:
Database [postgres]: vidvoice
Port [5432]:
Username [postgres]: postgres
Password for user postgres: твій_пароль
```

Виконай схему:

```sql
\i 'E:/Diplom/Ivan/VidVoice/rewrite_fastapi/database/init/001_schema.sql'
```

Перевір таблиці:

```sql
\dt
```

Детальніша інструкція є тут:

```text
database\README.md
```

## 2. Запусти backend

Відкрий PowerShell у папці `rewrite_fastapi`:

```powershell
cd E:\Diplom\Ivan\VidVoice\rewrite_fastapi
```

Створи віртуальне середовище, якщо його ще немає:

```powershell
python -m venv .venv
```

Активуй його:

```powershell
.venv\Scripts\activate
```

Встанови залежності:

```powershell
pip install -r backend\requirements.txt
```

Підключи backend до PostgreSQL. Заміни `твій_пароль` на пароль від PostgreSQL:

```powershell
$env:DATABASE_URL="postgresql://postgres:твій_пароль@localhost:5432/vidvoice"
```

Додай секрет для авторизації:

```powershell
$env:VIDVOICE_SECRET_KEY="my_local_vidvoice_secret_123"
```

Якщо будеш генерувати озвучку через ElevenLabs, додай API key:

```powershell
$env:ELEVENLABS_API_KEY="your_api_key_here"
```

Для генерації MP4 також потрібні `ffmpeg` і `ffprobe`:

```powershell
ffmpeg -version
ffprobe -version
```

Запусти сервер:

```powershell
cd backend
uvicorn app.main:app --reload
```

## 3. Відкрий сайт

Головна сторінка:

```text
http://localhost:8000
```

Реєстрація та вхід:

```text
http://localhost:8000/auth
```

Профіль:

```text
http://localhost:8000/profile
```

## 4. Як перевірити реєстрацію

1. Відкрий:

```text
http://localhost:8000/auth
```

2. Обери `Register`.
3. Введи ім’я, email і пароль.
4. Після успішної реєстрації сайт відкриє профіль.

Потім у SQL Shell або pgAdmin виконай:

```sql
SELECT id, email, display_name, role, created_at
FROM app_user;
```

Також можна перевірити профіль:

```sql
SELECT *
FROM user_profile;
```

І стартові кредити:

```sql
SELECT *
FROM credit_account;
```

Якщо все працює, у таблиці `app_user` з’явиться новий користувач, у `user_profile` буде його профіль, а в `credit_account` буде запис із кредитами.

## 5. Часті проблеми

Якщо сайт не реєструє користувача, перевір:

- чи запущений PostgreSQL;
- чи існує база `vidvoice`;
- чи виконаний файл `database/init/001_schema.sql`;
- чи правильно вказаний `$env:DATABASE_URL`;
- чи встановлені залежності через `pip install -r backend\requirements.txt`.

Якщо після закриття PowerShell сайт перестав бачити базу, це нормально: `$env:DATABASE_URL` задається тільки для поточного вікна термінала. Перед кожним запуском backend треба знову виконати команду з `$env:DATABASE_URL`, або пізніше можна винести це в `.env`.
