import express from 'express';
import cors from 'cors';
import usersRouter from './routes/users.js';
import eventsRoutes from './routes/events.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory 
app.use('/users', usersRouter);
app.use('/events', eventsRoutes);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});