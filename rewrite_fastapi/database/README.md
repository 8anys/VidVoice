# VidVoice PostgreSQL Database

Ця папка містить SQL-схему бази даних для переписаної FastAPI-версії VidVoice.

Docker тут не використовується. Очікується, що PostgreSQL встановлений локально на Windows, а базу ти створюєш сам через **SQL Shell (psql)** або **pgAdmin**.

## Структура

```text
database/
  .env.example
  README.md
  init/
    001_schema.sql
```

## Варіант 1: Через SQL Shell (psql)

### 1. Відкрий SQL Shell

Запусти **SQL Shell (psql)** з меню Windows.

На питання відповідай так:

```text
Server [localhost]: 
Database [postgres]: vidvoice
Port [5432]: 
Username [postgres]: postgres
Password for user postgres: твій_пароль
```

Пояснення:

- `Server [localhost]` - просто натисни Enter.
- `Database [postgres]` - введи назву своєї бази, наприклад `vidvoice`.
- `Port [5432]` - просто натисни Enter.
- `Username [postgres]` - зазвичай `postgres`.
- Пароль не буде видно під час введення, це нормально.

Якщо база `vidvoice` вже створена, після входу ти побачиш щось схоже:

```text
vidvoice=#
```

### 2. Виконай SQL-схему

У SQL Shell введи команду з повним шляхом до файлу:

```sql
\i 'E:/Diplom/Ivan/VidVoice/rewrite_fastapi/database/init/001_schema.sql'
```

Важливо:

- Використовуй `/`, а не `\`, у шляху.
- Шлях треба брати в одинарні лапки.
- Команда починається з `\i`.

Після виконання мають з’явитися повідомлення типу:

```text
CREATE TABLE
CREATE INDEX
INSERT 0 2
```

Це означає, що таблиці створилися.

### 3. Перевір таблиці

У SQL Shell введи:

```sql
\dt
```

Ти маєш побачити список таблиць, наприклад:

```text
app_user
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

## Якщо база ще не створена

Якщо при вході в SQL Shell база `vidvoice` не існує, зайди спочатку в стандартну базу `postgres`:

```text
Server [localhost]: 
Database [postgres]: postgres
Port [5432]: 
Username [postgres]: postgres
```

Після входу створи базу:

```sql
CREATE DATABASE vidvoice;
```

Потім вийди:

```sql
\q
```

І зайди знову, але вже в базу `vidvoice`.

## Варіант 2: Через pgAdmin

1. Відкрий pgAdmin.
2. Створи базу `vidvoice`, якщо її ще немає.
3. Натисни правою кнопкою на базу `vidvoice`.
4. Обери **Query Tool**.
5. Відкрий файл:

```text
rewrite_fastapi/database/init/001_schema.sql
```

6. Виконай його кнопкою Execute.

## Підключення для майбутнього backend

Коли будемо підключати FastAPI до PostgreSQL, потрібен буде connection string:

```powershell
$env:DATABASE_URL="postgresql://postgres:твій_пароль@localhost:5432/vidvoice"
```

Якщо ти створиш окремого користувача для проєкту, наприклад `vidvoice`, тоді рядок буде:

```powershell
$env:DATABASE_URL="postgresql://vidvoice:пароль@localhost:5432/vidvoice"
```

## Що є в схемі

Схема нормалізована до третьої нормальної форми:

- користувачі та профілі винесені окремо;
- проєкти й сцени зберігаються окремо;
- аудіо, відео й зображення зберігаються в єдиній таблиці `media_file`;
- голоси, провайдери, статуси, мови, формати й типи медіа винесені в lookup-таблиці;
- генерації аудіо, переклади та генерації відео мають окремі таблиці;
- кредити й використання зберігаються через події `usage_event`.
