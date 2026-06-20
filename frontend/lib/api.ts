export type ApiEnvelope<T> = {
  status: "success" | "error";
  message: string;
  data?: T;
};

export type OverviewResponse = {
  pie_chart: {
    total_area_ha: number;
    distribution: {
      area_tambang_aktif: number;
      area_vegetasi_awal: number;
      area_vegetasi_rapat: number;
    };
  };
  bar_chart: {
    hutang_reklamasi_ha: number;
    realisasi_reklamasi_ha: number;
  };
};

export type DeepAnalyticsResponse = {
  "1_a_area_penambangan_ha": number;
  "1_b_1_timbunan_topsoil_ha": number;
  "1_b_4_jalan_tambang_ha": number;
  "1_b_5_kolam_sedimen_ha": number;
  "1_b_6_pabrik_pemurnian_ha": number;
  "1_b_7_kantor_perumahan_ha": number;
  "1_b_8_bengkel_ha": number;
  "4_b_total_revegetasi_ha": number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

async function fetchApi<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiEnvelope<T>;
  if (payload.status !== "success" || !payload.data) {
    throw new Error(payload.message || "API returned an empty payload");
  }

  return payload.data;
}

export function getOverview() {
  return fetchApi<OverviewResponse>("/api/dashboard/overview");
}

export function getDeepAnalytics() {
  return fetchApi<DeepAnalyticsResponse>("/api/dashboard/deep-analytics");
}
