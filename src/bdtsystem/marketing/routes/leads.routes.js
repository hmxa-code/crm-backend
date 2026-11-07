import express from 'express';
import leadsController from '../controllers/leads.controller.js';

const router = express.Router();

router.get('/', (req, res, next) => leadsController.getLeads(req, res, next));
router.get('/:id', (req, res, next) => leadsController.getLeadById(req, res, next));
router.post('/', (req, res, next) => leadsController.createLead(req, res, next));
router.put('/:id', (req, res, next) => leadsController.updateLead(req, res, next));
router.delete('/:id', (req, res, next) => leadsController.deleteLead(req, res, next));

router.post('/bulk/status', (req, res, next) => leadsController.bulkUpdateStatus(req, res, next));
router.post('/bulk/delete', (req, res, next) => leadsController.bulkDelete(req, res, next));

export default router;