let sipChart = null;

function calculateSIP() {
  // Get input values
  const sipAmount = parseFloat(document.getElementById('sip-amount').value);
  const annualRate = parseFloat(document.getElementById('interest-rate').value);
  const tenureValue = parseFloat(document.getElementById('tenure-value').value);
  const tenureUnit = document.getElementById('tenure-unit').value;

  // Convert tenure to months
  const totalMonths = tenureUnit === 'years' ? tenureValue * 12 : tenureValue;

  // Calculate monthly interest rate
  const monthlyRate = annualRate / 12 / 100;

  // Calculate maturity amount
  const maturityAmount = sipAmount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));

  // Calculate total invested and interest earned
  const totalInvested = sipAmount * totalMonths;
  const interestEarned = maturityAmount - totalInvested;

  // Display results
  document.getElementById('total-invested').textContent = `₹${totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  document.getElementById('interest-earned').textContent = `₹${interestEarned.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  document.getElementById('maturity-amount').textContent = `₹${maturityAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

  // Generate chart
  generateChart(totalInvested, interestEarned);
}

function generateChart(invested, interest) {
  const ctx = document.getElementById('sip-chart').getContext('2d');

  // Destroy previous chart if exists
  if (sipChart) {
    sipChart.destroy();
  }

  sipChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Total Invested', 'Interest Earned'],
      datasets: [{
        data: [invested, interest],
        backgroundColor: ['#3498db', '#2ecc71'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.label || '';
              if (label) {
                label += ': ';
              }
              label += '₹' + context.raw.toLocaleString('en-IN');
              return label;
            }
          }
        }
      },
      cutout: '65%'
    }
  });
}

// Initialize calculation on page load
document.addEventListener('DOMContentLoaded', calculateSIP);