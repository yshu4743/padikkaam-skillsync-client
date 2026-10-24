import React, { useState } from 'react';
import { X, Coins, DollarSign, MapPin, Calendar, Users, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CATEGORIES = ['technology', 'design', 'business', 'language', 'music', 'art', 'cooking', 'fitness', 'photography', 'writing', 'other'];
const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'all-levels'];

const CreateWorkshopModal = () => {
  const { setShowCreateModal, createWorkshop, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'technology',
    skillLevel: 'all-levels',
    pricingType: 'credit',
    priceAmount: 1,
    address: '',
    venueName: '',
    scheduledAt: '',
    duration: 60,
    capacity: 10,
    lat: '',
    lng: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePricingToggle = (type) => {
    setForm((prev) => ({
      ...prev,
      pricingType: type,
      priceAmount: type === 'free' ? 0 : type === 'credit' ? 1 : 1000,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Use default coordinates if not provided (geocoding would be added in production)
      const lat = parseFloat(form.lat) || 28.6139;
      const lng = parseFloat(form.lng) || 77.209;

      await createWorkshop({
        ...form,
        location: {
          type: 'Point',
          coordinates: [lng, lat],
          address: form.address,
          venueName: form.venueName,
        },
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        duration: parseInt(form.duration),
        capacity: parseInt(form.capacity),
        priceAmount: parseInt(form.priceAmount),
      });

      setShowCreateModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Create Workshop</h2>
          <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Workshop Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g., React Fundamentals"
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input min-h-[80px]"
              placeholder="What will participants learn?"
              maxLength={1000}
            />
          </div>

          {/* Category & Skill Level */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="input">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
              <select name="skillLevel" value={form.skillLevel} onChange={handleChange} className="input">
                {SKILL_LEVELS.map((s) => (
                  <option key={s} value={s}>{s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePricingToggle('credit')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.pricingType === 'credit'
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Coins size={16} />
                Credit
              </button>
              <button
                type="button"
                onClick={() => handlePricingToggle('paid')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.pricingType === 'paid'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <DollarSign size={16} />
                Paid
              </button>
              <button
                type="button"
                onClick={() => handlePricingToggle('free')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                  form.pricingType === 'free'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Free
              </button>
            </div>
          </div>

          {/* Price Amount */}
          {form.pricingType !== 'free' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.pricingType === 'credit' ? 'Credits per person' : 'Price in paise (₹1 = 100)'}
              </label>
              <input
                type="number"
                name="priceAmount"
                value={form.priceAmount}
                onChange={handleChange}
                className="input"
                min={form.pricingType === 'credit' ? 1 : 100}
                required
              />
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin size={14} className="inline mr-1" />
              Venue Name
            </label>
            <input
              type="text"
              name="venueName"
              value={form.venueName}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Cafe Coffee Day"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input"
              placeholder="Full address"
              required
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Calendar size={14} className="inline mr-1" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="scheduledAt"
              value={form.scheduledAt}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Duration & Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock size={14} className="inline mr-1" />
                Duration (min)
              </label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="input"
                min={15}
                max={480}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users size={14} className="inline mr-1" />
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={form.capacity}
                onChange={handleChange}
                className="input"
                min={1}
                max={500}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? 'Creating...' : 'Create Workshop'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkshopModal;
