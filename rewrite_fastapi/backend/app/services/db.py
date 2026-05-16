from __future__ import annotations

from contextlib import contextmanager

import psycopg
from psycopg.rows import dict_row

from app.core.config import DATABASE_URL


@contextmanager
def db_connection():
    with psycopg.connect(DATABASE_URL, row_factory=dict_row) as connection:
        yield connection
