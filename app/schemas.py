from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class BaseResponse(BaseModel):
    status: str
    message: str
    data: Optional[Any] = None
    errors: Optional[Any] = None

class PolygonData(BaseModel):
    polygon_id: str
    zone_color: str
    status: str
    coordinates: Any

class MapPolygonsResponseData(BaseModel):
    last_satellite_update: str
    data: List[PolygonData]

class TimeSeriesData(BaseModel):
    months: List[str]
    ndvi_trend: List[float]
    cloud_cover_flags: List[bool]
    alert: Optional[str] = None

class TimeSeriesResponseData(BaseModel):
    polygon_id: str
    data: TimeSeriesData

class DashboardPieChart(BaseModel):
    total_area_ha: float
    distribution: Dict[str, float]

class DashboardBarChart(BaseModel):
    hutang_reklamasi_ha: float
    realisasi_reklamasi_ha: float

class DashboardOverviewData(BaseModel):
    pie_chart: DashboardPieChart
    bar_chart: DashboardBarChart

class DashboardDetailedData(BaseModel):
    # Using alias or dict mapping to output the exact keys
    # To keep it simple, we can return a Dict[str, float] directly or use a model
    pass
