import React from 'react';
import { Bell } from 'lucide-react';

const Notifications = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Bell className="w-6 h-6 text-primary-600" />
        Notifications
      </h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        <Bell className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <p className="text-lg font-medium text-gray-700">No new notifications</p>
        <p className="text-sm mt-2">You're all caught up!</p>
      </div>
    </div>
  );
};

export default Notifications;
