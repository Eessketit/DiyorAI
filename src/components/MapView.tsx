import { useEffect, useRef, useState } from "react";
import { TourismObject } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";
import { Layers, MapPin } from "lucide-react";

interface Stop extends TourismObject {
  order: number;
  dayNumber: number;
}

const DAY_COLORS = ["#1E3A8A", "#C1622E", "#2563EB", "#0D9488", "#7C3AED", "#EA580C", "#0284C7"];
const YANDEX_KEY = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || "2de6a0d8-593f-410b-ade8-047087ce2704";

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function MapView({ stops }: { stops: Stop[] }) {
  const { language } = useTranslation();
  const [engine, setEngine] = useState<"osm" | "yandex">("osm"); // default to OSM for instant reliable zero-block rendering
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ymapsInstanceRef = useRef<any>(null);
  const leafletMapRef = useRef<any>(null);

  // Initialize Map based on selected engine
  useEffect(() => {
    let cancelled = false;

    async function renderMap() {
      if (!containerRef.current || stops.length === 0) return;

      setLoading(true);

      // Clean up previous instances
      if (ymapsInstanceRef.current) {
        try {
          ymapsInstanceRef.current.destroy();
        } catch {}
        ymapsInstanceRef.current = null;
      }
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch {}
        leafletMapRef.current = null;
      }
      containerRef.current.innerHTML = "";

      const validStops = stops.filter((s) => s.lat && s.lon && !isNaN(s.lat) && !isNaN(s.lon));
      if (validStops.length === 0) {
        setLoading(false);
        return;
      }

      if (engine === "yandex") {
        try {
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

            try {
              const map = new window.ymaps.Map(
                containerRef.current,
                {
                  center: [validStops[0].lat, validStops[0].lon],
                  zoom: 13,
                  controls: ["zoomControl", "fullscreenControl", "typeSelector", "geolocationControl"],
                },
                {
                  searchControlProvider: "yandex#search",
                }
              );
              ymapsInstanceRef.current = map;

              const byDay: Record<number, Stop[]> = {};
              validStops.forEach((s) => {
                byDay[s.dayNumber] = byDay[s.dayNumber] || [];
                byDay[s.dayNumber].push(s);
              });

              // Draw markers and routes
              Object.entries(byDay).forEach(([day, dayStops]) => {
                const color = DAY_COLORS[(Number(day) - 1) % DAY_COLORS.length];

                // Placemarks
                dayStops.forEach((s) => {
                  const layout = window.ymaps.templateLayoutFactory.createClass(
                    `<div style="background:${color};color:#FFFFFF;border-radius:9999px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;box-shadow:0 3px 8px rgba(0,0,0,0.35);border:2px solid #FFFFFF;">${s.order}</div>`
                  );

                  const placemark = new window.ymaps.Placemark(
                    [s.lat, s.lon],
                    {
                      balloonContentHeader: `<strong style="color:#1E3A8A;font-size:15px;">${s.name}</strong>`,
                      balloonContentBody: `<div style="font-size:12px;margin-top:4px;color:#334155;">${s.description}</div><div style="font-size:11px;color:#64748B;margin-top:6px;font-weight:600;">${language === "uz" ? "Kun" : language === "en" ? "Day" : "День"} ${s.dayNumber} · №${s.order}</div>`,
                      hintContent: s.name,
                    },
                    {
                      iconLayout: layout,
                      iconShape: {
                        type: "Circle",
                        coordinates: [16, 16],
                        radius: 16,
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
                      balloonContent: `${language === "uz" ? "Marshrut" : language === "en" ? "Route" : "Маршрут"}: ${language === "uz" ? "Kun" : language === "en" ? "Day" : "День"} ${day}`,
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
              if (validStops.length > 0) {
                const bounds = map.geoObjects.getBounds();
                if (bounds) {
                  map.setBounds(bounds, { checkZoomRange: true, zoomMargin: 40 });
                }
              }
              setLoading(false);
            } catch (err) {
              console.warn("Yandex Maps instance init failed, falling back to OSM", err);
              setEngine("osm");
            }
          });
        } catch (e) {
          console.warn("Yandex Maps script load failed, falling back to OSM", e);
          setEngine("osm");
        }
      } else {
        // Leaflet / OpenStreetMap
        try {
          const L = await import("leaflet");
          if (cancelled || !containerRef.current) return;

          const map = L.map(containerRef.current, { scrollWheelZoom: false });
          leafletMapRef.current = map;

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 19,
          }).addTo(map);

          const byDay: Record<number, Stop[]> = {};
          validStops.forEach((s) => {
            byDay[s.dayNumber] = byDay[s.dayNumber] || [];
            byDay[s.dayNumber].push(s);
          });

          Object.entries(byDay).forEach(([day, dayStops]) => {
            const color = DAY_COLORS[(Number(day) - 1) % DAY_COLORS.length];
            const latlngs: [number, number][] = dayStops.map((s) => [s.lat, s.lon]);
            if (latlngs.length >= 2) {
              (L as any).polyline(latlngs, { color, weight: 3.5, opacity: 0.85, dashArray: "6 6" }).addTo(map);
            }

            dayStops.forEach((s) => {
              const icon = (L as any).divIcon({
                className: "custom-div-icon",
                html: `<div style="background:${color};color:#FFFFFF;border-radius:9999px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;box-shadow:0 3px 8px rgba(0,0,0,0.35);border:2px solid #FFFFFF;">${s.order}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 15],
              });
              (L as any)
                .marker([s.lat, s.lon], { icon })
                .addTo(map)
                .bindPopup(`<div style="font-family:sans-serif;padding:2px;"><strong style="color:#1E3A8A;font-size:14px;">${s.name}</strong><p style="font-size:12px;margin:4px 0;color:#334155;">${s.description}</p><span style="font-size:11px;font-weight:bold;color:#64748B;">${language === "uz" ? "Kun" : language === "en" ? "Day" : "День"} ${s.dayNumber} · №${s.order}</span></div>`);
            });
          });

          const bounds = (L as any).latLngBounds(validStops.map((s) => [s.lat, s.lon]));
          map.fitBounds(bounds, { padding: [40, 40] });

          // Invalidate size to guarantee tiles render properly
          setTimeout(() => {
            if (leafletMapRef.current) {
              leafletMapRef.current.invalidateSize();
            }
            setLoading(false);
          }, 200);
        } catch (e) {
          console.error("Leaflet load error", e);
          setLoading(false);
        }
      }
    }

    renderMap();

    return () => {
      cancelled = true;
      if (ymapsInstanceRef.current) {
        try {
          ymapsInstanceRef.current.destroy();
        } catch {}
        ymapsInstanceRef.current = null;
      }
      if (leafletMapRef.current) {
        try {
          leafletMapRef.current.remove();
        } catch {}
        leafletMapRef.current = null;
      }
    };
  }, [stops, engine, language]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white">
      {/* Map Header / Layer Switcher */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md border border-slate-200 px-2 py-1.5 rounded-2xl shadow-lg flex items-center gap-1.5 text-xs font-mono">
        <span className="text-slate-500 text-[11px] px-1 hidden sm:inline">
          {language === "uz" ? "Xarita:" : language === "en" ? "Map Engine:" : "Провайдер:"}
        </span>
        <button
          type="button"
          onClick={() => setEngine("osm")}
          className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            engine === "osm"
              ? "bg-[#1E3A8A] text-white font-bold shadow-xs scale-102"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <span>🌐</span> OpenStreetMap
        </button>
        <button
          type="button"
          onClick={() => setEngine("yandex")}
          className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
            engine === "yandex"
              ? "bg-amber-400 text-slate-900 font-bold shadow-xs scale-102"
              : "text-slate-700 hover:bg-slate-100"
          }`}
          title="Яндекс Карты"
        >
          <span>🟡</span> Яндекс Карты
        </button>
      </div>

      <div ref={containerRef} className="w-full h-[460px] bg-slate-100" />
    </div>
  );
}
