import React, { useState } from 'react';
import { supabase } from '../services/supabase';

export const DonationForm = () => {
  const [formData, setFormData] = useState({
    donor_name: '',
    email: '',
    amount: '',
    payment_method: 'card',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const paymentMethods = [
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank', label: 'Bank Transfer' }
  ];

  const validateForm = () => {
    if (!formData.donor_name.trim()) {
      setStatus({ type: 'error', message: 'Please enter your name' });
      return false;
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address' });
      return false;
    }
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      setStatus({ type: 'error', message: 'Please enter a valid donation amount' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const { error } = await supabase
        .from('donations')
        .insert([{
          donor_name: formData.donor_name,
          email: formData.email || null,
          amount: Number(formData.amount),
          payment_method: formData.payment_method,
          message: formData.message || null
        }]);

      if (error) throw error;

      setStatus({
        type: 'success',
        message: 'Thank you for your donation. We will process it shortly.'
      });
      setFormData({
        donor_name: '',
        email: '',
        amount: '',
        payment_method: 'card',
        message: ''
      });
    } catch (error) {
      console.error('Error:', error);
      setStatus({
        type: 'error',
        message: 'There was an error processing your donation. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="donation-form-container">
      <h2>Make a Donation</h2>
      <p>Your generous contribution helps honor their memory.</p>

      <form onSubmit={handleSubmit} className="donation-form">
        <div className="form-group">
          <label htmlFor="donor_name">Name *</label>
          <input
            type="text"
            id="donor_name"
            name="donor_name"
            value={formData.donor_name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email (optional)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Donation Amount *</label>
          <div className="amount-input">
            <span>$</span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="1"
              step="1"
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="payment_method">Payment Method *</label>
          <select
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            required
            disabled={loading}
          >
            {paymentMethods.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Message (optional)</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            disabled={loading}
          />
        </div>

        {status.message && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={loading ? 'loading' : ''}
        >
          {loading ? 'Processing...' : 'Submit Donation'}
        </button>
      </form>
    </div>
  );
};
