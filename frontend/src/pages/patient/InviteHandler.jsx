import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../utils/api';
import { UserPlus, ShieldCheck, ArrowRight, User as UserIcon, Loader2 } from 'lucide-react';

const InviteHandler = () => {
  const { publicId } = useParams();
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [granting, setGranting] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const { data } = await api.get(`/doctors/public/${publicId}`);
        setDoctor(data);
      } catch (error) {
        toast.error('Invalid or expired invitation link');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [publicId, navigate, toast]);

  const handleGrantAccess = async () => {
    if (!user) {
      // Save intent and redirect to login
      localStorage.setItem('pendingInvite', publicId);
      navigate('/login');
      return;
    }

    if (user.role !== 'patient') {
      toast.error('Only patient accounts can grant access to records');
      return;
    }

    setGranting(true);
    try {
      await api.post('/doctors/grant-public', { publicId });
      toast.success(`Access granted to Dr. ${doctor.name}!`);
      navigate('/patient/access');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to grant access');
    } finally {
      setGranting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 text-primary-600 rounded-2xl mb-6 shadow-inner">
            <UserPlus className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Invitation to Connect</h2>
          <p className="text-gray-500 font-medium leading-relaxed">
            A doctor has invited you to share your medical records for better clinical care.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Doctor Details</p>
              <h3 className="text-xl font-bold text-gray-900">Dr. {doctor?.name}</h3>
              <p className="text-primary-600 font-semibold">{doctor?.specialization}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>Verified MedVault Professional</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGrantAccess}
            disabled={granting}
            className="w-full flex items-center justify-center gap-3 bg-primary-600 text-white py-4 px-6 rounded-2xl font-black text-lg hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all active:scale-95 disabled:opacity-50 btn-hover-effect"
          >
            {granting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : user ? (
              <>Grant Secure Access <ArrowRight className="w-5 h-5" /></>
            ) : (
              <>Login to Grant Access <ArrowRight className="w-5 h-5" /></>
            )}
          </button>
          
          <Link
            to="/"
            className="w-full block text-center py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Not now, take me home
          </Link>
        </div>

        {!user && (
          <p className="mt-8 text-center text-xs text-gray-400 leading-relaxed italic">
            * You need a MedVault patient account to share records securely. By clicking login, you'll be guided to sign in or create one.
          </p>
        )}
      </div>
    </div>
  );
};

export default InviteHandler;
