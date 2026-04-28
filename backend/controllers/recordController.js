import Record from '../models/Record.js';
import cloudinary from '../config/cloudinary.js';

// Helper function to upload buffer to cloudinary
const streamUpload = (fileBuffer, options = { resource_type: 'auto' }) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    stream.end(fileBuffer);
  });
};

// @desc    Upload a new record
// @route   POST /api/records
// @access  Private/Patient
export const uploadRecord = async (req, res) => {
  try {
    const { title, category, dependentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const options = { resource_type: 'auto' };
    if (req.file.mimetype === 'application/pdf') {
      options.resource_type = 'raw';
      options.public_id = `doc_${Date.now()}.pdf`;
    }

    const result = await streamUpload(req.file.buffer, options);

    const record = new Record({
      patient: req.user._id,
      dependent: dependentId || undefined,
      title,
      category: category || 'other',
      fileUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    const createdRecord = await record.save();
    res.status(201).json(createdRecord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient's records
// @route   GET /api/records
// @access  Private/Patient
export const getMyRecords = async (req, res) => {
  try {
    const records = await Record.find({ patient: req.user._id })
      .populate('dependent', 'name relationship')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a record
// @route   DELETE /api/records/:id
// @access  Private/Patient
export const deleteRecord = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    // Verify it belongs to the user
    if (record.patient.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete from Cloudinary
    const resourceType = record.fileUrl.includes('/raw/upload/') ? 'raw' : 'image';
    await cloudinary.uploader.destroy(record.cloudinaryId, { resource_type: resourceType });

    // Delete from DB
    await record.deleteOne();

    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
