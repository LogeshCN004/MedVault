import Dependent from '../models/Dependent.js';

// @desc    Get all dependents for a user
// @route   GET /api/dependents
// @access  Private/Patient
export const getDependents = async (req, res) => {
  try {
    const dependents = await Dependent.find({ parentId: req.user._id });
    res.json(dependents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new dependent
// @route   POST /api/dependents
// @access  Private/Patient
export const addDependent = async (req, res) => {
  try {
    const { name, age, relationship, gender } = req.body;

    const dependent = new Dependent({
      parentId: req.user._id,
      name,
      age,
      relationship,
      gender,
    });

    const createdDependent = await dependent.save();
    res.status(201).json(createdDependent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a dependent
// @route   DELETE /api/dependents/:id
// @access  Private/Patient
export const deleteDependent = async (req, res) => {
  try {
    const dependent = await Dependent.findById(req.params.id);

    if (!dependent) {
      return res.status(404).json({ message: 'Dependent not found' });
    }

    if (dependent.parentId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await dependent.deleteOne();
    res.json({ message: 'Dependent removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
