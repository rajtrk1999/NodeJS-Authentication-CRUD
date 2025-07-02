import {

createEvent,
updateEvent,
deleteEvent,
getAllEvents,
getEventById,
registerUserForEvent,
unregisterUserFromEvent
} from '../models/event.js';

// Create a new event
export function createEventController(req, res) {
    try {
        const { title, description, address, date } = req.body;
        const image = req.file ? req.file.filename : null;

        // Helper function to check for non-empty, non-blank strings
        function isValidString(str) {
            return typeof str === 'string' && str.trim().length > 0;
        }

        if (
            !isValidString(title) ||
            !isValidString(description) ||
            !isValidString(address) ||
            !isValidString(date) ||
            !image // Ensure image is provided if required
        ) {
            return res.status(400).json({ error: 'All fields are required and must not be empty or just spaces.' });
        }

        // Optionally, validate date format (e.g., ISO 8601)
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ error: 'Date must be a valid date string.' });
        }

        const result = createEvent({ title: title.trim(), description: description.trim(), address: address.trim(), date: date.trim(), image, userId: req.user.userId });
        res.status(201).json({ id: result.lastInsertRowid, title: title.trim(), description: description.trim(), address: address.trim(), date: date.trim(), image });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create event.' });
    }
}

// Edit (update) an event by ID
export function updateEventController(req, res) {
    try {
        const { id } = req.params;
        const { title, description, address, date } = req.body;
        const image = req.file ? req.file.path : null;

        // Helper function to check for non-empty, non-blank strings
        function isValidString(str) {
            return typeof str === 'string' && str.trim().length > 0;
        }

        if (
            !isValidString(title) ||
            !isValidString(description) ||
            !isValidString(address) ||
            !isValidString(date) ||
            !image // Ensure image is provided if required
        ) {
            return res.status(400).json({ error: 'All fields are required and must not be empty or just spaces.' });
        }

        // Optionally, validate date format (e.g., ISO 8601)
        if (isNaN(Date.parse(date))) {
            return res.status(400).json({ error: 'Date must be a valid date string.' });
        }

        // Check if the event exists and belongs to the current user
        const event = getEventById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        if (event.user_id !== req.user.userId) {
            return res.status(403).json({ error: 'You are not authorized to edit this event.' });
        }

        const imageFilename = req.file ? req.file.filename : event.image;
        const result = updateEvent(id, { 
            title: title.trim(), 
            description: description.trim(), 
            address: address.trim(), 
            date: date.trim(),
            image: imageFilename
        });
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.json({ id, title: title.trim(), description: description.trim(), address: address.trim(), date: date.trim(), image: imageFilename });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update event.' });
    }
}

// Delete an event by ID
export function deleteEventController(req, res) {
    try {
        const { id } = req.params;
        // Check if the event exists and belongs to the current user
        const event = getEventById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        if (event.user_id !== req.user.userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this event.' });
        }
        const result = deleteEvent(id);
        if (result.changes === 0) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        res.json({ message: 'Event deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete event.' });
    }
}

// Get all events
export function getAllEventsController(req, res) {
try {
    const events = getAllEvents();
    res.json(events);
} catch (error) {
    res.status(500).json({ error: 'Failed to fetch events.' });
}
}

// Get a single event by ID
export function getEventByIdController(req, res) {
try {
    const { id } = req.params;
    const event = getEventById(id);
    if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
    }
    res.json(event);
} catch (error) {
    res.status(500).json({ error: 'Failed to fetch event.' });
}
}

// Register for an event by ID
export function registerForEventController(req, res) {
    try {
        const { id } = req.params;
        const event = getEventById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        // Insert registration into the database
        const success = registerUserForEvent(req.user.userId, id);
        if (!success) {
            return res.status(400).json({ error: 'User already registered for this event.' });
        }
        res.json({ message: `User ${req.user.userId} registered for event ${id}.`, registered: true });
        } catch (error) {
        res.status(500).json({ error: 'Failed to register for event.' });
        }
    }

    // Unregister from an event by ID
    export function unregisterFromEventController(req, res) {
        try {
        const { id } = req.params;
        const event = getEventById(id);
        if (!event) {
            return res.status(404).json({ error: 'Event not found.' });
        }
        // Remove the user from the event's registration list in the database
      const success = unregisterUserFromEvent(req.user.userId, id);
        if (!success) {
            return res.status(400).json({ error: 'User was not registered for this event.' });
        }
        res.json({ message: `User ${req.user.userId} unregistered from event ${id}.`, registered: false });
    } catch (error) {
        res.status(500).json({ error: 'Failed to unregister from event.' });
    }
}