import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../utils/api';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  Plus, 
  Check, 
  X, 
  AlertCircle,
  Loader2,
  Filter,
  MoreVertical,
  CalendarDays
} from 'lucide-react';

const Appointments = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [doctors, setDoctors] = useState([]); // For patients to pick a doctor
  
  // Form State
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    fetchAppointments();
    if (user.role === 'patient') {
      fetchDoctors();
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors/access-list');
      // Only doctors who have been granted access
      setDoctors(data.filter(d => d.status === 'granted').map(d => d.doctor));
    } catch (error) {
      console.error('Failed to fetch doctors');
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments', formData);
      toast.success('Appointment requested successfully!');
      setShowModal(false);
      setFormData({ doctorId: '', date: '', time: '', reason: '' });
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const statusColors = {
    pending: 'bg-orange-50 text-orange-600 border-orange-100',
    accepted: 'bg-green-50 text-green-600 border-green-100',
    rejected: 'bg-red-50 text-red-600 border-red-100',
    completed: 'bg-blue-50 text-blue-600 border-blue-100',
    cancelled: 'bg-gray-50 text-gray-600 border-gray-100'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <CalendarDays className="w-8 h-8 text-primary-600" />
            Appointments
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage and track your clinical visits.</p>
        </div>
        
        {user.role === 'patient' && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-200 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Book Appointment
          </button>
        )}
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {appointments.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="inline-flex p-6 bg-gray-50 rounded-full text-gray-300">
              <Calendar className="w-12 h-12" />
            </div>
            <p className="text-gray-500 font-bold italic text-lg">No appointments scheduled yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">
                    {user.role === 'patient' ? 'Doctor' : 'Patient'}
                  </th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Schedule</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Reason</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center font-black">
                          {(user.role === 'patient' ? apt.doctor.name : apt.patient.name)[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {user.role === 'patient' ? `Dr. ${apt.doctor.name}` : apt.patient.name}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">
                            {user.role === 'patient' ? apt.doctor.specialization : apt.patient.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(apt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                          <Clock className="w-4 h-4" />
                          {apt.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-sm font-medium text-gray-600 max-w-xs truncate">{apt.reason}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter border ${statusColors[apt.status]}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {user.role === 'doctor' && apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(apt._id, 'accepted')}
                              className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm shadow-green-100"
                              title="Accept"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(apt._id, 'rejected')}
                              className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm shadow-red-100"
                              title="Reject"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {apt.status !== 'cancelled' && apt.status !== 'completed' && apt.status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateStatus(apt._id, 'cancelled')}
                            className="p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-200 hover:text-gray-600 transition-all"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                        {user.role === 'doctor' && apt.status === 'accepted' && (
                          <button
                            onClick={() => handleUpdateStatus(apt._id, 'completed')}
                            className="px-3 py-2 bg-primary-50 text-primary-600 rounded-xl font-bold text-xs hover:bg-primary-600 hover:text-white transition-all shadow-sm shadow-primary-100"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-fade-in-up">
            <div className="bg-primary-600 p-8 text-white">
              <h3 className="text-2xl font-black tracking-tight">Book Appointment</h3>
              <p className="text-primary-100 text-sm font-medium mt-1">Schedule your next clinical visit.</p>
            </div>
            
            <form onSubmit={handleBookAppointment} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Select Doctor</label>
                <select
                  required
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 font-bold text-gray-900 focus:bg-white focus:border-primary-100 outline-none transition-all"
                  value={formData.doctorId}
                  onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                >
                  <option value="">Choose a doctor...</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>Dr. {doc.name} ({doc.specialization})</option>
                  ))}
                </select>
                {doctors.length === 0 && (
                  <p className="mt-2 text-[10px] text-orange-600 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> You need to connect with a doctor first.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 font-bold text-gray-900 focus:bg-white focus:border-primary-100 outline-none transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Time</label>
                  <input
                    type="time"
                    required
                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 font-bold text-gray-900 focus:bg-white focus:border-primary-100 outline-none transition-all"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Reason for Visit</label>
                <textarea
                  required
                  rows="3"
                  className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 font-bold text-gray-900 focus:bg-white focus:border-primary-100 outline-none transition-all resize-none"
                  placeholder="E.g., Routine checkup, fever, prescription renewal..."
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.doctorId}
                  className="flex-[2] bg-primary-600 text-white px-6 py-4 rounded-2xl font-black shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
