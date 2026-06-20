"use client";

import {
  Activity,
  AlertTriangle,
  Bell,
  Building2,
  CalendarDays,
  ChartPie,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Compass,
  Download,
  Factory,
  FileText,
  Info,
  LayoutDashboard,
  Map,
  MapPinned,
  MoreVertical,
  Play,
  RefreshCw,
  Route,
  Search,
  Settings,
  Trees,
  Wrench
} from "lucide-react";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { getDeepAnalytics, getOverview, type DeepAnalyticsResponse, type OverviewResponse } from "@/lib/api";

const InteractiveMap = dynamic(() => import("./InteractiveMap"), { ssr: false });
import {
  buildRegulatoryMetrics,
  healthBlocks,
  interventions,
  mockDeepAnalytics,
  mockOverview,
  ndreTrend,
  ndviTrend,
  trendMonths,
  type RegulatoryMetric,
  type StatusTone
} from "@/lib/mockData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type ViewMode = "dashboard" | "map";

const toneClass: Record<StatusTone, string> = {
  success: "tone-success",
  warning: "tone-warning",
  danger: "tone-danger",
  info: "tone-info",
  neutral: "tone-neutral"
};

function formatHa(value: number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0
  }).format(value);
}

function Header({
  activeView,
  onViewChange
}: {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
        </div>
        <strong>Reclaim</strong>
      </div>

      <nav className="view-tabs" aria-label="Tampilan utama">
        <button
          className={activeView === "map" ? "tab-button active" : "tab-button"}
          onClick={() => onViewChange("map")}
          type="button"
        >
          <Map size={22} />
          <span>Peta Interaktif</span>
        </button>
        <button
          className={activeView === "dashboard" ? "tab-button active" : "tab-button"}
          onClick={() => onViewChange("dashboard")}
          type="button"
        >
          <ChartPie size={22} />
          <span>Data Dashboard</span>
        </button>
      </nav>

      <div className="user-actions">
        <button className="icon-button" aria-label="Notifikasi" type="button">
          <Bell size={22} />
        </button>
        <div className="avatar" aria-label="User BC">
          BC
          <span />
        </div>
      </div>
    </header>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <button className="search-button" type="button">
        <Search size={20} />
        <span>Search...</span>
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </button>

      <div className="nav-group">
        <a className="nav-item active" href="#overview">
          <LayoutDashboard size={20} />
          <span>Overview Data Reklamasi</span>
        </a>
        <a className="nav-item muted" href="#summary">
          Executive Summary
        </a>
        <a className="nav-item muted" href="#analytics">
          Analytics & Forecast
        </a>
        <a className="nav-item muted" href="#compliance">
          Compliance Reports
        </a>
      </div>

      <div className="nav-group">
        <a className="nav-item active" href="#utilities">
          <Info size={20} />
          <span>Utilities</span>
        </a>
        <a className="nav-item muted" href="#settings">
          Settings
        </a>
        <a className="nav-item muted" href="#help">
          Help
        </a>
      </div>
    </aside>
  );
}

