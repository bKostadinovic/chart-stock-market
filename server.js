const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 3000;

// In-memory stock list and dummy data
let stocks = {}; // { symbol: [prices] }

app.use(express.static('public'));
app.use(express.json());

// Mock function to generate prices
function generateMockData(symbol) {
  const prices = Array.from({ length: 20 }, (_, i) => ({
    x: i,
    y: Math.floor(Math.random() * 100 + 20)
  }));
  stocks[symbol] = prices;
}

// Get current stock data
app.get('/api/stocks', (req, res) => {
  res.json(stocks);
});

// Add stock
app.post('/api/stocks', (req, res) => {
  const { symbol } = req.body;
  if (!stocks[symbol]) {
    generateMockData(symbol);
    io.emit('update', stocks);
  }
  res.sendStatus(200);
});

// Remove stock
app.delete('/api/stocks/:symbol', (req, res) => {
  const symbol = req.params.symbol;
  delete stocks[symbol];
  io.emit('update', stocks);
  res.sendStatus(200);
});

// WebSocket connection
io.on('connection', (socket) => {
  socket.emit('update', stocks);
});

server.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
