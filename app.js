let initialTotalActin = 1.0;
let K = 0.7 * initialTotalActin;
let defaultEquilibrium = 0.5;
let positiveCapEquilibrium = 0.12;
let negativeCapEquilibrium = 0.6;
let equilibrium = defaultEquilibrium;
let dt = 0.1;
let timeSpan = Array.from({ length: 501 }, (_, i) => i * dt);
let G_actin = new Array(timeSpan.length).fill(0);
let F_actin = new Array(timeSpan.length).fill(0);
let totalActin = initialTotalActin;
let currentTime = 0;
let startDecayRate = 0.01;
let maxDecayRate = 2.0;
let currentTimeIndex = 0;

G_actin[0] = K;
F_actin[0] = totalActin - G_actin[0];

function updatePlots() {
    Plotly.react('gActinPlot', [{
        x: timeSpan.slice(0, currentTimeIndex + 1),
        y: G_actin.slice(0, currentTimeIndex + 1),
        mode: 'lines',
        line: { color: 'blue' }
    }, {
        x: [0, Math.max(...timeSpan)],
        y: [0.3, 0.3],
        mode: 'lines',
        line: { dash: 'dot', color: 'black' }
    }, {
        x: [0, Math.max(...timeSpan)],
        y: [0.12, 0.12],
        mode: 'lines',
        line: { dash: 'dot', color: 'black' }
    }, {
        x: [0, Math.max(...timeSpan)],
        y: [0.6, 0.6],
        mode: 'lines',
        line: { dash: 'dot', color: 'black' }
    }], {
        title: 'G-Actin Concentration Over Time',
        xaxis: { title: 'Time' },
        yaxis: { title: 'G-Actin Concentration', range: [0, initialTotalActin] }
    });

    Plotly.react('fActinPlot', [{
        x: timeSpan.slice(0, currentTimeIndex + 1),
        y: F_actin.slice(0, currentTimeIndex + 1),
        mode: 'lines',
        line: { color: 'red' }
    }], {
        title: 'F-Actin Concentration Over Time',
        xaxis: { title: 'Time' },
        yaxis: { title: 'F-Actin Concentration', range: [0, initialTotalActin] }
    });
}

function updateSimulation() {
    if (currentTimeIndex < timeSpan.length - 1) {
        currentTimeIndex++;
        currentTime += dt;
        let growthRate = (1 - G_actin[currentTimeIndex - 1]) / (1 - equilibrium);
        let decayRate = startDecayRate + (maxDecayRate - startDecayRate) * currentTime / Math.max(...timeSpan);

        if (G_actin[currentTimeIndex - 1] > equilibrium) {
            G_actin[currentTimeIndex] = equilibrium + (G_actin[currentTimeIndex - 1] - equilibrium) * Math.exp(-decayRate * dt);
        } else {
            G_actin[currentTimeIndex] = equilibrium - (equilibrium - G_actin[currentTimeIndex - 1]) * Math.exp(-growthRate * dt);
        }

        F_actin[currentTimeIndex] = totalActin - G_actin[currentTimeIndex];

        updatePlots();
    }
}

function addGActin() {
    totalActin += 0.2;
    G_actin[currentTimeIndex] += 0.2;
    F_actin[currentTimeIndex] = totalActin - G_actin[currentTimeIndex];
    updatePlots();
}

function removeGActin() {
    totalActin -= 0.2;
    G_actin[currentTimeIndex] -= 0.2;
    F_actin[currentTimeIndex] = totalActin - G_actin[currentTimeIndex];
    updatePlots();
}

function setPositiveCap() {
    equilibrium = positiveCapEquilibrium;
}

function setNegativeCap() {
    equilibrium = negativeCapEquilibrium;
}

function updateCurrentActinValues() {
    G_actin[currentTimeIndex] = G_actin[currentTimeIndex - 1];  // Keep the last value
    F_actin[currentTimeIndex] = totalActin - G_actin[currentTimeIndex];
    updatePlots();
}

function resetSimulation() {
    G_actin[0] = K;
    F_actin[0] = totalActin - G_actin[0];
}

// Initial simulation
resetSimulation();
updatePlots();

// Update simulation every 100 milliseconds (0.1 seconds)
setInterval(updateSimulation, 100);
