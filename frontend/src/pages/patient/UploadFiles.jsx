import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Upload, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';

const UploadFiles = () => {
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('prescription');
  const [dependentId, setDependentId] = useState('');
  const [dependents, setDependents] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDependents = async () => {
      try {
        const { data } = await api.get('/dependents');
        setDependents(data);
      } catch (error) {
        console.error('Failed to fetch family members', error);
      }
    };
    fetchDependents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('file', file);
    if (dependentId) {
      formData.append('dependentId', dependentId);
    }

    try {
      await api.post('/records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('File uploaded successfully!');
      navigate('/patient/records');
    } catch (error) {
      console.error('Error uploading record', error);
      toast.error('Failed to upload record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto animate-fade-in-up">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6 text-primary-600" />
        Upload New Record
      </h1>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Whose record is this?</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select 
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm appearance-none bg-white"
                value={dependentId} onChange={(e) => setDependentId(e.target.value)}
              >
                <option value="">Myself</option>
                {dependents.map(dep => (
                  <option key={dep._id} value={dep._id}>{dep.name} ({dep.relationship})</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              type="text" required 
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blood Test Results"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select 
              className="block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              value={category} onChange={(e) => setCategory(e.target.value)}
            >
              <option value="prescription">Prescription</option>
              <option value="lab_report">Lab Report</option>
              <option value="scan">Scan (X-Ray, MRI)</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF/Image)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload a file</span>
                    <input 
                      type="file" 
                      className="sr-only" 
                      required 
                      accept="image/*,application/pdf"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded flex items-center justify-between border border-gray-200">
                {file.name}
                <button type="button" onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
                  <X className="w-4 h-4" />
                </button>
              </p>
            )}
          </div>
          <button 
            type="submit" disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${loading ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors shadow-lg shadow-primary-200`}
          >
            {loading ? 'Uploading...' : 'Upload Record'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadFiles;
