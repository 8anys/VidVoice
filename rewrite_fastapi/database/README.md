# VidVoice PostgreSQL Database

Ця папка містить SQL-схему бази даних для переписаної FastAPI-версії VidVoice.

Docker тут не використовується. Очікується, що PostgreSQL встановлений локально на Windows, а база створюється через **SQL Shell (psql)** або **pgAdmin**.

## Структура

```text
database/
  .env.example
  README.md
  init/
    001_schema.sql
```

## 1. Створи базу даних

Якщо база `vidvoice` ще не створена, відкрий **SQL Shell (psql)** і зайди в стандартну базу `postgres`:

```text
Server [localhost]:
Database [postgres]: postgres
Port [5432]:
Username [postgres]: postgres
Password for user postgres: твій_пароль
```

Після входу виконай:

```sql
CREATE DATABASE vidvoice;
```

Потім вийди:

```sql
\q
```

## 2. Зайди в базу `vidvoice`

Знову відкрий **SQL Shell (psql)**:

```text
Server [localhost]:
Database [postgres]: vidvoice
Port [5432]:
Username [postgres]: postgres
Password for user postgres: твій_пароль
```

Якщо все добре, ти побачиш:

```text
vidvoice=#
```

## 3. Виконай SQL-схему

У SQL Shell введи:

```sql
\i 'E:/Diplom/Ivan/VidVoice/rewrite_fastapi/database/init/001_schema.sql'
```

Важливо:

- використовуй `/`, а не `\`, у шляху;
- шлях має бути в одинарних лапках;
- команда починається з `\i`.

Після виконання мають з’явитися повідомлення типу:

```text
CREATE TABLE
CREATE INDEX
INSERT 0 2
```

## 4. Перевір таблиці

У SQL Shell введи:

```sql
\dt
```

Ти маєш побачити таблиці, наприклад:

```text
app_user
user_profile
project
project_scene
media_file
tts_generation
video_generation
usage_event
```

Щоб вийти:

```sql
\q
```

## 5. Запусти backend із підключенням до бази

Відкрий PowerShell у папці проєкту:

```powershell
cd E:\Diplom\Ivan\VidVoice\rewrite_fastapi
```

Активуй віртуальне середовище:

```powershell
.venv\Scripts\activate
```

Встанови залежності:

```powershell
pip install -r backend\requirements.txt
```

Підключи backend до PostgreSQL. Заміни `твій_пароль` на реальний пароль від користувача `postgres`:

```powershell
$env:DATABASE_URL="postgresql://postgres:твій_пароль@localhost:5432/vidvoice"
```

Додай секрет для login-токенів:

```powershell
$env:VIDVOICE_SECRET_KEY="my_local_vidvoice_secret_123"
```

Якщо ти використовуєш ElevenLabs, додай API key:

```powershell
$env:ELEVENLABS_API_KEY="your_api_key_here"
```

Перейди в backend і запусти сервер:

```powershell
cd backend
uvicorn app.main:app --reload
```

## 6. Відкрий сайт

Головна сторінка:

```text
http://localhost:8000
```

Сторінка реєстрації та входу:

```text
http://localhost:8000/auth
```

На сторінці `/auth` обери `Register`, введи ім’я, email і пароль. Після успішної реєстрації сайт перекине тебе в профіль.

## 7. Перевір, що користувач додався в базу

Зайди в SQL Shell у базу `vidvoice` і виконай:

```sql
SELECT id, email, display_name, role, created_at
FROM app_user;
```

Перевір профіль користувача:

```sql
SELECT *
FROM user_profile;
```

Перевір кредитний акаунт:

```sql
SELECT *
FROM credit_account;
```

Якщо реєстрація спрацювала, у `app_user` буде новий користувач, у `user_profile` буде його профіль, а в `credit_account` буде стартовий запис із кредитами.

## 8. Варіант через pgAdmin

Якщо зручніше через pgAdmin:

1. Відкрий pgAdmin.
2. Створи базу `vidvoice`, якщо її ще немає.
3. Натисни правою кнопкою на базу `vidvoice`.
4. Обери **Query Tool**.
5. Відкрий файл:

```text
rewrite_fastapi/database/init/001_schema.sql
```

6. Виконай його кнопкою **Execute**.
7. Запусти backend за інструкцією вище.

## Що є в схемі

Схема нормалізована до третьої нормальної форми:

- користувачі та профілі винесені окремо;
- проєкти й сцени зберігаються окремо;
- аудіо, відео й зображення зберігаються в єдиній таблиці `media_file`;
- голоси, провайдери, статуси, мови, формати й типи медіа винесені в lookup-таблиці;
- генерації аудіо, переклади та генерації відео мають окремі таблиці;
- кредити й використання зберігаються через події `usage_event`.
