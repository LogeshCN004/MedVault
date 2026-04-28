import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import {
  Activity,
  FileText,
  ShieldCheck,
  Clock,
  PlusCircle,
  ArrowRight,
  Stethoscope,
  FlaskConical,
  FileSearch,
  Calendar,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalRecords: 0,
    activeDoctors: 0,
    familyMembers: 0,
    categories: {}
  });
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [recordsRes, doctorsRes, familyRes] = await Promise.all([
          api.get('/records'),
          api.get('/doctors/access-list'),
          api.get('/dependents')
        ]);

        const records = recordsRes.data;
        setAllRecords(records);

        // Group by category
        const categories = records.reduce((acc, rec) => {
          const cat = rec.category || 'other';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

        setStats({
          totalRecords: records.length,
          activeDoctors: doctorsRes.data.filter(d => d.status === 'granted').length,
          familyMembers: familyRes.data.length,
          categories
        });

      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const categoryIcons = {
    'Prescription': <Stethoscope className="w-5 h-5" />,
    'Lab_Result': <FlaskConical className="w-5 h-5" />,
    'Medical_Report': <FileSearch className="w-5 h-5" />,
    'Scan': <Activity className="w-5 h-5" />,
    'other': <FileText className="w-5 h-5" />
  };

  const getCategoryLabel = (cat) => cat.replace('_', ' ');

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Health Summary</h1>
          <p className="text-gray-500 font-medium mt-1">Hello {user.name}, your medical profile is up to date.</p>
        </div>
        <Link
          to="/patient/upload"
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Record
        </Link>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Records', value: stats.totalRecords, icon: FileText, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Active Doctors', value: stats.activeDoctors, icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Family Profiles', value: stats.familyMembers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Latest Update', value: allRecords[0] ? new Date(allRecords[0].createdAt).toLocaleDateString() : 'None', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((item, i) => (
          <div key={i} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 animate-fade-in-up stagger-${i + 1}`}>
            <div className={`${item.bg} ${item.color} p-4 rounded-2xl`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{item.label}</p>
              <p className="text-2xl font-black text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Categories & Insights */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm animate-fade-in-up stagger-2">
            <h2 className="text-xl font-black text-gray-900 mb-6">Record Vault</h2>
            <div className="space-y-4">
              {Object.keys(stats.categories).length === 0 ? (
                <p className="text-gray-400 text-sm italic">No records categorized yet.</p>
              ) : (
                Object.entries(stats.categories).map(([cat, count], i) => (
                  <div key={cat} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-primary-50 transition-colors cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl text-primary-600 shadow-sm group-hover:scale-110 transition-transform">
                        {categoryIcons[cat] || categoryIcons.other}
                      </div>
                      <span className="font-bold text-gray-700 capitalize">{getCategoryLabel(cat)}</span>
                    </div>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-black text-primary-600 shadow-sm">
                      {count}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Link to="/patient/records" className="mt-8 flex items-center justify-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all">
              Manage All Records <ArrowRight className="w-4 h-4" />
            </Link>
          </div>


        </div>

        {/* Right Column: Visual Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-full animate-fade-in-up stagger-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary-600" />
                Medical Timeline
              </h2>
            </div>

            {allRecords.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-400 space-y-4">
                <div className="p-4 bg-gray-50 rounded-full">
                  <Activity className="w-8 h-8" />
                </div>
                <p className="font-medium italic">Your medical journey starts here.</p>
              </div>
            ) : (
              <div className="relative pl-8 border-l-2 border-gray-100 space-y-12">
                {allRecords.slice(0, 5).map((record, i) => (
                  <div key={record._id} className="relative group">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[41px] top-0 w-5 h-5 bg-white border-4 border-primary-600 rounded-full group-hover:scale-125 transition-transform shadow-sm" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black text-primary-600 uppercase tracking-widest">
                            {new Date(record.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span className="text-xs font-bold text-gray-400 capitalize">{getCategoryLabel(record.category)}</span>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 group-hover:text-primary-600 transition-colors">{record.title}</h3>
                        {record.dependentId && (
                          <span className="inline-block mt-2 px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
                            Family Record
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/patient/records?id=${record._id}`}
                        className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-primary-600 hover:text-white transition-all active:scale-95 shadow-sm"
                      >
                        <FileText className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>
                ))}

                {allRecords.length > 5 && (
                  <div className="pt-4">
                    <Link to="/patient/records" className="text-sm font-black text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-2">
                      + {allRecords.length - 5} more events in your history
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
