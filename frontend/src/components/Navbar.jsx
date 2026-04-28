import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Menu, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        {user && (
          <button
            onClick={onMenuClick}
            className="text-gray-500 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-xl transition-all mr-4"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          MedVault
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <UserIcon className="w-4 h-4 text-primary-600" />
              <span className="hidden sm:inline">{user.name}</span>
              <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs ml-1 capitalize">
                {user.role}
              </span>
            </div>
            
            <button
              onClick={() => logout()}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group relative"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
