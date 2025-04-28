// Unit definitions
const units = {
  length: {
      meter: 1,
      kilometer: 1000,
      centimeter: 0.01,
      millimeter: 0.001,
      micrometer: 0.000001,
      nanometer: 0.000000001,
      mile: 1609.34,
      yard: 0.9144,
      foot: 0.3048,
      inch: 0.0254,
      nauticalMile: 1852
  },
  weight: {
      kilogram: 1,
      gram: 0.001,
      milligram: 0.000001,
      metricTon: 1000,
      pound: 0.453592,
      ounce: 0.0283495,
      stone: 6.35029,
      ton: 907.185,
      carat: 0.0002
  },
  volume: {
      liter: 1,
      milliliter: 0.001,
      cubicMeter: 1000,
      cubicCentimeter: 0.001,
      cubicMillimeter: 0.000001,
      gallon: 3.78541,
      quart: 0.946353,
      pint: 0.473176,
      cup: 0.24,
      fluidOunce: 0.0295735,
      tablespoon: 0.0147868,
      teaspoon: 0.00492892
  },
  area: {
      squareMeter: 1,
      squareKilometer: 1000000,
      squareCentimeter: 0.0001,
      squareMillimeter: 0.000001,
      hectare: 10000,
      acre: 4046.86,
      squareMile: 2589988.11,
      squareYard: 0.836127,
      squareFoot: 0.092903,
      squareInch: 0.00064516
  },
  pressure: {
      pascal: 1,
      kilopascal: 1000,
      megapascal: 1000000,
      bar: 100000,
      psi: 6894.76,
      atmosphere: 101325,
      torr: 133.322,
      mmHg: 133.322
  },
  temperature: {
      celsius: 'celsius',
      fahrenheit: 'fahrenheit',
      kelvin: 'kelvin'
  },
  speed: {
      meterPerSecond: 1,
      kilometerPerHour: 0.277778,
      milePerHour: 0.44704,
      knot: 0.514444,
      footPerSecond: 0.3048
  },
  time: {
      second: 1,
      millisecond: 0.001,
      microsecond: 0.000001,
      nanosecond: 0.000000001,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      month: 2629746,
      year: 31556952
  },
  energy: {
      joule: 1,
      kilojoule: 1000,
      calorie: 4.184,
      kilocalorie: 4184,
      wattHour: 3600,
      kilowattHour: 3600000,
      electronvolt: 1.60218e-19,
      britishThermalUnit: 1055.06,
      footPound: 1.35582
  }
};

// DOM elements
const categorySelect = document.getElementById('category');
const inputUnitSelect = document.getElementById('input-unit');
const outputUnitSelect = document.getElementById('output-unit');
const inputValue = document.getElementById('input-value');
const outputValue = document.getElementById('output-value');

// Initialize the converter
function initConverter() {
  populateUnits();
  categorySelect.addEventListener('change', populateUnits);
  inputValue.addEventListener('input', convert);
  inputUnitSelect.addEventListener('change', convert);
  outputUnitSelect.addEventListener('change', convert);
  
  // Initial conversion
  convert();
}

// Populate unit dropdowns based on category
function populateUnits() {
  const category = categorySelect.value;
  const unitList = units[category];
  
  // Clear existing options
  inputUnitSelect.innerHTML = '';
  outputUnitSelect.innerHTML = '';
  
  // Add new options
  for (const unit in unitList) {
      const option1 = document.createElement('option');
      option1.value = unit;
      option1.textContent = unit;
      
      const option2 = document.createElement('option');
      option2.value = unit;
      option2.textContent = unit;
      
      inputUnitSelect.appendChild(option1);
      outputUnitSelect.appendChild(option2);
  }
  
  // Set default output unit to second option (if available)
  if (Object.keys(unitList).length > 1) {
      outputUnitSelect.selectedIndex = 1;
  }
  
  // Trigger conversion
  convert();
}

// Convert units
function convert() {
  const category = categorySelect.value;
  const fromUnit = inputUnitSelect.value;
  const toUnit = outputUnitSelect.value;
  const value = parseFloat(inputValue.value) || 0;
  
  let result;
  
  if (category === 'temperature') {
      result = convertTemperature(value, fromUnit, toUnit);
  } else {
      // For other categories
      const fromFactor = units[category][fromUnit];
      const toFactor = units[category][toUnit];
      result = value * fromFactor / toFactor;
  }
  
  outputValue.value = result.toFixed(8).replace(/\.?0+$/, '');
}

// Special conversion for temperature
function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;
  
  // Convert to Celsius first
  let celsius;
  switch (fromUnit) {
      case 'celsius':
          celsius = value;
          break;
      case 'fahrenheit':
          celsius = (value - 32) * 5/9;
          break;
      case 'kelvin':
          celsius = value - 273.15;
          break;
  }
  
  // Convert from Celsius to target unit
  switch (toUnit) {
      case 'celsius':
          return celsius;
      case 'fahrenheit':
          return celsius * 9/5 + 32;
      case 'kelvin':
          return celsius + 273.15;
  }
}

// Swap input and output units
function swapUnits() {
  const tempUnit = inputUnitSelect.value;
  inputUnitSelect.value = outputUnitSelect.value;
  outputUnitSelect.value = tempUnit;
  convert();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initConverter);