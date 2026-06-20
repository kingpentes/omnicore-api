from sqlalchemy import Column, String, Float, Boolean, JSON, Integer
from .database import Base

class Polygon(Base):
    __tablename__ = "polygons"

    polygon_id = Column(String, primary_key=True, index=True)
    zone_color = Column(String)
    status = Column(String)
    coordinates = Column(JSON)  # Using JSON for the coordinates text/json

class TimeSeries(Base):
    __tablename__ = "time_series"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True) # Assuming an ID exists, if not we need a composite PK or dummy
    polygon_id = Column(String, index=True)
    month = Column(String)
    ndvi = Column(Float)
    cloud_cover_flag = Column(Boolean)

class AnalyticsOverview(Base):
    __tablename__ = "analytics_overview"

    # Assume we just return the first row, we can use total_area_ha as PK or add a dummy id
    id = Column(Integer, primary_key=True, autoincrement=True)
    total_area_ha = Column(Float)
    area_tambang_aktif_pct = Column(Float)
    area_vegetasi_awal_pct = Column(Float)
    area_vegetasi_rapat_pct = Column(Float)
    hutang_reklamasi_ha = Column(Float)
    realisasi_reklamasi_ha = Column(Float)

class AnalyticsDetailed(Base):
    __tablename__ = "analytics_detailed"

    id = Column(Integer, primary_key=True, autoincrement=True)
    _1_a_area_penambangan_ha = Column("1_a_area_penambangan_ha", Float)
    _1_b_1_timbunan_topsoil_ha = Column("1_b_1_timbunan_topsoil_ha", Float)
    _1_b_4_jalan_tambang_ha = Column("1_b_4_jalan_tambang_ha", Float)
    _1_b_5_kolam_sedimen_ha = Column("1_b_5_kolam_sedimen_ha", Float)
    _1_b_6_pabrik_pemurnian_ha = Column("1_b_6_pabrik_pemurnian_ha", Float)
    _1_b_7_kantor_perumahan_ha = Column("1_b_7_kantor_perumahan_ha", Float)
    _1_b_8_bengkel_ha = Column("1_b_8_bengkel_ha", Float)
    _4_b_total_revegetasi_ha = Column("4_b_total_revegetasi_ha", Float)
