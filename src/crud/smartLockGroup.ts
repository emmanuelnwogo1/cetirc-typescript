import { Router } from 'express';
import { SmartLockGroup } from '../models/SmartLockGroup';

const router = Router();

// Create
router.post('/', async (req, res) => {
  try {
    const user = await SmartLockGroup.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const users = await SmartLockGroup.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const user = await SmartLockGroup.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await SmartLockGroup.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedUser = await SmartLockGroup.findByPk(req.params.id);
      return res.json(updatedUser);
    }
    throw new Error('User not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await SmartLockGroup.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res.status(204).send();
    }
    throw new Error('User not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;