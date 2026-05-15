CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE app_user (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE language (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE ui_theme (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE export_format (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE user_profile (
    user_id UUID PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
    language_id SMALLINT NOT NULL REFERENCES language(id),
    theme_id SMALLINT NOT NULL REFERENCES ui_theme(id),
    default_export_format_id SMALLINT NOT NULL REFERENCES export_format(id),
    auto_save BOOLEAN NOT NULL DEFAULT TRUE,
    auto_translate BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE project_status (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE project (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    status_id SMALLINT NOT NULL REFERENCES project_status(id),
    primary_language_id SMALLINT NOT NULL REFERENCES language(id),
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE media_type (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE media_file (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    media_type_id SMALLINT NOT NULL REFERENCES media_type(id),
    original_filename TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    public_url TEXT NOT NULL UNIQUE,
    mime_type TEXT,
    file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes >= 0),
    checksum_sha256 TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE project_scene (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    scene_number INTEGER NOT NULL CHECK (scene_number > 0),
    source_text TEXT,
    translated_text TEXT,
    source_language_id SMALLINT REFERENCES language(id),
    target_language_id SMALLINT REFERENCES language(id),
    image_media_id UUID REFERENCES media_file(id) ON DELETE SET NULL,
    audio_media_id UUID REFERENCES media_file(id) ON DELETE SET NULL,
    duration_seconds NUMERIC(10, 3),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_project_scene_number UNIQUE (project_id, scene_number)
);

CREATE TABLE provider (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE voice_model (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id SMALLINT NOT NULL REFERENCES provider(id),
    external_model_id TEXT NOT NULL,
    name TEXT NOT NULL,
    supports_multilingual BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_voice_model_provider_external UNIQUE (provider_id, external_model_id)
);

CREATE TABLE voice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id SMALLINT NOT NULL REFERENCES provider(id),
    external_voice_id TEXT NOT NULL,
    name TEXT NOT NULL,
    style_description TEXT,
    category TEXT,
    CONSTRAINT uq_voice_provider_external UNIQUE (provider_id, external_voice_id)
);

CREATE TABLE job_status (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE tts_generation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES project(id) ON DELETE SET NULL,
    scene_id UUID REFERENCES project_scene(id) ON DELETE SET NULL,
    provider_id SMALLINT NOT NULL REFERENCES provider(id),
    voice_id UUID REFERENCES voice(id) ON DELETE SET NULL,
    voice_model_id UUID REFERENCES voice_model(id) ON DELETE SET NULL,
    status_id SMALLINT NOT NULL REFERENCES job_status(id),
    source_text TEXT NOT NULL,
    language_id SMALLINT REFERENCES language(id),
    stability NUMERIC(4, 3) CHECK (stability BETWEEN 0 AND 1),
    similarity_boost NUMERIC(4, 3) CHECK (similarity_boost BETWEEN 0 AND 1),
    style NUMERIC(4, 3) CHECK (style BETWEEN 0 AND 1),
    speed NUMERIC(4, 3) CHECK (speed BETWEEN 0.7 AND 1.2),
    use_speaker_boost BOOLEAN NOT NULL DEFAULT TRUE,
    output_audio_media_id UUID REFERENCES media_file(id) ON DELETE SET NULL,
    character_count INTEGER NOT NULL DEFAULT 0 CHECK (character_count >= 0),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE translation_job (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES project(id) ON DELETE SET NULL,
    scene_id UUID REFERENCES project_scene(id) ON DELETE SET NULL,
    status_id SMALLINT NOT NULL REFERENCES job_status(id),
    source_language_id SMALLINT REFERENCES language(id),
    target_language_id SMALLINT NOT NULL REFERENCES language(id),
    source_text TEXT NOT NULL,
    translated_text TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE aspect_ratio (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    width INTEGER NOT NULL CHECK (width > 0),
    height INTEGER NOT NULL CHECK (height > 0),
    name TEXT NOT NULL
);

CREATE TABLE animation_type (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE video_generation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES project(id) ON DELETE SET NULL,
    status_id SMALLINT NOT NULL REFERENCES job_status(id),
    aspect_ratio_id SMALLINT NOT NULL REFERENCES aspect_ratio(id),
    output_video_media_id UUID REFERENCES media_file(id) ON DELETE SET NULL,
    duration_seconds NUMERIC(10, 3),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE video_generation_scene (
    video_generation_id UUID NOT NULL REFERENCES video_generation(id) ON DELETE CASCADE,
    scene_id UUID NOT NULL REFERENCES project_scene(id) ON DELETE RESTRICT,
    animation_type_id SMALLINT NOT NULL REFERENCES animation_type(id),
    position INTEGER NOT NULL CHECK (position > 0),
    PRIMARY KEY (video_generation_id, position),
    CONSTRAINT uq_video_generation_scene UNIQUE (video_generation_id, scene_id)
);

CREATE TABLE usage_event_type (
    id SMALLSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
);

CREATE TABLE credit_account (
    user_id UUID PRIMARY KEY REFERENCES app_user(id) ON DELETE CASCADE,
    total_credits INTEGER NOT NULL DEFAULT 0 CHECK (total_credits >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE usage_event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    project_id UUID REFERENCES project(id) ON DELETE SET NULL,
    usage_event_type_id SMALLINT NOT NULL REFERENCES usage_event_type(id),
    provider_id SMALLINT REFERENCES provider(id),
    reference_id UUID,
    characters INTEGER NOT NULL DEFAULT 0 CHECK (characters >= 0),
    credits_used INTEGER NOT NULL DEFAULT 0 CHECK (credits_used >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_owner ON project(owner_id);
CREATE INDEX idx_media_file_owner_type ON media_file(owner_id, media_type_id);
CREATE INDEX idx_project_scene_project ON project_scene(project_id, scene_number);
CREATE INDEX idx_tts_generation_project ON tts_generation(project_id, created_at DESC);
CREATE INDEX idx_translation_job_project ON translation_job(project_id, created_at DESC);
CREATE INDEX idx_video_generation_project ON video_generation(project_id, created_at DESC);
CREATE INDEX idx_usage_event_user_created ON usage_event(user_id, created_at DESC);

INSERT INTO language (code, name) VALUES
    ('en', 'English'),
    ('uk', 'Ukrainian')
ON CONFLICT (code) DO NOTHING;

INSERT INTO ui_theme (code, name) VALUES
    ('dark', 'Dark'),
    ('light', 'Light')
ON CONFLICT (code) DO NOTHING;

INSERT INTO export_format (code, name) VALUES
    ('mp4', 'MP4'),
    ('mp3', 'MP3')
ON CONFLICT (code) DO NOTHING;

INSERT INTO project_status (code, name) VALUES
    ('draft', 'Draft'),
    ('in_progress', 'In progress'),
    ('completed', 'Completed'),
    ('failed', 'Failed')
ON CONFLICT (code) DO NOTHING;

INSERT INTO media_type (code, name) VALUES
    ('image', 'Image'),
    ('audio', 'Audio'),
    ('video', 'Video')
ON CONFLICT (code) DO NOTHING;

INSERT INTO provider (code, name) VALUES
    ('elevenlabs', 'ElevenLabs'),
    ('google_translate', 'Google Translate')
ON CONFLICT (code) DO NOTHING;

INSERT INTO job_status (code, name) VALUES
    ('queued', 'Queued'),
    ('running', 'Running'),
    ('completed', 'Completed'),
    ('failed', 'Failed')
ON CONFLICT (code) DO NOTHING;

INSERT INTO aspect_ratio (code, width, height, name) VALUES
    ('16:9', 1920, 1080, 'YouTube landscape'),
    ('9:16', 1080, 1920, 'Shorts portrait'),
    ('1:1', 1080, 1080, 'Square')
ON CONFLICT (code) DO NOTHING;

INSERT INTO animation_type (code, name) VALUES
    ('zoom_in', 'Zoom in'),
    ('pan_up', 'Pan up'),
    ('pan_down', 'Pan down')
ON CONFLICT (code) DO NOTHING;

INSERT INTO usage_event_type (code, name) VALUES
    ('tts', 'Text to speech'),
    ('translation', 'Translation'),
    ('video_render', 'Video render'),
    ('upload', 'Upload')
ON CONFLICT (code) DO NOTHING;
