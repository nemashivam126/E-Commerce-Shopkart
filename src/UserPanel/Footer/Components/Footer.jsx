import React from 'react';
import CustomTheme from '../../../Theme/CustomTheme/CustomTheme';
import { useSelector } from 'react-redux';

const Footer = () => {
  const AppTheme = useSelector((state) => state.theme.theme);
  return (
    // #1976d2
    <footer style={{ backgroundColor: CustomTheme.CustomColor[AppTheme].dark }} className="text-gray-900 py-4">
      <div className="max-w-6xl mx-auto px-4 flex sm:flex-row flex-col items-center justify-around">
        <p className="sm:text-xl text-xs">&copy; 2024 ShopKart. All rights reserved.</p>
        <div className="flex gap-4 sm:text-sm text-xs">
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
