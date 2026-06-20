-- Create tables for OmniCore
-- This runs automatically on first PostgreSQL container start

CREATE TABLE IF NOT EXISTS polygons (
    id SERIAL PRIMARY KEY,
    polygon_id VARCHAR(255) UNIQUE NOT NULL,
    zone_color VARCHAR(255),
    status VARCHAR(255),
    coordinates JSONB
);

CREATE TABLE IF NOT EXISTS time_series (
    id SERIAL PRIMARY KEY,
    polygon_id VARCHAR(255),
    month VARCHAR(255),
    ndvi DOUBLE PRECISION,
    cloud_cover_flag BOOLEAN
);

CREATE TABLE IF NOT EXISTS analytics_overview (
    id SERIAL PRIMARY KEY,
    total_area_ha DOUBLE PRECISION,
    area_tambang_aktif_pct DOUBLE PRECISION,
    area_vegetasi_awal_pct DOUBLE PRECISION,
    area_vegetasi_rapat_pct DOUBLE PRECISION,
    hutang_reklamasi_ha DOUBLE PRECISION,
    realisasi_reklamasi_ha DOUBLE PRECISION
);

CREATE TABLE IF NOT EXISTS analytics_detailed (
    id SERIAL PRIMARY KEY,
    "1_a_area_penambangan_ha" DOUBLE PRECISION,
    "1_b_1_timbunan_topsoil_ha" DOUBLE PRECISION,
    "1_b_4_jalan_tambang_ha" DOUBLE PRECISION,
    "1_b_5_kolam_sedimen_ha" DOUBLE PRECISION,
    "1_b_6_pabrik_pemurnian_ha" DOUBLE PRECISION,
    "1_b_7_kantor_perumahan_ha" DOUBLE PRECISION,
    "1_b_8_bengkel_ha" DOUBLE PRECISION,
    "4_b_total_revegetasi_ha" DOUBLE PRECISION
);
