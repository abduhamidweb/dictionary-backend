import express from 'express';
import unitController from '../controllers/unit.contr.js';

const router = express.Router();

router.post('/', unitController.createUnit.bind(unitController));
router.get('/', unitController.getAllUnits.bind(unitController));
router.get('/:id', unitController.getUnitById.bind(unitController));
router.put('/:id', unitController.updateUnit.bind(unitController));
router.delete('/:id', unitController.deleteUnit.bind(unitController));

export default router;
