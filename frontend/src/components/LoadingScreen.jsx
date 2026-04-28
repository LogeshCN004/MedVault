import React from 'react';
import { ShieldPlus } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer Ring */}
        <div className="w-20 h-20 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin"></div>
        
        {/* Inner Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <ShieldPlus className="w-8 h-8 text-primary-600 animate-pulse" />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">MedVault</h2>
        <div className="flex gap-1 justify-center mt-2">
          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
