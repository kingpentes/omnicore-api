import type { DeepAnalyticsResponse, OverviewResponse } from "./api";

export const mockOverview: OverviewResponse = {
  pie_chart: {
    total_area_ha: 67242,
    distribution: {
      area_tambang_aktif: 42,
      area_vegetasi_awal: 27,
      area_vegetasi_rapat: 31
    }
  },
  bar_chart: {
    hutang_reklamasi_ha: 14820,
    realisasi_reklamasi_ha: 18920
  }
};

export const mockDeepAnalytics: DeepAnalyticsResponse = {
  "1_a_area_penambangan_ha": 42860,
  "1_b_1_timbunan_topsoil_ha": 5180,
  "1_b_4_jalan_tambang_ha": 1240,
  "1_b_5_kolam_sedimen_ha": 812,
  "1_b_6_pabrik_pemurnian_ha": 406,
  "1_b_7_kantor_perumahan_ha": 176,
  "1_b_8_bengkel_ha": 94,
  "4_b_total_revegetasi_ha": 18920
};

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

export type HealthBlock = {
  block: string;
  status: string;
  tone: StatusTone;
  ndvi: number;
  ndre: number;
  progress: number;
  alert: string;
};

export const healthBlocks: HealthBlock[] = [
  {
    block: "Blok A",
    status: "Subur",
    tone: "success",
    ndvi: 0.72,
    ndre: 0.48,
    progress: 75,
    alert: "Vegetasi rapat stabil"
  },
  {
    block: "Blok B",
    status: "Subur",
    tone: "success",
    ndvi: 0.72,
    ndre: 0.44,
    progress: 75,
    alert: "Suksesi perintis sehat"
  },
  {
    block: "Blok C",
    status: "Subur",
    tone: "success",
    ndvi: 0.72,
    ndre: 0.47,
    progress: 75,
    alert: "Kanopi berkembang"
  },
  {
    block: "Blok D",
    status: "Peringatan",
    tone: "warning",
    ndvi: 0.12,
    ndre: 0.09,
    progress: 25,
    alert: "Indikasi waterlogging"
  },
  {
    block: "Blok E",
    status: "Normal",
    tone: "info",
    ndvi: 0.32,
    ndre: 0.28,
    progress: 50,
    alert: "Pertumbuhan awal"
  },
  {
    block: "Blok F",
    status: "Kritis",
    tone: "danger",
    ndvi: 0.02,
    ndre: 0.04,
    progress: 25,
    alert: "Risiko longsor/dead plant"
  }
];

export type Intervention = {
  status: string;
  date: string;
  label: string;
  tone: StatusTone;
};

export const interventions: Intervention[] = [
  {
    status: "Aman",
    date: "14/11/2026",
    label: "Kondisi vegetasi rapat",
    tone: "success"
  },
  {
    status: "Peringatan",
    date: "3/9/2026",
    label: "Luapan badan air",
    tone: "warning"
  },
  {
    status: "Peringatan",
    date: "25/7/2026",
    label: "Erosi pada blok F",
    tone: "warning"
  },
  {
    status: "Butuh Tindakan",
    date: "18/6/2026",
    label: "Longsor pada jalur B-C",
    tone: "danger"
  }
];

export type RegulatoryMetric = {
  code: string;
  label: string;
  value: number;
  unit: string;
  tone: StatusTone;
  description: string;
};

export function buildRegulatoryMetrics(
  deepAnalytics: DeepAnalyticsResponse
): RegulatoryMetric[] {
  return [
    {
      code: "1.a",
      label: "Area Penambangan",
      value: deepAnalytics["1_a_area_penambangan_ha"],
      unit: "ha",
      tone: "neutral",
      description: "Master class open land dan active mine dari Sentinel-2."
    },
    {
      code: "1.b.1",
      label: "Timbunan tanah zona pengakaran",
      value: deepAnalytics["1_b_1_timbunan_topsoil_ha"],
      unit: "ha",
      tone: "warning",
      description: "Area top soil dan zona pengakaran siap penataan."
    },
    {
      code: "1.b.4",
      label: "Jalan tambang dan/atau jalan angkut",
      value: deepAnalytics["1_b_4_jalan_tambang_ha"],
      unit: "ha",
      tone: "info",
      description: "Koridor akses tambang, hauling road, dan jalan inspeksi."
    },
    {
      code: "1.b.5",
      label: "Kolam sedimen",
      value: deepAnalytics["1_b_5_kolam_sedimen_ha"],
      unit: "ha",
      tone: "info",
      description: "Badan air dan void yang dipantau sebagai sediment pond."
    },
    {
      code: "1.b.6",
      label: "Instalasi/pabrik pengolahan/pemurnian",
      value: deepAnalytics["1_b_6_pabrik_pemurnian_ha"],
      unit: "ha",
      tone: "neutral",
      description: "Kelas infrastruktur dengan footprint fasilitas proses."
    },
    {
      code: "1.b.7",
      label: "Kantor dan perumahan",
      value: deepAnalytics["1_b_7_kantor_perumahan_ha"],
      unit: "ha",
      tone: "neutral",
      description: "Bangunan operasional dan area pendukung."
    },
    {
      code: "1.b.8",
      label: "Bengkel",
      value: deepAnalytics["1_b_8_bengkel_ha"],
      unit: "ha",
      tone: "neutral",
      description: "Workshop dan maintenance yard."
    },
    {
      code: "4.b",
      label: "Revegetasi",
      value: deepAnalytics["4_b_total_revegetasi_ha"],
      unit: "ha",
      tone: "success",
      description: "Total vegetasi perintis dan hutan rapat terklasifikasi AI."
    }
  ];
}

export const trendMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"];

export const ndviTrend = [0.16, 0.69, 0.55, 0.5, 0.44, 0.31, 0.58];
export const ndreTrend = [0.14, 0.38, 0.31, 0.36, 0.41, 0.28, 0.47];
