import Access from '../models/Access.js';
import User from '../models/User.js';
import Record from '../models/Record.js';

// @desc    Get doctor details by public Doctor ID
// @route   GET /api/doctors/public/:publicId
// @access  Public
export const getDoctorByPublicId = async (req, res) => {
  try {
    const doctor = await User.findOne({ doctorId: req.params.publicId, role: 'doctor' }).select('name specialization doctorId');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grant access using public Doctor ID
// @route   POST /api/doctors/grant-public
// @access  Private/Patient
export const grantAccessByPublicId = async (req, res) => {
  try {
    const { publicId } = req.body;
    const doctor = await User.findOne({ doctorId: publicId, role: 'doctor' });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const access = await Access.findOneAndUpdate(
      { patient: req.user._id, doctor: doctor._id },
      { status: 'granted' },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: `Access granted to Dr. ${doctor.name}`, access });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Grant access to a doctor
// @route   POST /api/doctors/grant
// @access  Private/Patient
export const grantAccess = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const access = await Access.findOneAndUpdate(
      { patient: req.user._id, doctor: doctorId },
      { status: 'granted' },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Access granted successfully', access });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Revoke access from a doctor
// @route   POST /api/doctors/revoke
// @access  Private/Patient
export const revokeAccess = async (req, res) => {
  try {
    const { doctorId } = req.body;

    await Access.findOneAndUpdate(
      { patient: req.user._id, doctor: doctorId },
      { status: 'revoked' },
      { new: true }
    );

    res.status(200).json({ message: 'Access revoked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get list of doctors user has granted access to
// @route   GET /api/doctors/access-list
// @access  Private/Patient
export const getMyDoctors = async (req, res) => {
  try {
    const accessList = await Access.find({ patient: req.user._id })
      .populate('doctor', 'name email specialization');
    res.json(accessList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search doctors by id or email
// @route   GET /api/doctors/search?query=...
// @access  Private/Patient
export const searchDoctors = async (req, res) => {
  try {
    const queryStr = req.query.query;
    
    if (!queryStr) {
      const doctors = await User.find({ role: 'doctor' }).select('-password');
      return res.json(doctors);
    }

    const orConditions = [
      { email: { $regex: queryStr, $options: 'i' } },
      { name: { $regex: queryStr, $options: 'i' } },
    ];

    // Check if the query is a valid 24-character hex string (MongoDB ObjectId)
    if (/^[0-9a-fA-F]{24}$/.test(queryStr)) {
      orConditions.push({ _id: queryStr });
    }

    const keyword = {
      role: 'doctor',
      $or: orConditions,
    };

    const doctors = await User.find(keyword).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Doctor: Get accessible patients
// @route   GET /api/doctors/patients
// @access  Private/Doctor
export const getAccessiblePatients = async (req, res) => {
  try {
    const accessList = await Access.find({ doctor: req.user._id, status: 'granted' })
      .populate('patient', 'name email');
    res.json(accessList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Doctor: Get patient's records
// @route   GET /api/doctors/patients/:patientId/records
// @access  Private/Doctor
export const getPatientRecords = async (req, res) => {
  try {
    const { patientId } = req.params;

    const access = await Access.findOne({ doctor: req.user._id, patient: patientId, status: 'granted' });
    if (!access) {
      return res.status(403).json({ message: 'Access denied to this patient\'s records' });
    }

    const records = await Record.find({ patient: patientId }).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Doctor: Add note to a record
// @route   POST /api/doctors/records/:recordId/notes
// @access  Private/Doctor
export const addNoteToRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { content } = req.body;

    const record = await Record.findById(recordId);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const access = await Access.findOne({ doctor: req.user._id, patient: record.patient, status: 'granted' });
    if (!access) {
      return res.status(403).json({ message: 'Access denied' });
    }

    record.notes.push({
      doctor: req.user._id,
      content
    });

    await record.save();
    res.json({ message: 'Note added successfully', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
