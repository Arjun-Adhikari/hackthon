import express from 'express'
const router = express.Router();
import { getChildren, addChildren } from '../Controller/Children.controller.js';

router.get('/get',getChildren)
router.post('/add',addChildren)

export default router;
