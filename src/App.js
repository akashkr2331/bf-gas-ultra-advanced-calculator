// import logo from './logo.svg';
import './App.css';

function App() {

  // const RELATIVE_HUMIDITY = 0.20; // 20% relative humidity
  //   const OTHER_GASES = 1.5; // Other gases approximation (1.5%)
    
  //   // Elements
  //   const calculatorForm = document.getElementById('bfgCalculatorForm');
  //   const warningMessages = document.getElementById('warningMessages');
  //   const showDetailsBtn = document.getElementById('showDetailsBtn');
  //   const detailedResults = document.getElementById('detailedResults');

    
    // Event Listeners
    // calculatorForm.addEventListener('submit', calculateBFGas);
    // showDetailsBtn.addEventListener('click', toggleDetailedResults);
    
  //   // Toggle detailed results display
    function toggleDetailedResults() {
      const showDetailsBtn = document.getElementById('showDetailsBtn');
      const detailedResults = document.getElementById('detailedResults');
        detailedResults.classList.toggle('visible');
        showDetailsBtn.textContent = detailedResults.classList.contains('visible') 
            ? 'Hide Parameters' 
            : 'Show All Parameters';
    }
    
  //   // Main calculation function - Following exact logic of the original C++ code
    function calculateBFGas(e) {
        e.preventDefault();
        
        // Clear previous warnings
        // warningMessages.innerHTML = '';

        const RELATIVE_HUMIDITY = 0.20; // 20% relative humidity
    const OTHER_GASES = 1.5; // Other gases approximation (1.5%)
    
    // Elements
    const calculatorForm = document.getElementById('bfgCalculatorForm');
    const warningMessages = document.getElementById('warningMessages');
    // const showDetailsBtn = document.getElementById('showDetailsBtn');
    const detailedResults = document.getElementById('detailedResults');
        
        // Get input values
        const windVolumeInNM3 = parseFloat(document.getElementById('windVolume').value);
        const tempInCelsius = parseFloat(document.getElementById('temperature').value);
        let pressureInKgCm2 = parseFloat(document.getElementById('pressure').value);
        const oxygenEnrichment = parseFloat(document.getElementById('oxygenEnrichment').value);
        const coPercentage = parseFloat(document.getElementById('coPercentage').value);
        const co2Percentage = parseFloat(document.getElementById('co2Percentage').value);
        const h2Percentage = parseFloat(document.getElementById('h2Percentage').value);
        const o2Percentage = parseFloat(document.getElementById('o2Percentage').value);
        
        // Calculate hourly wind volume (n in the original code)
        const hourlyWindVolume = windVolumeInNM3 / 24;
        
        // Calculate stove change over volume (exact formula from C++ code)
        const stoveChangeOverVol = (12000 * 10) / 55;
        
        // Convert pressure to atm (exactly as in original code)
        let pressureInAtm = pressureInKgCm2 / 1.013;
        
        // Calculate humidity using the original formula
        const humidity = calculateAbsoluteHumidity(tempInCelsius, pressureInAtm, RELATIVE_HUMIDITY);
        
        // Calculate dry wind volume (exactly as in original code)
        // const Dry = n*(1-((22.4/18)*Ht)/1000)-st;
        const dryWindVol = hourlyWindVolume * (1 - ((22.4 / 18) * humidity) / 1000) - stoveChangeOverVol;
        
        // Check gas percentages sum
        const totalGasPercentage = coPercentage + co2Percentage + h2Percentage + o2Percentage + OTHER_GASES;
        let sumGas = totalGasPercentage;
        
        if (totalGasPercentage >= 100) {
            sumGas = 95; // Set a safe maximum
            addWarning("The sum of gas percentages exceeds 100%. Using 95% as maximum for calculation.");
        }
        
        // Calculate BF Gas Generation
        const bfGasGeneration = dryWindVol * (100 - 21 + oxygenEnrichment) / (100 - sumGas);

        console.log(bfGasGeneration)
        
  //       // Display results
        displayResults({
            hourlyWindVolume,
            stoveChangeOverVol,
            humidity,
            dryWindVol,
            oxygenEnrichment,
            coPercentage,
            co2Percentage,
            h2Percentage,
            o2Percentage,
            otherGases: OTHER_GASES,
            bfGasGeneration
        });
    }
    
  //   // Add warning message
    function addWarning(message) {
        const warningElement = document.createElement('div');
        warningElement.className = 'warning';
        warningElement.textContent = message;
        // warningMessages.appendChild(warningElement);
    }
    
  //   // Display calculation results
    function displayResults(results) {
        // Round numbers for display
        const round = (num) => parseFloat(num.toFixed(2));
        
        // Main results
        document.getElementById('totalBfGasGeneration').textContent = round(results.bfGasGeneration * 24).toLocaleString();
        document.getElementById('avgBfGasGeneration').textContent = round(results.bfGasGeneration).toLocaleString();
        
        // Detailed parameters
        document.getElementById('hourlyWindVolume').textContent = round(results.hourlyWindVolume).toLocaleString();
        document.getElementById('stoveChangeOver').textContent = round(results.stoveChangeOverVol).toLocaleString();
        document.getElementById('humidity').textContent = round(results.humidity).toLocaleString();
        document.getElementById('dryWindVolume').textContent = round(results.dryWindVol).toLocaleString();
        document.getElementById('oxygenEnrichmentResult').textContent = round(results.oxygenEnrichment).toLocaleString();
        document.getElementById('coResult').textContent = round(results.coPercentage).toLocaleString();
        document.getElementById('co2Result').textContent = round(results.co2Percentage).toLocaleString();
        document.getElementById('h2Result').textContent = round(results.h2Percentage).toLocaleString();
        document.getElementById('o2Result').textContent = round(results.o2Percentage).toLocaleString();
        document.getElementById('otherGases').textContent = round(results.otherGases).toLocaleString();
        
        // Show results panel
        document.getElementById('resultsPanel').style.display = 'block';
    }
    
    // Function to calculate absolute humidity - Following the exact logic of the original C++ code
    function calculateAbsoluteHumidity(tempInCelsius, pressureInAtm, relativeHumidity) {
        // Using the exact same logic and constants as in the original code
        let p_sat = 1.40e6; // Default value
        
        // Constants for calculation
        const M = 18.0; // Molar mass of water (g/mol)
        const R = 8.314;
        const P_standard = 1.0; // Standard_pressure (atm)
        const T_std = 273.15; // Standard temperature in Kelvin
        
        // Round to the nearest integer (exactly as in C++ code)
        const roundedKelvin = Math.round(tempInCelsius);
        
        // Determine saturation vapor pressure based on temperature (following original logic)
        if (roundedKelvin < 1119 || roundedKelvin >= 1100) {
            p_sat = 1.40e6;
        } else if (roundedKelvin > 1130 || roundedKelvin <= 1150) {
            p_sat = 1.54e6;
        } else {
            p_sat = 1.40e6;
            for (let j = 1119; j < 1130; j++) {
                p_sat += 0.010e6;
                if (roundedKelvin === j) {
                    break;
                }
            }
        }
        
        // Calculate actual temperature in Kelvin
        const T_actual = tempInCelsius + 273.15;
        
        // Calculate absolute humidity in g/m³
        const Abs_h_gm3 = (relativeHumidity * p_sat * M) / (R * T_actual);
        
        // Converting g/m³ to g/Nm³
        const Abs_h_g_NM3 = Abs_h_gm3 * (T_std / T_actual) * (P_standard / pressureInAtm);
        
        return Abs_h_g_NM3;
    }

  return (
    <div className="App">
      <div className="container">
        <header>
          <h1>Blast Furnace Gas Generation Calculator</h1>
          <p className="credit">
            Developed by <strong>Rhishish Ranjan</strong>&copy;, A NIT Jamshedpur Graduate. With the help of Aditya Sir and ideas given by Pooja mam
          </p>
        </header>

        <main>
          <div className="calculator-panel">
            <form id="bfgCalculatorForm">
              <div className="form-group">
                <label htmlFor="windVolume">Wind Volume in Nm³ (For the whole day as shown in HMI):</label>
                <input type="number" id="windVolume" min="0" step="0.01" required />
              </div>

              <div className="form-group">
                <label htmlFor="temperature">Temperature in Celsius:</label>
                <input type="number" id="temperature" step="0.01" required />
              </div>

              <div className="form-group">
                <label htmlFor="pressure">Pressure in Kg/cm²:</label>
                <input type="number" id="pressure" min="0" step="0.01" required />
              </div>

              <div className="form-group">
                <label htmlFor="oxygenEnrichment">% Oxygen enrichment factor from System base:</label>
                <input type="number" id="oxygenEnrichment" min="0" max="100" step="0.01" required />
              </div>

              <div className="gas-composition">
                <h3>Gas Composition Percentages:</h3>

                <div className="form-group">
                  <label htmlFor="coPercentage">% CO:</label>
                  <input type="number" id="coPercentage" min="0" max="100" step="0.01" required />
                </div>

                <div className="form-group">
                  <label htmlFor="co2Percentage">% CO2:</label>
                  <input type="number" id="co2Percentage" min="0" max="100" step="0.01" required />
                </div>

                <div className="form-group">
                  <label htmlFor="h2Percentage">% H2:</label>
                  <input type="number" id="h2Percentage" min="0" max="100" step="0.01" required />
                </div>

                <div className="form-group">
                  <label htmlFor="o2Percentage">% O2:</label>
                  <input type="number" id="o2Percentage" min="0" max="100" step="0.01" required />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="calculate-btn" onClick={(e)=>calculateBFGas(e)}>Calculate</button>
                <button type="reset" className="reset-btn">Reset</button>
              </div>
            </form>
          </div>

          <div className="results-panel" id="resultsPanel">
            <h2>Calculation Results</h2>
            <div id="warningMessages" className="warning-messages"></div>
            <div className="results-summary">
              <div className="result-item">
                <span className="result-label">Total BF Gas Generation (Nm³/day):</span>
                <span className="result-value" id="totalBfGasGeneration">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">Average BF Gas Generation (Nm³/hr):</span>
                <span className="result-value" id="avgBfGasGeneration">-</span>
              </div>
            </div>

            <button id="showDetailsBtn" className="details-btn" onClick={()=>toggleDetailedResults()}>Show All Parameters</button>

            <div id="detailedResults" className="detailed-results">
              <div className="result-item">
                <span className="result-label">Wind Volume in Nm³/hr:</span>
                <span className="result-value" id="hourlyWindVolume">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">Stove change over Vol. cons. on time correction:</span>
                <span className="result-value" id="stoveChangeOver">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">Humidity (g/Nm³):</span>
                <span className="result-value" id="humidity">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">Dry Wind Volume (Nm³/hr):</span>
                <span className="result-value" id="dryWindVolume">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">% Oxygen enrichment from system base:</span>
                <span className="result-value" id="oxygenEnrichmentResult">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">% CO:</span>
                <span className="result-value" id="coResult">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">% CO2:</span>
                <span className="result-value" id="co2Result">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">% H2:</span>
                <span className="result-value" id="h2Result">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">% O2:</span>
                <span className="result-value" id="o2Result">-</span>
              </div>
              <div className="result-item">
                <span className="result-label">% Other gases (approximation):</span>
                <span className="result-value" id="otherGases">-</span>
              </div>
            </div>
          </div>
        </main>

        <footer>
          <p>
            © 2025 - BF Gas Generation Calculator - Developed by <strong>Rhishish Ranjan</strong>&copy;, GET working at Welspun Corp Limited
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
