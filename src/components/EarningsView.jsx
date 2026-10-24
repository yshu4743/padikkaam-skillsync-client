import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../utils/api';
import { Coins, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

const EarningsView = () => {
  const { user } = useApp();
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get(`/users/${user._id}/earnings`)
        .then(setEarnings)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (loading || !earnings) {
    return <div className="text-center py-12 text-gray-500">Loading earnings...</div>;
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Earnings & Wallet</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-200 rounded-lg flex items-center justify-center">
              <Coins size={20} className="text-amber-700" />
            </div>
            <div>
              <p className="text-sm text-amber-600">Credit Balance</p>
              <p className="text-2xl font-bold text-amber-800">{user?.creditBalance || 0}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-emerald-600">Credits Earned</p>
              <p className="text-2xl font-bold text-emerald-800">{earnings.totalCreditsEarned}</p>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-200 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-primary-700" />
            </div>
            <div>
              <p className="text-sm text-primary-600">Cash Earned</p>
              <p className="text-2xl font-bold text-primary-800">₹{((earnings.totalCashEarned || 0) / 100).toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Settings */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Wallet size={18} />
          Payout Settings
        </h2>
        <p className="text-sm text-gray-500 mb-4">Connect your Stripe account to receive cash payments from paid workshops.</p>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${user?.stripeAccountId ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-600">
            {user?.stripeAccountId ? 'Stripe account connected' : 'No Stripe account connected'}
          </span>
        </div>
        {!user?.stripeAccountId && (
          <button className="btn-primary text-sm mt-3">Connect Stripe</button>
        )}
      </div>

      {/* Transaction History */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Transaction History</h2>
        <div className="space-y-3">
          {earnings.transactions.map((tx) => (
            <div key={tx._id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.type.includes('credit') ? 'bg-amber-100' : 'bg-emerald-100'
                }`}>
                  {tx.type.includes('debit') ? (
                    <ArrowUpRight size={16} className="text-red-500" />
                  ) : (
                    <ArrowDownRight size={16} className="text-green-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                  <p className="text-xs text-gray-400">{formatDate(tx.createdAt)}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${
                tx.type.includes('debit') ? 'text-red-500' : 'text-green-500'
              }`}>
                {tx.type.includes('debit') ? '-' : '+'}
                {tx.type.includes('credit') && !tx.type.includes('payment') ? `${tx.amount} credits` : `₹${(tx.amount / 100).toFixed(0)}`}
              </span>
            </div>
          ))}
          {earnings.transactions.length === 0 && (
            <p className="text-center text-gray-500 py-8">No transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningsView;
