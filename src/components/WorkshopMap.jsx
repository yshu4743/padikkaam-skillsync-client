import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { Clock, Users, MapPin, Coins, DollarSign } from 'lucide-react';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom marker icons based on pricing type
const createCustomIcon = (pricingType) => {
  const colors = {
    credit: '#f59e0b',
    paid: '#10b981',
    free: '#6366f1',
  };
  const color = colors[pricingType] || '#6b7280';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">
      ${pricingType === 'credit' ? 'C' : pricingType === 'paid' ? '$' : 'F'}
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const WorkshopMap = () => {
  const { workshops, setSelectedWorkshop, setView } = useApp();
  const [mapCenter] = useState([20.5937, 78.9629]); // Center of India
  const [mapZoom] = useState(5);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriceTag = (workshop) => {
    if (workshop.pricingType === 'credit') return `${workshop.priceAmount} Credit${workshop.priceAmount > 1 ? 's' : ''}`;
    if (workshop.pricingType === 'paid') return `₹${(workshop.priceAmount / 100).toFixed(0)}`;
    return 'Free';
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full relative">
      <MapContainer center={mapCenter} zoom={mapZoom} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} zoom={mapZoom} />

        {workshops.map((workshop) => (
          <Marker
            key={workshop._id}
            position={[workshop.location.coordinates[1], workshop.location.coordinates[0]]}
            icon={createCustomIcon(workshop.pricingType)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-semibold text-sm mb-1">{workshop.title}</h3>
                <p className="text-xs text-gray-500 mb-2">{workshop.host?.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Clock size={12} />
                  {formatDate(workshop.scheduledAt)}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <Users size={12} />
                  {workshop.bookedCount}/{workshop.capacity} spots
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                  <MapPin size={12} />
                  {workshop.location.venueName || workshop.location.address}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`badge ${
                    workshop.pricingType === 'credit' ? 'bg-amber-100 text-amber-700' :
                    workshop.pricingType === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {workshop.pricingType === 'credit' && <Coins size={10} className="mr-1" />}
                    {workshop.pricingType === 'paid' && <DollarSign size={10} className="mr-1" />}
                    {getPriceTag(workshop)}
                  </span>
                  <button
                    onClick={() => { setSelectedWorkshop(workshop); setView('discover'); }}
                    className="text-primary-600 text-xs font-medium hover:underline"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <p className="text-xs font-semibold text-gray-700 mb-2">Price Legend</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Credit-based</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Paid (₹)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span>Free</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkshopMap;
