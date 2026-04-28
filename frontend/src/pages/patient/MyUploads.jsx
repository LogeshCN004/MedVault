import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Files, FileText, Trash2, User, Filter } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const MyUploads = () => {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterId, setFilterId] = useState('all');

  const fetchRecords = async () => {
    try {
      const { data } = await api.get('/records');
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch records', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    const fetchDependents = async () => {
      try {
        const { data } = await api.get('/dependents');
        setDependents(data);
      } catch (error) {
        console.error('Failed to fetch dependents', error);
      }
    };
    fetchDependents();
  }, []);

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/records/${id}`);
        toast.success('Record deleted successfully');
        fetchRecords();
      } catch (error) {
        toast.error('Failed to delete record');
      }
    }
  };

  const filteredRecords = records.filter(record => {
    if (filterId === 'all') return true;
    if (filterId === 'myself') return !record.dependent;
    return record.dependent?._id === filterId;
  });

  return (
    <div className="p-4 sm:p-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Files className="w-8 h-8 text-primary-600" />
          My Uploads
        </h1>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              className="text-sm font-medium text-gray-700 bg-transparent outline-none cursor-pointer"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
            >
              <option value="all">All Profiles</option>
              <option value="myself">Myself</option>
              {dependents.map(dep => (
                <option key={dep._id} value={dep._id}>{dep.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No medical records found for this profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record, index) => (
            <div 
              key={record._id} 
              className={`bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full animate-fade-in-up stagger-${(index % 4) + 1}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary-50 p-3 rounded-2xl">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 truncate pr-2" title={record.title}>{record.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize font-bold tracking-tight">
                        {record.category.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-bold tracking-tight flex items-center gap-1">
                        <User className="w-2.5 h-2.5" />
                        {record.dependent ? record.dependent.name : 'Myself'}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteRecord(record._id)}
                  className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                  title="Delete Record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-auto flex justify-between items-center text-sm pt-4 border-t border-gray-50">
                <span className="text-gray-400 font-medium">{new Date(record.createdAt).toLocaleDateString()}</span>
                <a 
                  href={record.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-primary-600 text-white px-5 py-2 rounded-xl hover:bg-primary-700 transition-all font-bold text-xs shadow-lg shadow-primary-100 active:scale-95"
                >
                  View File
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploads;
