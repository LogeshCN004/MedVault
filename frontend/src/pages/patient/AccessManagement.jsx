import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ShieldCheck, Search, ShieldAlert } from 'lucide-react';

const AccessManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors/access-list');
      setDoctors(data);
    } catch (error) {
      console.error('Failed to fetch doctors', error);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearchDoctors = async () => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }
    try {
      const { data } = await api.get(`/doctors/search?query=${searchQuery}`);
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to search doctors', error);
    }
  };

  const handleGrantAccess = async (doctorId) => {
    try {
      await api.post('/doctors/grant', { doctorId });
      alert('Access granted!');
      setSearchQuery('');
      setSearchResults([]);
      fetchDoctors();
    } catch (error) {
      alert('Failed to grant access');
    }
  };

  const handleRevokeAccess = async (doctorId) => {
    try {
      await api.post('/doctors/revoke', { doctorId });
      alert('Access revoked!');
      fetchDoctors();
    } catch (error) {
      alert('Failed to revoke access');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <ShieldCheck className="w-6 h-6 text-primary-600" />
        Access Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Search and Grant Access */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary-500" />
            Find a Doctor
          </h2>
          <div className="mb-4 flex gap-2">
            <input 
              type="text" 
              placeholder="Doctor's name or email" 
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchDoctors()}
            />
            <button 
              onClick={handleSearchDoctors}
              className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 text-gray-700 font-medium border border-gray-300 transition-colors"
            >
              Search
            </button>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
              {searchResults.map(doc => (
                <div key={doc._id} className="p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">{doc.name}</p>
                    <p className="text-gray-500 text-sm">{doc.specialization}</p>
                  </div>
                  <button 
                    onClick={() => handleGrantAccess(doc._id)}
                    className="text-sm font-medium bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200 transition-colors shadow-sm"
                  >
                    Grant Access
                  </button>
                </div>
              ))}
            </div>
          ) : searchQuery && (
            <p className="text-sm text-gray-500 italic mt-4 text-center">Press search to find doctors.</p>
          )}
        </div>

        {/* Granted Access List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-green-500" />
            Active Authorizations
          </h2>
          
          {doctors.filter(d => d.status === 'granted').length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <ShieldCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No doctors have access to your records.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.filter(d => d.status === 'granted').map(access => (
                <div key={access._id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{access.doctor?.name || 'Unknown Doctor'}</p>
                      <p className="text-xs text-gray-500">{access.doctor?.specialization}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRevokeAccess(access.doctor._id)}
                    className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors border border-red-100"
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessManagement;
