import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1976d2] text-gray-300 py-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-around">
        <p className="text-lg">&copy; 2024 ShopKart. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-400">Privacy Policy</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-400">Terms of Service</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-400">Contact Us</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