function FilterBar({
  apiMode,
  onRefresh
}: {
  apiMode: "live" | "fallback";
  onRefresh: () => void;
}) {
  return (
    <div className="filter-row">
      <div className="filter-left">
        <button className="select-button" type="button">
          <CalendarDays size={18} />
          <span>Data 30 hari terakhir</span>
          <ChevronDown size={18} />
        </button>
        <button className="select-button" type="button">
          <Route size={18} />
          <span>Blok lahan</span>
          <ChevronDown size={18} />
        </button>
      </div>
      <div className="sync-actions">
        <span>{apiMode === "live" ? "Synchronized with API" : "Fallback demo data"}</span>
        <button className="select-button" onClick={onRefresh} type="button">
          <RefreshCw size={18} />
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
}

function AlertBanner() {
  return (
    <section className="alert-banner" role="status">
      <AlertTriangle size={22} />
      <div>
        <strong>Perhatian</strong>
        <p>AI mendeteksi 12 Ha lahan vegetasi berisiko tinggi mengalami kegagalan pertumbuhan</p>
      </div>
    </section>
  );
}

function ProgressBar({
  value,
  tone = "success"
}: {
  value: number;
  tone?: StatusTone;
}) {
  return (
    <div className="progress-track" aria-label={`Progress ${value}%`}>
      <span className={`progress-value ${toneClass[tone]}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function Badge({
  children,
  tone
}: {
  children: React.ReactNode;
  tone: StatusTone;
}) {
  return <span className={`badge ${toneClass[tone]}`}>{children}</span>;
}

function KpiCard({
  title,
  value,
  detail,
  trend,
  progress,
  tone = "success"
}: {
  title: string;
  value: string;
  detail: string;
  trend: string;
  progress: number;
  tone?: StatusTone;
}) {
  return (
    <article className="data-card kpi-card">
      <h3>{title}</h3>
      <div className="kpi-main">
        <strong>{value}</strong>
        <div>
          <p>{detail}</p>
          <ProgressBar value={progress} tone={tone} />
        </div>
      </div>
      <div className="kpi-foot">
        <Badge tone={tone}>{trend}</Badge>
        <span>Dibanding bulan Mei</span>
      </div>
    </article>
  );
}

function HealthPanel() {
  return (
    <section className="data-card health-card" id="analytics">
      <h2>Perbandingan Performa Kesehatan Vegetasi Antar Blok Area Tambang (NDVI & NDRE)</h2>
      <div className="health-grid">
        {healthBlocks.map((block) => (
          <article className="health-item" key={block.block}>
            <Badge tone={block.tone}>{block.status}</Badge>
            <div className="health-row">
              <strong>{block.ndvi.toFixed(2)}</strong>
              <div>
                <p>{block.block}</p>
                <ProgressBar value={block.progress} tone={block.tone} />
              </div>
            </div>
            <span className="health-note">{block.alert}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function TrendChart() {
  const data = {
    labels: trendMonths,
    datasets: [
      {
        label: "NDVI",
        data: ndviTrend,
        borderColor: "#f6d76f",
        backgroundColor: "rgba(246, 215, 111, 0.35)",
        pointBackgroundColor: "#f6d76f",
        pointBorderColor: "#f6d76f",
        tension: 0.28
      },
      {
        label: "NDRE",
        data: ndreTrend,
        borderColor: "#9a89ff",
        backgroundColor: "rgba(154, 137, 255, 0.28)",
        pointBackgroundColor: "#9a89ff",
        pointBorderColor: "#9a89ff",
        tension: 0.28
      }
    ]
  };

  return (
    <section className="data-card chart-card" id="summary">
      <Line
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                boxWidth: 28,
                color: "#45556c",
                font: {
                  size: 12
                }
              }
            },
            title: {
              display: true,
              text: "Tren Estimasi Reklamasi Lahan",
              color: "#0f172b",
              font: {
                size: 12,
                weight: "bold"
              }
            }
          },
          scales: {
            y: {
              min: 0,
              max: 1,
              ticks: {
                color: "#62748e"
              },
              grid: {
                color: "rgba(148, 163, 184, 0.28)"
              }
            },
            x: {
              ticks: {
                color: "#62748e"
              },
              grid: {
                color: "rgba(148, 163, 184, 0.16)"
              }
            }
          }
        }}
      />
    </section>
  );
}

function PriorityPanel() {
  return (
    <section className="data-card priority-card">
      <h2>Daftar Prioritas Intervensi</h2>
      <div className="priority-list">
        {interventions.map((item) => (
          <article className="priority-item" key={`${item.status}-${item.label}`}>
            <div>
              <Badge tone={item.tone}>{item.status}</Badge>
              <span className="date-badge">{item.date}</span>
            </div>
            <p>{item.label}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuickActionPanel() {
  return (
    <section className="data-card action-card">
      <h2>Quick Action Panel</h2>
      <button type="button">
        <FileText size={18} />
        <span>Export Laporan Kuartal</span>
      </button>
      <button type="button">
        <ClipboardList size={18} />
        <span>Export Detail Area</span>
      </button>
    </section>
  );
}

function RegulatoryPanel({ metrics }: { metrics: RegulatoryMetric[] }) {
  const icons = [MapPinned, Trees, Route, Activity, Factory, Building2, Wrench, CheckCircle2];

  return (
    <section className="data-card regulatory-card" id="compliance">
      <div className="section-heading">
        <div>
          <h2>Data Tambahan Kepatuhan Reklamasi</h2>
          <p>Area klasifikasi AI untuk pelaporan 1.a, 1.b, 4.a, dan 4.b.</p>
        </div>
        <Badge tone="info">FastAPI ready</Badge>
      </div>

      <div className="reg-grid">
        {metrics.map((metric, index) => {
          const Icon = icons[index] ?? Activity;
          return (
            <article className="reg-item" key={metric.code}>
              <div className={`reg-icon ${toneClass[metric.tone]}`}>
                <Icon size={18} />
              </div>
              <div>
                <span>{metric.code}</span>
                <h3>{metric.label}</h3>
                <p>{metric.description}</p>
              </div>
              <strong>
                {formatHa(metric.value)} <small>{metric.unit}</small>
              </strong>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function SoilTransitionPanel() {
  return (
    <section className="data-card transition-card">
      <div className="section-heading">
        <div>
          <h2>4.a Penatagunaan Lahan</h2>
          <p>AI melacak transisi subsoil abu-abu menjadi top soil merah/cokelat.</p>
        </div>
        <Badge tone="warning">Top soil watch</Badge>
      </div>

      <div className="transition-visual" aria-label="Transisi warna subsoil ke top soil">
        <span className="subsoil">Subsoil</span>
        <span className="transition-arrow" />
        <span className="topsoil">Top Soil</span>
      </div>

      <div className="transition-metrics">
        <div>
          <span>Confidence</span>
          <strong>87%</strong>
        </div>
        <div>
          <span>Area tertata</span>
          <strong>3.820 ha</strong>
        </div>
        <div>
          <span>Cloud cover</span>
          <strong>12%</strong>
        </div>
      </div>
    </section>
  );
}

function MapWorkspace({ overview }: { overview: OverviewResponse }) {
  const distribution = overview.pie_chart.distribution;

  return (
    <main className="map-workspace" id="overview">
      <InteractiveMap overview={overview} />

      <section className="map-action-panel">
        <div className="panel-title">
          <Compass size={22} />
          <strong>Quick Action Panel</strong>
          <MoreVertical size={20} />
        </div>
        <div className="heatmap-box">
          <div>
            <h2>Heatmap Visual</h2>
            <p>Menampilkan kondisi terkini proses reklamasi</p>
          </div>
          <span className="toggle-switch" />
          <div className="legend">
            <strong>Map Legend</strong>
            <span><i className="legend-veg" />Vegetasi Rapat</span>
            <span><i className="legend-early" />Fase Awal Vegetasi</span>
            <span><i className="legend-mine" />Area Lubang Tambang</span>
          </div>
        </div>
        {[
          ["Waterlogging Detection (NDWI)", "Highlights depressions holding stagnant water"],
          ["Vegetation Health Monitoring (NDVI)", "Identifies areas of healthy and stressed vegetation"],
          ["Soil Moisture Estimation", "Detects moisture levels in soil for agricultural planning"],
          ["Soil Moisture Analysis", "Detects moisture levels to optimize irrigation scheduling"],
          ["Crop Disease Detection", "Early identification of disease outbreaks for timely intervention"]
        ].map(([title, description]) => (
          <label className="analysis-option" key={title}>
            <input type="checkbox" />
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
          </label>
        ))}
      </section>

      <section className="map-analytics-card">
        <div className="panel-title">
          <FileText size={22} />
          <strong>Reclamation Analytics</strong>
        </div>
        <div className="map-info-callout">
          <Info size={20} />
          <span>Klik pada area tertentu untuk menampilkan data spesifik</span>
        </div>
        <div className="donut-wrap">
          <div
            className="donut"
            style={{
              background: `conic-gradient(#ff9699 0 ${distribution.area_tambang_aktif}%, #6ee7a0 ${distribution.area_tambang_aktif}% ${
                distribution.area_tambang_aktif + distribution.area_vegetasi_rapat
              }%, #ffdb1e ${distribution.area_tambang_aktif + distribution.area_vegetasi_rapat}% 100%)`
            }}
          >
            <div>
              <span>Total Area</span>
              <strong>{formatHa(overview.pie_chart.total_area_ha)} ha</strong>
            </div>
          </div>
          <div className="donut-legend">
            <span><i className="legend-mine" />Area Tambang Aktif</span>
            <span><i className="legend-veg" />Area Vegetasi Hijau</span>
            <span><i className="legend-early" />Area Vegetasi Awal</span>
          </div>
        </div>
      </section>

      <section className="timeline-control">
        <button className="play-button" type="button">
          <Play size={20} />
        </button>
        <strong>Play</strong>
        <div className="months">
          {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"].map((month) => (
            <span key={month}>{month}</span>
          ))}
          <input aria-label="Timeline bulan" defaultValue={32} max={100} min={0} type="range" />
        </div>
      </section>
    </main>
  );
}

