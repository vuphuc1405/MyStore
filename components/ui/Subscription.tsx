import React from 'react';

const Subscription = () => {
  return (
    <section className="bg-gradient-to-r from-blue-100 via-white to-blue-100 py-12">
      <div className="max-w-xl mx-auto text-center">
        <h3 className="text-2xl font-bold text-blue-700 mb-4">Subscribe for Latest Phone Deals & Updates</h3>
        <p className="text-gray-600 mb-4">Get exclusive offers, new arrivals, and special discounts directly to your inbox!</p>
        <form className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <input
            type="email"
            placeholder="Your email address"
            className="rounded-full px-5 py-3 border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-3 font-semibold shadow transition"
          >
            Get Updates
          </button>
        </form>
      </div>
    </section>
  );
};

export default Subscription;