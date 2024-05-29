let positiveCapEnabled = false;
let negativeCapEnabled = false;
const defaultEquilibrium = 0.3;
const positiveCapEquilibrium = 0.12;
const negativeCapEquilibrium = 0.6;
let equilibrium = defaultEquilibrium;

const totalActin = 1.0;
let G_actin = [1]; // initial G-actin concentration
let F_actin = [totalActin - G_actin[0]]; // initial F-actin concentration

let time = [0];
const dt = 0.1; // time step

// Base growth/decay rates
const base_G_growth_rate = 0.5; 
const base_G_decay_rate = 0.1;
const base_F_growth_rate = 0.05; // Slower initial growth rate for F-actin
const base_F_decay_rate = 0.5;

let G_growth_rate = base_G_growth_rate;
let G_decay_rate = base_G_decay_rate;
let F_growth_rate = base_F_growth_rate;
let F_decay_rate = base_F_decay_rate;

// Function to update the equilibrium and rates based on the toggle buttons
function updateEquilibriumAndRates() {
  if (positiveCapEnabled && negativeCapEnabled) {
    equilibrium = defaultEquilibrium;
    G_growth_rate = base_G_growth_rate / 2;
    G_decay_rate = base_G_decay_rate / 2;
    F_growth_rate = base_F_growth_rate / 2;
    F_decay_rate = base_F_decay_rate / 2;
  } else if (positiveCapEnabled) {
    equilibrium = positiveCapEquilibrium;
    G_growth_rate = base_G_growth_rate / 2;
    G_decay_rate = base_G_decay_rate / 2;
    F_growth_rate = base_F_growth_rate / 2;
    F_decay_rate = base_F_decay_rate / 2;
  } else if (negativeCapEnabled) {
    equilibrium = negativeCapEquilibrium;
    G_growth_rate = base_G_growth_rate / 2;
    G_decay_rate = base_G_decay_rate / 2;
    F_growth_rate = base_F_growth_rate / 2;
    F_decay_rate = base_F_decay_rate / 2;
  } else {
    equilibrium = defaultEquilibrium;
    G_growth_rate = base_G_growth_rate;
    G_decay_rate = base_G_decay_rate;
    F_growth_rate = base_F_growth_rate;
    F_decay_rate = base_F_decay_rate;
  }
}

// Function to update the concentrations of G-actin and F-actin
function updateConcentrations() {
  const lastG = G_actin[G_actin.length - 1];
  const lastF = F_actin[F_actin.length - 1];

  let newG;
  if (lastG > equilibrium) {
    newG = equilibrium + (lastG - equilibrium) * Math.exp(-G_decay_rate * dt);
  } else {
    newG = equilibrium - (equilibrium - lastG) * Math.exp(-G_growth_rate * dt);
  }
  G_actin.push(newG);

  let newF;
  if (lastF > equilibrium) {
    newF = equilibrium + (lastF - equilibrium) * Math.exp(-F_decay_rate * dt);
  } else {
    newF = equilibrium - (equilibrium - lastF) * Math.exp(-F_growth_rate * dt);
  }
  F_actin.push(newF);

  time.push(time[time.length - 1] + dt);
}

// Update loop
setInterval(() => {
  updateEquilibriumAndRates();
  updateConcentrations();
  Plotly.update('gActinPlot', {
    x: [time],
    y: [G_actin]
  });
  Plotly.update('fActinPlot', {
    x: [time],
    y: [F_actin]
  });
}, 100);

// Event listeners for the checkboxes
document.getElementById("positiveCapCheckbox").addEventListener("change", function() {
  positiveCapEnabled = this.checked;
  if (positiveCapEnabled) {
    negativeCapEnabled = false;
    document.getElementById("negativeCapCheckbox").checked = false;
  }
  updateEquilibriumAndRates();
});

document.getElementById("negativeCapCheckbox").addEventListener("change", function() {
  negativeCapEnabled = this.checked;
  if (negativeCapEnabled) {
    positiveCapEnabled = false;
    document.getElementById("positiveCapCheckbox").checked = false;
  }
  updateEquilibriumAndRates();
});

// Initial plot
Plotly.newPlot('gActinPlot', [{
  x: time,
  y: G_actin,
  mode: 'lines',
  name: 'G-actin'
}], {
  title: 'G-actin Concentration Over Time',
  xaxis: { title: 'Time' },
  yaxis: { title: 'G-actin Concentration', range: [0, 1] }
});

Plotly.newPlot('fActinPlot', [{
  x: time,
  y: F_actin,
  mode: 'lines',
  name: 'F-actin'
}], {
  title: 'F-actin Concentration Over Time',
  xaxis: { title: 'Time' },
  yaxis: { title: 'F-actin Concentration', range: [0, 1] },
  showlegend: false
});
