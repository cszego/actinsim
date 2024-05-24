let initialTotalActin = 1.0;
let K = 0.7 * initialTotalActin;
let defaultEquilibrium = 0.5;
let positiveCapEquilibrium = 0.12;
let negativeCapEquilibrium = 0.6;
let equilibrium = defaultEquilibrium;
let dt = 0.1;
let timeSpan = Array.from({length: 501}, (_, i) => i * dt);
let G_actin = new Array(timeSpan.length).fill(0);
let F_actin = new Array(timeSpan.length).fill(0);
let totalActin = initialTotalActin;
let currentTime = 0;
let startDecayRate = 0.01;
let maxDecayRate = 2.0;

G_actin[0] = K;
F_actin[0] = totalActin - G_actin[0];

function updatePlots() {
    Plotly.newPlot('gActinPlot', [{
        x: timeSpan,
        y: G_actin,
        mode: 'lines',
        line: {color: 'blue'}
    }, {
        x: [0, Math.max(...timeSpan)],
        y: [0.3, 0.3],
        mode: 'lines',
        line: {dash: 'dot', color: 'black'}
    }, {
        x: [0, Math.max(...timeSpan)],
        y: [0.12, 0.12],
        mode: 'lines',
        line: {dash: 'dot', color: 'black'}
    }, {
        x: [0, Math.max(...timeSpan)],
        y: [0.6, 0.6],
        mode: 'lines',
        line: {dash: 'dot', color: 'black'}
    }], {
        title: 'G-Actin Concentration Over Time',
        xaxis: {title: 'Time'},
        yaxis: {title: 'G-Actin Concentration', range: [0, initialTotalActin]}
    });

    Plotly.newPlot('fActinPlot', [{
        x: timeSpan,
        y: F_actin,
        mode: 'lines',
        line: {color: 'red'}
    }], {
        title: 'F-Actin Concentration Over Time',
        xaxis: {title: 'Time'},
        yaxis: {title: 'F-Actin Concentration', range: [0, initialTotalActin]}
    });
}

function simulate() {
    for (let t = 1; t < timeSpan.length; t++) {
        currentTime += dt;
        let growthRate = (1 - G_actin[t-1]) / (1 - equilibrium);
        let decayRate = startDecayRate + (maxDecayRate - startDecayRate) * currentTime / Math.max(...timeSpan);

        if (G_actin[t-1] > equilibrium) {
            G_actin[t] = equilibrium + (G_actin[t-1] - equilibrium) * Math.exp(-decayRate * dt);
        } else {
            G_actin[t] = equilibrium - (equilibrium - G_actin[t-1]) * Math.exp(-growthRate * dt);
        }

        F_actin[t] = totalActin - G_actin[t];
    }

    updatePlots();
}

function addGActin() {
    totalActin += 0.2;
    simulate();
}

function removeGActin() {
    totalActin -= 0.2;
    simulate();
}

function setPositiveCap() {
    equilibrium = positiveCapEquilibrium;
    simulate();
}

function setNegativeCap() {
    equilibrium = negativeCapEquilibrium;
    simulate();
}

// Initial simulation
simulate();
