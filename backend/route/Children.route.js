import express from 'express';
import {
    getChildren,
    getChild,
    addChild,
    updateChild,
    deleteChild,
    updateVaccination,
    bulkUpdateVaccinations
} from '../Controller/Children.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/')
    .get(getChildren)
    .post(addChild);

router.route('/:id')
    .get(getChild)
    .put(updateChild)
    .delete(deleteChild);

router.put('/:childId/vaccinations/:vaccinationId', updateVaccination);
router.put('/:childId/vaccinations', bulkUpdateVaccinations);

export default router;