function DashboardView({
  overview,
  deepAnalytics,
  apiMode,
  onRefresh
}: {
  overview: OverviewResponse;
  deepAnalytics: DeepAnalyticsResponse;
  apiMode: "live" | "fallback";
  onRefresh: () => void;
}) {
  const metrics = useMemo(() => buildRegulatoryMetrics(deepAnalytics), [deepAnalytics]);
  const totalReclamation = deepAnalytics["4_b_total_revegetasi_ha"];
  const totalMining = deepAnalytics["1_a_area_penambangan_ha"];
  const complianceRatio = totalMining ? totalReclamation / totalMining : 0;
  const complianceStatus = complianceRatio > 0.7 ? "Excellent" : complianceRatio >= 0.4 ? "Moderate" : "Poor";

  return (
    <main className="dashboard-main">
      <FilterBar apiMode={apiMode} onRefresh={onRefresh} />
      <AlertBanner />

      <div className="dashboard-grid">
        <div className="left-column">
          <div className="kpi-grid">
            <KpiCard
              detail={`${formatHa(totalReclamation)} / ${formatHa(totalMining)} Ha`}
              progress={82}
              title="Target Reklamasi"
              trend="12%"
              value="82%"
            />
            <KpiCard
              detail={`${(complianceRatio * 100).toFixed(1)}% CR`}
              progress={Math.round(complianceRatio * 100)}
              title="Compliance Ratio"
              trend={complianceStatus}
              value={complianceRatio.toFixed(2)}
              tone={complianceRatio >= 0.4 ? "success" : "warning"}
            />
            <KpiCard
              detail={`${formatHa(overview.bar_chart.realisasi_reklamasi_ha)} Ha terealisasi`}
              progress={76}
              title="Revegetasi AI"
              trend="4.b"
              value={`${formatHa(totalReclamation)}`}
            />
          </div>

          <HealthPanel />
          <TrendChart />
          <RegulatoryPanel metrics={metrics} />
        </div>

        <aside className="right-column">
          <PriorityPanel />
          <QuickActionPanel />
          <SoilTransitionPanel />
        </aside>
      </div>
    </main>
  );
}

