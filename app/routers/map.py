from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date
from .. import models, schemas
from ..database import get_db
import json

router = APIRouter(
    prefix="/api/map",
    tags=["map"],
)

@router.get("/polygons")
def get_polygons(db: Session = Depends(get_db)):
    polygons = db.query(models.Polygon).all()
    
    data_list = []
    for poly in polygons:
        # If coordinates is stringified JSON in DB, we need to parse it. 
        # If it's already a JSON column, we can use it directly.
        coords = poly.coordinates
        if isinstance(coords, str):
            try:
                coords = json.loads(coords)
            except json.JSONDecodeError:
                pass
                
        data_list.append({
            "polygon_id": poly.polygon_id,
            "zone_color": poly.zone_color,
            "status": poly.status,
            "coordinates": coords
        })
        
    return {
        "status": "success",
        "message": "Polygons fetched successfully",
        "data": {
            "last_satellite_update": date.today().isoformat(),
            "data": data_list
        }
    }

@router.get("/timeseries/{polygon_id}")
def get_time_series(polygon_id: str, db: Session = Depends(get_db)):
    records = db.query(models.TimeSeries).filter(models.TimeSeries.polygon_id == polygon_id).all()
    
    if not records:
        return {
            "status": "error",
            "message": "Polygon ID not found"
        }
        
    months = []
    ndvi_trend = []
    cloud_cover_flags = []
    has_cloud_alert = False
    
    for record in records:
        months.append(record.month)
        ndvi_trend.append(float(record.ndvi))
        cloud_cover_flags.append(bool(record.cloud_cover_flag))
        if record.cloud_cover_flag:
            has_cloud_alert = True
            
    return {
        "status": "success",
        "message": "Time series fetched successfully",
        "data": {
            "polygon_id": polygon_id,
            "data": {
                "months": months,
                "ndvi_trend": ndvi_trend,
                "cloud_cover_flags": cloud_cover_flags,
                "alert": "Penurunan NDVI mungkin disebabkan oleh tutupan awan (False Positive)." if has_cloud_alert else None
            }
        }
    }
