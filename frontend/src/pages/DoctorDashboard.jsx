import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { 
  Users, 
  ShieldCheck, 
  Copy, 
  CheckCircle, 
  Share2, 
  MessageCircle, 
  Mail, 
  Search, 
  ExternalLink,
  Activity,
  Calendar,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, recentlyActive: 0 });
  const [copied, setCopied] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  const inviteLink = `${window.location.origin}/invite/${user.doctorId}`;

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await api.get('/doctors/patients');
        setPatients(data);
        setStats({
          total: data.length,
          recentlyActive: data.filter(p => {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            return new Date(p.createdAt) > lastWeek;
          }).length
        });
      } catch (error) {
        console.error('Failed to fetch patients', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.doctorId);
    setCopied(true);
    toast.success('Doctor ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast.success('Invitation link copied!');
  };

  const filteredPatients = patients.filter(p => 
    p.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* Header & Invite Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Clinical Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome, Dr. {user.name}. You have {stats.total} connected patients.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="flex-1 xl:flex-initial bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Your Doctor ID</p>
              <p className="font-mono text-base font-bold text-gray-800 tracking-tighter">{user.doctorId || 'DOC-XXXXX'}</p>
            </div>
            <button 
              onClick={handleCopyId}
              className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-gray-50 text-gray-500 hover:bg-primary-50 hover:text-primary-600'}`}
            >
              {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          <div className="relative group flex-1 xl:flex-initial">
            <button 
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="w-full bg-primary-600 text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95"
            >
              <Share2 className="w-5 h-5" />
              Invite Patient
            </button>

            {showShareOptions && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-4">
                <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-700 font-medium">
                  <Copy className="w-4 h-4" /> Copy Link
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(inviteLink)}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-green-700 font-medium">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a href={`mailto:?subject=Connect&body=${encodeURIComponent(inviteLink)}`} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 text-blue-700 font-medium">
                  <Mail className="w-4 h-4" /> Email
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Patients', value: stats.total, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
          { label: 'Recently Connected', value: stats.recentlyActive, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Clinical Specialization', value: user.specialization, icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((item, i) => (
          <div key={i} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 animate-fade-in-up stagger-${i+1}`}>
            <div className={`${item.bg} ${item.color} p-4 rounded-2xl`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{item.label}</p>
              <p className="text-xl font-black text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Management Area */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up stagger-2">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-black text-gray-900">Patient Directory</h2>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-100 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="p-8">
          {filteredPatients.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <div className="inline-flex p-6 bg-gray-50 rounded-full text-gray-300">
                <Users className="w-12 h-12" />
              </div>
              <p className="text-gray-500 font-bold italic">No patients found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPatients.map((connection, i) => (
                <div key={connection._id} className="group bg-gray-50/50 hover:bg-white p-6 rounded-3xl border border-transparent hover:border-primary-100 hover:shadow-xl hover:shadow-primary-100/20 transition-all duration-300">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-sm font-black text-xl border border-gray-100 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      {connection.patient.name[0]}
                    </div>
                    <Link 
                      to={`/doctor/connections?patientId=${connection.patient._id}`}
                      className="p-2.5 bg-white rounded-xl text-gray-400 hover:text-primary-600 shadow-sm active:scale-95 transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </Link>
                  </div>
                  
                  <h3 className="text-lg font-black text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {connection.patient.name}
                  </h3>
                  <p className="text-sm text-gray-400 font-medium mb-4 truncate">{connection.patient.email}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-bold">
                      <Calendar className="w-3.5 h-3.5" />
                      Since {new Date(connection.createdAt).toLocaleDateString()}
                    </div>
                    <Link 
                      to={`/doctor/connections?patientId=${connection.patient._id}`}
                      className="flex items-center gap-1 text-xs font-black text-primary-600 uppercase tracking-widest hover:gap-2 transition-all"
                    >
                      Review <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