export default function OmniCoreDashboard() {
  const [activeView, setActiveView] = useState<ViewMode>("dashboard");
  const [overview, setOverview] = useState<OverviewResponse>(mockOverview);
  const [deepAnalytics, setDeepAnalytics] = useState<DeepAnalyticsResponse>(mockDeepAnalytics);
  const [apiMode, setApiMode] = useState<"live" | "fallback">("fallback");

  const refreshData = async () => {
    try {
      const [overviewData, deepAnalyticsData] = await Promise.all([getOverview(), getDeepAnalytics()]);
      setOverview(overviewData);
      setDeepAnalytics(deepAnalyticsData);
      setApiMode("live");
    } catch {
      setOverview(mockOverview);
      setDeepAnalytics(mockDeepAnalytics);
      setApiMode("fallback");
    }
  };

  useEffect(() => {
    void refreshData();
  }, []);

  return (
    <div className="app-shell">
      <Header activeView={activeView} onViewChange={setActiveView} />
      {activeView === "map" ? (
        <MapWorkspace overview={overview} />
      ) : (
        <div className="dashboard-shell">
          <Sidebar />
          <DashboardView
            apiMode={apiMode}
            deepAnalytics={deepAnalytics}
            onRefresh={refreshData}
            overview={overview}
          />
        </div>
      )}
    </div>
  );
}
