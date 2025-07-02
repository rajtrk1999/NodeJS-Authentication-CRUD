
import express from 'express';
import * as events from '../controllers/eventsController.js';
import { authenticateToken } from '../util/auth.js';
import upload from '../util/upload.js';

const router = express.Router();

// Get all events
router.get('/', events.getAllEventsController);

// Get a single event by ID
router.get('/:id', authenticateToken, events.getEventByIdController);

// Register for an event by ID
router.post('/:id/register', authenticateToken, events.registerForEventController);

// Unregister from an event by ID
router.delete('/:id/unregister', authenticateToken, events.unregisterFromEventController);

// Create a new event
router.post('/', authenticateToken, upload.single('image'), events.createEventController);

// Edit an event by ID
router.put('/:id', authenticateToken, upload.single('image'), events.updateEventController);

// Delete an event by ID
router.delete('/:id', authenticateToken, events.deleteEventController);

export default router;
