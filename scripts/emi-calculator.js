
        // Initialize Chart
        let emiChart = null;

        // Sync range sliders with number inputs
        document.getElementById('loan-amount').addEventListener('input', function() {
            document.getElementById('loan-amount-range').value = this.value;
            document.getElementById('loan-amount-display').textContent = formatCurrency(this.value);
        });

        document.getElementById('loan-amount-range').addEventListener('input', function() {
            document.getElementById('loan-amount').value = this.value;
            document.getElementById('loan-amount-display').textContent = formatCurrency(this.value);
        });

        document.getElementById('interest-rate').addEventListener('input', function() {
            document.getElementById('interest-rate-range').value = this.value;
            document.getElementById('interest-rate-display').textContent = this.value + '%';
        });

        document.getElementById('interest-rate-range').addEventListener('input', function() {
            document.getElementById('interest-rate').value = this.value;
            document.getElementById('interest-rate-display').textContent = this.value + '%';
        });

        document.getElementById('loan-tenure').addEventListener('input', function() {
            document.getElementById('loan-tenure-range').value = this.value;
            document.getElementById('loan-tenure-display').textContent = this.value + ' years';
        });

        document.getElementById('loan-tenure-range').addEventListener('input', function() {
            document.getElementById('loan-tenure').value = this.value;
            document.getElementById('loan-tenure-display').textContent = this.value + ' years';
        });

        // Format currency
        function formatCurrency(amount) {
            return '₹' + parseFloat(amount).toLocaleString('en-IN');
        }

        // Calculate EMI
        function calculateEMI() {
            const loanAmount = parseFloat(document.getElementById('loan-amount').value);
            const interestRate = parseFloat(document.getElementById('interest-rate').value);
            const loanTenureYears = parseFloat(document.getElementById('loan-tenure').value);
            
            // Convert years to months
            const loanTenureMonths = loanTenureYears * 12;
            
            // Calculate monthly interest rate
            const monthlyInterestRate = interestRate / 12 / 100;
            
            // Calculate EMI using standard formula
            const emi = loanAmount * monthlyInterestRate * 
                        Math.pow(1 + monthlyInterestRate, loanTenureMonths) / 
                        (Math.pow(1 + monthlyInterestRate, loanTenureMonths) - 1);
            
            // Calculate total payment and interest
            const totalPayment = emi * loanTenureMonths;
            const totalInterest = totalPayment - loanAmount;
            const interestPercent = (totalInterest / loanAmount) * 100;
            
            // Display results
            document.getElementById('emi-amount').textContent = formatCurrency(emi.toFixed(0));
            document.getElementById('total-interest').textContent = formatCurrency(totalInterest.toFixed(0));
            document.getElementById('total-payment').textContent = formatCurrency(totalPayment.toFixed(0));
            document.getElementById('interest-percent').textContent = interestPercent.toFixed(1) + '%';
            
            // Update chart
            updateChart(loanAmount, totalInterest);
        }

        // Update chart
        function updateChart(principal, interest) {
            const ctx = document.getElementById('emi-chart').getContext('2d');
            
            // Destroy previous chart if exists
            if (emiChart) {
                emiChart.destroy();
            }
            
            emiChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Principal Amount', 'Total Interest'],
                    datasets: [{
                        data: [principal, interest],
                        backgroundColor: ['#3498db', '#e74c3c'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                padding: 20,
                                font: {
                                    size: 13
                                }
                            }
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
                    cutout: '68%'
                }
            });
        }

        // Calculate on page load
        window.addEventListener('load', calculateEMI);
  