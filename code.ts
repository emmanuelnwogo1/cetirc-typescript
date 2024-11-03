import fs from 'fs';
import path from 'path';

const modelName = 'User'; // Change to your model name
const modelFileName = modelName.charAt(0).toLowerCase() + modelName.slice(1);

const crudTemplate = `
import { Router } from 'express';
import { ${modelName} } from '../models/${modelName}';

const router = Router();

// Create
router.post('/', async (req, res) => {
  try {
    const user = await ${modelName}.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read all
router.get('/', async (req, res) => {
  try {
    const users = await ${modelName}.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read one
router.get('/:id', async (req, res) => {
  try {
    const user = await ${modelName}.findByPk(req.params.id);
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
    const [updated] = await ${modelName}.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedUser = await ${modelName}.findByPk(req.params.id);
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
    const deleted = await ${modelName}.destroy({
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
`;

const controllerFilePath = path.join(__dirname, 'controllers', `${modelFileName}.ts`);
const serviceFilePath = path.join(__dirname, 'services', `${modelFileName}.ts`);
const routesFilePath = path.join(__dirname, 'routes', `${modelFileName}.ts`);

// Write the CRUD route file
fs.mkdirSync(path.join(__dirname, 'routes'), { recursive: true });
fs.writeFileSync(routesFilePath, crudTemplate.trim(), { encoding: 'utf8' });
console.log(`CRUD routes generated at: ${routesFilePath}`);
