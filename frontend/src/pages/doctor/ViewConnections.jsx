import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { Users, FileText, Activity, MessageSquare, Send } from 'lucide-react';

const ViewConnections = () => {
  const { user } = useContext(AuthContext);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/doctors/patients');
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients', error);
    }
  };

  const fetchPatientRecords = async (patientId) => {
    setLoadingRecords(true);
    try {
      const { data } = await api.get(`/doctors/patients/${patientId}/records`);
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch patient records', error);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setRecords([]);
    setSelectedRecordId(null);
    fetchPatientRecords(patient._id);
  };

  const handleAddNote = async (recordId) => {
    if (!noteContent) return;
    try {
      await api.post(`/doctors/records/${recordId}/notes`, { content: noteContent });
      setNoteContent('');
      setSelectedRecordId(null);
      fetchPatientRecords(selectedPatient._id);
      alert('Note added successfully!');
    } catch (error) {
      console.error('Failed to add note', error);
      alert('Failed to add note');
    }
  };

  return (
    <div className="p-4 sm:p-8 h-[calc(100vh-4rem)] flex flex-col max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-primary-600" />
          Patient Connections
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden">
        {/* Patients List Sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              Accessible Patients ({patients.length})
            </h2>
          </div>
          <div className="flex-grow overflow-y-auto p-3 space-y-1">
            {patients.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center mt-6">No patients have granted you access yet.</p>
            ) : (
              patients.map(access => (
                <button
                  key={access.patient._id}
                  onClick={() => handlePatientSelect(access.patient)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center gap-3 ${
                    selectedPatient?._id === access.patient._id 
                      ? 'bg-primary-50 border border-primary-200' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${selectedPatient?._id === access.patient._id ? 'bg-primary-600' : 'bg-gray-400'}`}>
                    {access.patient.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{access.patient.name}</p>
                    <p className="text-xs text-gray-500 truncate">{access.patient.email}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Patient Records Area */}
        <div className="w-full md:w-2/3 lg:w-3/4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          {selectedPatient ? (
            <>
              <div className="p-5 border-b border-gray-100 bg-white shadow-sm z-10 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedPatient.name}'s Records</h2>
                  <p className="text-sm text-gray-500">{selectedPatient.email}</p>
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4 sm:p-6 bg-gray-50">
                {loadingRecords ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : records.length === 0 ? (
                  <div className="text-center bg-white p-10 rounded-xl border border-dashed border-gray-300 mt-10">
                    <Activity className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No records found for this patient.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {records.map(record => (
                      <div key={record._id} className="border border-gray-200 rounded-xl p-5 sm:p-6 bg-white shadow-sm">
                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4 border-b border-gray-100 pb-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-primary-50 p-3 rounded-lg hidden sm:block">
                              <FileText className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg mb-1">{record.title}</h3>
                              <div className="flex gap-2 items-center">
                                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md capitalize font-medium">{record.category.replace('_', ' ')}</span>
                                <span className="text-xs text-gray-400">&bull; {new Date(record.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <a 
                            href={record.fileUrl} target="_blank" rel="noopener noreferrer"
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
                          >
                            View Document
                          </a>
                        </div>

                        {/* Notes Section */}
                        <div className="mt-4 bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-100">
                          <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary-500" /> Clinical Notes
                          </h4>
                          
                          {record.notes && record.notes.length > 0 ? (
                            <div className="space-y-3 mb-4">
                              {record.notes.map((note, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 text-sm shadow-sm">
                                  <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
                                  <p className="text-xs text-gray-400 mt-2 text-right font-medium">
                                    {new Date(note.date).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 italic mb-4">No notes have been added to this record yet.</p>
                          )}

                          {selectedRecordId === record._id ? (
                            <div className="mt-4 flex flex-col sm:flex-row gap-2">
                              <input
                                type="text"
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-primary-500 focus:border-primary-500 bg-white"
                                placeholder="Add a clinical note or diagnosis..."
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && handleAddNote(record._id)}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddNote(record._id)}
                                  className="flex-grow sm:flex-grow-0 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 font-medium transition-colors"
                                >
                                  <Send className="w-4 h-4" /> Save
                                </button>
                                <button
                                  onClick={() => { setSelectedRecordId(null); setNoteContent(''); }}
                                  className="flex-grow sm:flex-grow-0 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedRecordId(record._id)}
                              className="text-sm text-primary-600 hover:text-primary-800 font-medium inline-flex items-center gap-1 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100 transition-colors"
                            >
                              + Add Clinical Note
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-gray-400 p-6 text-center bg-gray-50">
              <div>
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Patient Selected</h3>
                <p>Select a patient from the sidebar to view their medical records.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewConnections;
