<?php
require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Config\Database;
use Illuminate\Database\Capsule\Manager as Capsule;

// Muat .env
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Boot Eloquent
Database::boot();

// Eksekusi PostgreSQL Schema
echo "Membuat tabel polygons...\n";
Capsule::schema()->dropIfExists('polygons');
Capsule::schema()->create('polygons', function ($table) {
    $table->id();
    $table->string('polygon_id')->unique();
    $table->string('zone_color');
    $table->string('status');
    $table->json('coordinates');
});

echo "Membuat tabel time_series...\n";
Capsule::schema()->dropIfExists('time_series');
Capsule::schema()->create('time_series', function ($table) {
    $table->id();
    $table->string('polygon_id');
    $table->string('month');
    $table->float('ndvi');
    $table->boolean('cloud_cover_flag');
});

echo "Membuat tabel analytics_overview...\n";
Capsule::schema()->dropIfExists('analytics_overview');
Capsule::schema()->create('analytics_overview', function ($table) {
    $table->id();
    $table->integer('total_area_ha');
    $table->integer('area_tambang_aktif_pct');
    $table->integer('area_vegetasi_awal_pct');
    $table->integer('area_vegetasi_rapat_pct');
    $table->integer('hutang_reklamasi_ha');
    $table->integer('realisasi_reklamasi_ha');
});

echo "Membuat tabel analytics_detailed...\n";
Capsule::schema()->dropIfExists('analytics_detailed');
Capsule::schema()->create('analytics_detailed', function ($table) {
    $table->id();
    $table->integer('1_a_area_penambangan_ha');
    $table->integer('1_b_1_timbunan_topsoil_ha');
    $table->integer('1_b_4_jalan_tambang_ha');
    $table->integer('1_b_5_kolam_sedimen_ha');
    $table->integer('1_b_6_pabrik_pemurnian_ha');
    $table->integer('1_b_7_kantor_perumahan_ha');
    $table->integer('1_b_8_bengkel_ha');
    $table->integer('4_b_total_revegetasi_ha');
});

echo "Setup Database Schema PostgreSQL selesai!\n";
