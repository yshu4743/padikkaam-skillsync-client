import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import WorkshopCard from './WorkshopCard';
import { Search, Filter, MapPin } from 'lucide-react';

const CATEGORIES = ['all', 'technology', 'design', 'business', 'language', 'music', 'art', 'cooking', 'fitness', 'photography', 'writing', 'other'];

const DiscoverView = () => {
  const { workshops, fetchWorkshops, selectedWorkshop, setSelectedWorkshop } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [pricingType, setPricingType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  useEffect(() => {
    const filters = {};
    if (category !== 'all') filters.category = category;
    if (pricingType !== 'all') filters.pricingType = pricingType;
    fetchWorkshops(filters);
  }, [category, pricingType, fetchWorkshops]);

  const filtered = workshops.filter((w) =>
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.description.toLowerCase().includes(search.toLowerCase()) ||
    w.host?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedWorkshop) {
    return <WorkshopDetail workshop={selectedWorkshop} onBack={() => setSelectedWorkshop(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search & Filter */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workshops..."
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-primary-100 text-primary-700' : ''}`}
        >
          <Filter size={18} />
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card mb-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    category === c ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Pricing</label>
            <div className="flex gap-2">
              {['all', 'free', 'credit', 'paid'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPricingType(p)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    pricingType === p ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <MapPin size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No workshops found</p>
          </div>
        ) : (
          filtered.map((workshop) => <WorkshopCard key={workshop._id} workshop={workshop} />)
        )}
      </div>
    </div>
  );
};

const WorkshopDetail = ({ workshop, onBack }) => {
  const { user, bookWorkshop } = useApp();
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isBooked = user && workshop.attendees?.some((a) => a._id === user._id);
  const isHost = user && workshop.host?._id === user._id;

  const handleBook = async () => {
    setBooking(true);
    setError('');
    try {
      await bookWorkshop(workshop._id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <button onClick={onBack} className="text-primary-600 text-sm font-medium mb-4 hover:underline">
        Back to workshops
      </button>

      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{workshop.title}</h1>
            <p className="text-gray-500">Hosted by {workshop.host?.name}</p>
          </div>
          <span className={`badge text-sm ${
            workshop.pricingType === 'credit' ? 'bg-amber-100 text-amber-700' :
            workshop.pricingType === 'paid' ? 'bg-emerald-100 text-emerald-700' :
            'bg-indigo-100 text-indigo-700'
          }`}>
            {workshop.pricingType === 'credit' ? `${workshop.priceAmount} Credits` :
             workshop.pricingType === 'paid' ? `₹${(workshop.priceAmount / 100).toFixed(0)}` : 'Free'}
          </span>
        </div>

        <p className="text-gray-700 mb-6">{workshop.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-500">Date & Time</span>
            <p className="font-medium">{formatDate(workshop.scheduledAt)}</p>
          </div>
          <div>
            <span className="text-gray-500">Duration</span>
            <p className="font-medium">{workshop.duration} minutes</p>
          </div>
          <div>
            <span className="text-gray-500">Location</span>
            <p className="font-medium">{workshop.location.venueName || workshop.location.address}</p>
          </div>
          <div>
            <span className="text-gray-500">Capacity</span>
            <p className="font-medium">{workshop.bookedCount}/{workshop.capacity} booked</p>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {user && !isHost && !isBooked && (
          <button onClick={handleBook} disabled={booking} className="btn-primary w-full py-3">
            {booking ? 'Booking...' : 'Book This Workshop'}
          </button>
        )}
        {isBooked && <p className="text-green-600 text-center font-medium">You're booked for this workshop!</p>}
        {isHost && <p className="text-blue-600 text-center font-medium">You are hosting this workshop</p>}
      </div>
    </div>
  );
};

export default DiscoverView;
