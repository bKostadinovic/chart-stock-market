const ctx = document.getElementById('chart').getContext('2d');
const form = document.getElementById('add-form');
const input = document.getElementById('symbol');
const list = document.getElementById('stock-list');

let chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: []
  },
  options: {
    responsive: true,
    parsing: false
  }
});

function updateChart(stockData) {
  chart.data.datasets = Object.entries(stockData).map(([symbol, data]) => ({
    label: symbol,
    data,
    borderWidth: 2
  }));
  chart.update();

  // Update list
  list.innerHTML = '';
  Object.keys(stockData).forEach(symbol => {
    const li = document.createElement('li');
    li.textContent = symbol;
    const btn = document.createElement('button');
    btn.textContent = 'Remove';
    btn.onclick = () => {
      fetch(`/api/stocks/${symbol}`, { method: 'DELETE' });
    };
    li.appendChild(btn);
    list.appendChild(li);
  });
}

form.onsubmit = e => {
  e.preventDefault();
  fetch('/api/stocks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol: input.value.toUpperCase() })
  });
  input.value = '';
};

const socket = io();
socket.on('update', updateChart);
