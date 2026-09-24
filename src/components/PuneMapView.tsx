import React, { useEffect, useRef, useState } from 'react';
import { WorkerProfile } from '../types';
import { PUNE_LOCALITIES } from '../data/puneData';
import { MapPin, Star, ShieldCheck, Sparkles, Navigation, Layers, Phone, MessageSquare, UserCheck, ExternalLink } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface PuneMapViewProps {
  workers: WorkerProfile[];
  currentLocality: string;
  onSelectWorker: (worker: WorkerProfile) => void;
  onChatWorker: (worker: WorkerProfile) => void;
}

export const PuneMapView: React.FC<PuneMapViewProps> = ({
  workers,
  currentLocality,
  onSelectWorker,
  onChatWorker
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedLocalityFilter, setSelectedLocalityFilter] = useState<string>('all');
  const [activeWorkerPopup, setActiveWorkerPopup] = useState<WorkerProfile | null>(null);
  const [mapReady, setMapReady] = useState<boolean>(false);

  // Initialize Leaflet Map with OpenStreetMap (Zero-Config, No API Key Required)
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Find current locality coords or fallback to Pune center
    const activeLoc = PUNE_LOCALITIES.find(
      l => l.name.toLowerCase() === currentLocality.toLowerCase()
    );
    const initialLat = activeLoc ? activeLoc.lat : 18.5204;
    const initialLng = activeLoc ? activeLoc.lng : 73.8567;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: true
    });

    // Free OpenStreetMap Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    markersLayerRef.current = markersLayer;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersLayerRef.current = null;
    };
  }, []);

  // Update map center when currentLocality changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const loc = PUNE_LOCALITIES.find(l => l.name.toLowerCase() === currentLocality.toLowerCase());
    if (loc) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 13, { duration: 1 });
    }
  }, [currentLocality]);

  // Render markers for workers and user locality
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const layer = markersLayerRef.current;
    layer.clearLayers();

    // 1. Add User's Current Locality Marker (Pulse)
    const activeLoc = PUNE_LOCALITIES.find(
      l => l.name.toLowerCase() === currentLocality.toLowerCase()
    );
    if (activeLoc) {
      const userIcon = L.divIcon({
        className: 'user-pulse-marker',
        html: `
          <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 32px; height: 32px; background: #3b82f6; border-radius: 50%; opacity: 0.35; animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 18px; height: 18px; background: #2563eb; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 10px rgba(0,0,0,0.35);"></div>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      L.marker([activeLoc.lat, activeLoc.lng], { icon: userIcon })
        .bindTooltip(`📍 You are in ${activeLoc.name}`, { permanent: false, direction: 'top' })
        .addTo(layer);
    }

    // 2. Add Worker Markers
    const filtered = selectedLocalityFilter === 'all'
      ? workers
      : workers.filter(w => w.baseLocality.toLowerCase() === selectedLocalityFilter.toLowerCase());

    filtered.forEach(worker => {
      // Find locality coords
      const wLoc = PUNE_LOCALITIES.find(
        l => l.name.toLowerCase() === worker.baseLocality.toLowerCase()
      ) || activeLoc || { lat: 18.5204, lng: 73.8567 };

      // Add a slight jitter if multiple workers in the same locality
      const latJitter = (Math.random() - 0.5) * 0.006;
      const lngJitter = (Math.random() - 0.5) * 0.006;
      const markerLat = wLoc.lat + latJitter;
      const markerLng = wLoc.lng + lngJitter;

      const categoryColor =
        worker.primaryCategory === 'Plumbing' ? '#0284c7' :
        worker.primaryCategory === 'Electrical' ? '#eab308' :
        worker.primaryCategory === 'Carpentry' ? '#b45309' :
        worker.primaryCategory === 'Cleaning' ? '#10b981' :
        worker.primaryCategory === 'AC & Appliance' ? '#6366f1' : '#3b82f6';

      const initial = worker.name.charAt(0);

      const workerIcon = L.divIcon({
        className: 'worker-leaflet-pin',
        html: `
          <div style="position: relative; width: 44px; height: 44px; cursor: pointer; transition: transform 0.2s;" class="hover:scale-110">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: ${categoryColor}; border: 3px solid white; box-shadow: 0 4px 14px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 14px; overflow: hidden;">
              ${worker.profilePhoto ? `<img src="${worker.profilePhoto}" style="width: 100%; height: 100%; object-fit: cover;" alt="${worker.name}" />` : initial}
            </div>
            <div style="position: absolute; bottom: 0; right: 0; background: #1e293b; color: #facc15; font-size: 9px; font-weight: 800; padding: 1px 4px; border-radius: 6px; border: 1px solid white; display: flex; align-items: center; gap: 1px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ★ ${worker.rating}
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([markerLat, markerLng], { icon: workerIcon }).addTo(layer);

      marker.on('click', () => {
        setActiveWorkerPopup(worker);
        mapInstanceRef.current?.panTo([markerLat, markerLng], { animate: true });
      });
    });
  }, [workers, currentLocality, selectedLocalityFilter, mapReady]);

  const handleLocalityFilterClick = (localityName: string) => {
    setSelectedLocalityFilter(localityName);
    if (localityName !== 'all' && mapInstanceRef.current) {
      const loc = PUNE_LOCALITIES.find(l => l.name.toLowerCase() === localityName.toLowerCase());
      if (loc) {
        mapInstanceRef.current.flyTo([loc.lat, loc.lng], 14, { duration: 1 });
      }
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([18.5204, 73.8567], 12, { duration: 1 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: Built-in OpenStreetMap (No API key needed) */}
      <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-sm text-emerald-950 flex items-center gap-1.5">
              <span>Interactive Pune Live Map</span>
              <span className="bg-emerald-200 text-emerald-800 text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md">
                OpenStreetMap Free
              </span>
            </div>
            <p className="text-emerald-700/90 text-xs">
              Live GIS coordinates across 30+ Pune zones • No Google Maps API key required
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-semibold text-slate-700">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block animate-pulse"></span>
            Your Locality: <strong className="text-slate-900">{currentLocality}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-semibold text-slate-700">
            Workers on Map: <strong className="text-slate-900">{workers.length}</strong>
          </span>
        </div>
      </div>

      {/* Locality Quick Jump Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] shrink-0 flex items-center gap-1">
          <Navigation className="w-3 h-3 text-blue-600" />
          Quick Zoom:
        </span>
        <button
          onClick={() => handleLocalityFilterClick('all')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedLocalityFilter === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All Pune ({workers.length})
        </button>
        {PUNE_LOCALITIES.slice(0, 10).map(loc => {
          const count = workers.filter(w => w.baseLocality.toLowerCase() === loc.name.toLowerCase()).length;
          return (
            <button
              key={loc.name}
              onClick={() => handleLocalityFilterClick(loc.name)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedLocalityFilter.toLowerCase() === loc.name.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {loc.name} {count > 0 && <span className="opacity-70 font-normal">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Map Container */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 h-[520px]">
        {/* Leaflet DOM Node */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Selected Worker Details Drawer / Floating Card */}
        {activeWorkerPopup && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-slate-200/90 shadow-2xl z-1000 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 font-black text-lg flex items-center justify-center overflow-hidden border border-blue-200">
                    {activeWorkerPopup.profilePhoto ? (
                      <img src={activeWorkerPopup.profilePhoto} alt={activeWorkerPopup.name} className="w-full h-full object-cover" />
                    ) : (
                      activeWorkerPopup.name.charAt(0)
                    )}
                  </div>
                  {activeWorkerPopup.isAvailable && (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-900 text-sm">{activeWorkerPopup.name}</h4>
                    {activeWorkerPopup.verification.identityVerified && (
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-blue-700">{activeWorkerPopup.primaryCategory}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {activeWorkerPopup.rating} ({activeWorkerPopup.totalReviews})
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveWorkerPopup(null)}
                className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 rounded-xl p-2.5 border border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Base Location</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {activeWorkerPopup.baseLocality}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Starting Rate</span>
                <span className="font-bold text-emerald-700 mt-0.5 block">
                  ₹{activeWorkerPopup.startingPrice} <span className="text-[10px] font-normal text-slate-500">visiting</span>
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => onSelectWorker(activeWorkerPopup)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>View Full Profile</span>
              </button>
              <button
                onClick={() => onChatWorker(activeWorkerPopup)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold p-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Message Technician"
              >
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 px-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white inline-block"></span>
            <span>You ({currentLocality})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white inline-block"></span>
            <span>Cleaners & Techs</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white inline-block"></span>
            <span>Electricians</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-600 border border-white inline-block"></span>
            <span>Plumbers</span>
          </span>
        </div>
        <span className="text-slate-400">Drag to explore Pune • Click marker for instant profile</span>
      </div>
    </div>
  );
};
