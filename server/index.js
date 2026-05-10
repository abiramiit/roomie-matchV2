const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const { initSocket } = require('./sockets/socket');

dotenv.config();
console.log('ENV CHECK → MONGO_URI:', process.env.MONGO_URI ? 'SET ✅' : 'MISSING ❌');
console.log('ENV CHECK → JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✅' : 'MISSING ❌');
console.log('ENV CHECK → PORT:', process.env.PORT || '5000 (default)');
connectDB();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({
  origin: process.env.CLIENT_URL === '*' || !process.env.CLIENT_URL
    ? '*'
    : process.env.CLIENT_URL.split(','),
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => res.json({
  status: 'ok',
  message: 'RoomieConnect API is running ✅',
  endpoints: {
    auth: '/api/auth/register [POST], /api/auth/login [POST], /api/auth/me [GET]',
    users: '/api/users [GET], /api/users/:id [GET]',
    matches: '/api/matches [GET], /api/matches/like/:id [POST]',
    listings: '/api/listings [GET], /api/listings/:id [GET]',
  }
}));

app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/listings', require('./routes/listings'));
app.use('/api/admin', require('./routes/admin'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
