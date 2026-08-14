import { useEffect, useRef, useState } from "react";
import { TourismObject } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface Stop extends TourismObject {
  order: number;
  dayNumber: number;
}

const DAY_COLORS = ["#B5563C", "#3A8FA0", "#2F6F4E", "#B98A2A", "#9C3B3B", "#6B4C9A", "#16324F"];
const YANDEX_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "2de6a0d8-593f-410b-ade8-047087ce2704";

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function MapView({ stops }: { stops: Stop[] }) {
  const { language } = useTranslation();
  const [engine, setEngine] = useState<"yandex" | "osm">("yandex");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ymapsInstanceRef = useRef<any>(null);
  const leafletMapRef = useRef<any>(null);

  // Initialize Map based on selected engine
  useEffect(() => {
    let cancelled = false;

    async function renderMap() {
      if (!containerRef.current || stops.length === 0) return;

      // Clean up previous instances
      if (ymapsInstanceRef.current) {
        ymapsInstanceRef.current.destroy();
        ymapsInstanceRef.current = null;
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      containerRef.current.innerHTML = "";

      if (engine === "yandex") {
        // Load Yandex Maps script if not loaded
        const yLang = language === "en" ? "en_US" : "ru_RU";
        if (!window.ymaps) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_KEY}&lang=${yLang}`;
            script.type = "text/javascript";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Yandex script failed"));
            document.head.appendChild(script);
          });
        }

        if (cancelled || !containerRef.current) return;

        window.ymaps.ready(() => {
          if (cancelled || !containerRef.current) return;

          const map = new window.ymaps.Map(
            containerRef.current,
            {
              center: [stops[0].lat, stops[0].lon],
              zoom: 13,
              controls: ["zoomControl", "fullscreenControl", "typeSelector", "geolocationControl"],
            },
            {
              searchControlProvider: "yandex#search",
            }
          );
          ymapsInstanceRef.current = map;

          const byDay: Record<number, Stop[]> = {};
          stops.forEach((s) => {
            byDay[s.dayNumber] = byDay[s.dayNumber] || [];
            byDay[s.dayNumber].push(s);
          });

          // Draw markers and routes
          Object.entries(byDay).forEach(([day, dayStops]) => {
            const color = DAY_COLORS[(Number(day) - 1) % DAY_COLORS.length];

            // Placemarks
            dayStops.forEach((s) => {
              const layout = window.ymaps.templateLayoutFactory.createClass(
                `<div style="background:${color};color:#F3ECDD;border-radius:9999px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.35);border:2px solid #FFFFFF;">${s.order}</div>`
              );

              const placemark = new window.ymaps.Placemark(
                [s.lat, s.lon],
                {
                  balloonContentHeader: `<strong style="color:#B5563C;font-size:14px;">${s.name}</strong>`,
                  balloonContentBody: `<div style="font-size:12px;margin-top:4px;">${s.description}</div><div style="font-size:11px;color:#888;margin-top:6px;">День ${s.dayNumber} · Остановка №${s.order}</div>`,
                  hintContent: s.name,
                },
                {
                  iconLayout: layout,
                  iconShape: {
                    type: "Circle",
                    coordinates: [15, 15],
                    radius: 15,
                  },
                }
              );
              map.geoObjects.add(placemark);
            });

            // Polyline route
            if (dayStops.length >= 2) {
              const coords = dayStops.map((s) => [s.lat, s.lon]);
              const polyline = new window.ymaps.Polyline(
                coords,
                {
                  balloonContent: `Маршрут: День ${day}`,
                },
                {
                  strokeColor: color,
                  strokeWidth: 4,
                  strokeOpacity: 0.85,
                  strokeStyle: "shortdash",
                }
              );
              map.geoObjects.add(polyline);
            }
          });

          // Fit bounds
          if (stops.length > 0) {
            const bounds = map.geoObjects.getBounds();
            if (bounds) {
              map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40 });
            }
          }
        });
      } else {
        // Leaflet / OpenStreetMap fallback
        const L = await import("leaflet");
        if (cancelled || !containerRef.current) return;

        const map = L.map(containerRef.current, { scrollWheelZoom: false });
        leafletMapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(map);

        const byDay: Record<number, Stop[]> = {};
        stops.forEach((s) => {
          byDay[s.dayNumber] = byDay[s.dayNumber] || [];
          byDay[s.dayNumber].push(s);
        });

        Object.entries(byDay).forEach(([day, dayStops]) => {
          const color = DAY_COLORS[(Number(day) - 1) % DAY_COLORS.length];
          const latlngs: [number, number][] = dayStops.map((s) => [s.lat, s.lon]);
          (L as any).polyline(latlngs, { color, weight: 3, opacity: 0.8, dashArray: "6 6" }).addTo(map);

          dayStops.forEach((s) => {
            const icon = (L as any).divIcon({
              className: "",
              html: `<div style="background:${color};color:#F3ECDD;border-radius:9999px;width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;box-shadow:0 1px 4px rgba(0,0,0,0.35);border:2px solid #FFFFFF;">${s.order}</div>`,
              iconSize: [28, 28],
            });
            (L as any)
              .marker([s.lat, s.lon], { icon })
              .addTo(map)
              .bindPopup(`<strong>${s.name}</strong><br/>День ${s.dayNumber}`);
          });
        });

        const bounds = (L as any).latLngBounds(stops.map((s) => [s.lat, s.lon]));
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    }

    renderMap();

    return () => {
      cancelled = true;
      if (ymapsInstanceRef.current) {
        ymapsInstanceRef.current.destroy();
        ymapsInstanceRef.current = null;
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [stops, engine, language]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-sand shadow-sm">
      {/* Map Header / Layer Switcher */}
      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur border border-sand px-2 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 text-xs font-medium">
        <span className="text-night/50 text-[11px] px-1 hidden sm:inline">Провайдер:</span>
        <button
          onClick={() => setEngine("yandex")}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
            engine === "yandex"
              ? "bg-yellow-400 text-ink font-bold shadow-xs scale-105"
              : "text-night/70 hover:bg-sand/40"
          }`}
          title="Официальный партнер хакатона"
        >
          <span>🟡</span> Яндекс Карты
        </button>
        <button
          onClick={() => setEngine("osm")}
          className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
            engine === "osm"
              ? "bg-ink text-plaster font-bold shadow-xs scale-105"
              : "text-night/70 hover:bg-sand/40"
          }`}
        >
          <span>🌐</span> OpenStreetMap
        </button>
      </div>

      <div ref={containerRef} className="w-full h-[450px] bg-sand/20" />
    </div>
  );
}
