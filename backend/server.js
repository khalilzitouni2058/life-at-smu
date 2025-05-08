const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const clubRoutes = require("./routes/clubRoutes");
app.use("/api", clubRoutes);

const statsRoutes = require("./routes/statsRoutes");
app.use("/api/stats", statsRoutes);

const studentLifeRoutes = require('./routes/studentLifeMebersRoutes');
app.use('/api', studentLifeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
