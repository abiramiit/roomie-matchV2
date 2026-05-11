const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./utils/db');
const { initSocket } = require('./sockets/socket');

connectDB();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => res.json({ status: 'ok', message: 'RoomieConnect API running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/users',    require('./routes/users'));
app.use('/api/matches',  require('./routes/matches'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/admin',    require('./routes/admin'));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'SET' : 'MISSING'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'MISSING'}`);
});
