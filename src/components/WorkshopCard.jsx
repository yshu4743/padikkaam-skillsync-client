import React from 'react';
import { Clock, Users, MapPin, Coins, DollarSign, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';

const WorkshopCard = ({ workshop }) => {
  const { setSelectedWorkshop, user, bookWorkshop } = useApp();
  const [booking, setBooking] = React.useState(false);
  const [error, setError] = React.useState('');

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriceTag = () => {
    if (workshop.pricingType === 'credit') return `${workshop.priceAmount} Credit${workshop.priceAmount > 1 ? 's' : ''}`;
    if (workshop.pricingType === 'paid') return `₹${(workshop.priceAmount / 100).toFixed(0)}`;
    return 'Free';
  };

  const isBooked = user && workshop.attendees?.some((a) => a._id === user._id);
  const isHost = user && workshop.host?._id === user._id;
  const spotsLeft = workshop.capacity - workshop.bookedCount;

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
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{workshop.title}</h3>
          <p className="text-sm text-gray-500">by {workshop.host?.name}</p>
        </div>
        <span className={`badge ${
          workshop.pricingType === 'credit' ? 'bg-amber-100 text-amber-700' :
          workshop.pricingType === 'paid' ? 'bg-emerald-100 text-emerald-700' :
          'bg-indigo-100 text-indigo-700'
        }`}>
          {workshop.pricingType === 'credit' && <Coins size={10} className="mr-1" />}
          {workshop.pricingType === 'paid' && <DollarSign size={10} className="mr-1" />}
          {getPriceTag()}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{workshop.description}</p>

      <div className="space-y-1.5 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <Clock size={14} />
          {formatDate(workshop.scheduledAt)} ({workshop.duration} min)
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          {workshop.location.venueName || workshop.location.address}
        </div>
        <div className="flex items-center gap-2">
          <Users size={14} />
          {workshop.bookedCount}/{workshop.capacity} booked
          {spotsLeft <= 3 && spotsLeft > 0 && (
            <span className="text-orange-500 text-xs font-medium">({spotsLeft} left!)</span>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}

      <div className="flex items-center justify-between">
        <span className="badge bg-gray-100 text-gray-600">
          {workshop.skillLevel.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedWorkshop(workshop)}
            className="text-primary-600 text-sm font-medium hover:underline"
          >
            Details
          </button>
          {user && !isHost && !isBooked && workshop.status === 'upcoming' && (
            <button
              onClick={handleBook}
              disabled={booking || spotsLeft === 0}
              className="btn-primary text-sm py-1.5 px-3"
            >
              {booking ? 'Booking...' : spotsLeft === 0 ? 'Full' : 'Book'}
            </button>
          )}
          {isBooked && <span className="badge bg-green-100 text-green-700">Booked</span>}
          {isHost && <span className="badge bg-blue-100 text-blue-700">Hosting</span>}
        </div>
      </div>
    </div>
  );
};

export default WorkshopCard;
