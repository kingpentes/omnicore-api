from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models
from ..database import get_db

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"],
)

@router.get("/overview")
def get_overview(db: Session = Depends(get_db)):
    overview = db.query(models.AnalyticsOverview).first()
    
    if not overview:
        return {
            "status": "error",
            "message": "Data not found"
        }
        
    data = {
        "pie_chart": {
            "total_area_ha": overview.total_area_ha,
            "distribution": {
                "area_tambang_aktif": overview.area_tambang_aktif_pct,
                "area_vegetasi_awal": overview.area_vegetasi_awal_pct,
                "area_vegetasi_rapat": overview.area_vegetasi_rapat_pct
            }
        },
        "bar_chart": {
            "hutang_reklamasi_ha": overview.hutang_reklamasi_ha,
            "realisasi_reklamasi_ha": overview.realisasi_reklamasi_ha
        }
    }
    
    return {
        "status": "success",
        "message": "Overview fetched successfully",
        "data": data
    }

@router.get("/deep-analytics")
def get_deep_analytics(db: Session = Depends(get_db)):
    detailed = db.query(models.AnalyticsDetailed).first()
    
    if not detailed:
        return {
            "status": "error",
            "message": "Data not found"
        }
        
    data = {
        "1_a_area_penambangan_ha": detailed._1_a_area_penambangan_ha,
        "1_b_1_timbunan_topsoil_ha": detailed._1_b_1_timbunan_topsoil_ha,
        "1_b_4_jalan_tambang_ha": detailed._1_b_4_jalan_tambang_ha,
        "1_b_5_kolam_sedimen_ha": detailed._1_b_5_kolam_sedimen_ha,
        "1_b_6_pabrik_pemurnian_ha": detailed._1_b_6_pabrik_pemurnian_ha,
        "1_b_7_kantor_perumahan_ha": detailed._1_b_7_kantor_perumahan_ha,
        "1_b_8_bengkel_ha": detailed._1_b_8_bengkel_ha,
        "4_b_total_revegetasi_ha": detailed._4_b_total_revegetasi_ha
    }
    
    return {
        "status": "success",
        "message": "Analytics fetched successfully",
        "data": data
    }
