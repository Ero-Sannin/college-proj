const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customer');
const technicianRoutes = require('./routes/technician');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/technician', technicianRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send({ message: 'Technician Hiring API' }));

// simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;
