
const startBtn = document.querySelector(".start-btn");
const resetBtn = document.querySelector(".reset-btn");
const statusBox = document.querySelector(".status");

const cars = document.querySelectorAll(".car");
const trafficLights = document.querySelectorAll(".traffic-light");
const signalRows = document.querySelectorAll(".signal-row");

const vehicleCount = document.querySelector(".stat-card:nth-child(1) h2");
const speedCount = document.querySelector(".stat-card:nth-child(2) h2");
const densityCount = document.querySelector(".stat-card:nth-child(3) h2");
const progressFill = document.querySelector(".progress-fill");

let simulationRunning = false;
let simulationInterval;
let signalInterval;
let vehiclePositions = [];
let signalStates = ["Red", "Green", "Yellow", "Red"];

const originalPositions = [
    { top: 34, left: 8 },
    { top: 35, left: 48 },
    { top: 30, left: 82 },
    { top: 4, left: 29 },
    { top: 78, left: 48 },
    { top: 50, left: 74 }
];

function initializeSimulation() {
    vehiclePositions = originalPositions.map(position => ({
        top: position.top,
        left: position.left
    }));

    cars.forEach((car, index) => {
        car.style.top = vehiclePositions[index].top + "%";
        car.style.left = vehiclePositions[index].left + "%";
        car.style.transition = "top 0.5s linear, left 0.5s linear";
    });

    vehicleCount.textContent = "1,248";
    speedCount.innerHTML = '32 <span>km/h</span>';
    densityCount.textContent = "68%";
    progressFill.style.width = "68%";
}

function updateStatus() {
    if (simulationRunning) {
        statusBox.innerHTML = '<span class="online-dot"></span> Simulation Running';
        startBtn.textContent = "⏸ Stop Simulation";
    } else {
        statusBox.innerHTML = '<span class="red-dot"></span> Simulation Paused';
        startBtn.textContent = "▶ Start Simulation";
    }
}

cars.forEach(car => {
    car.style.position = "absolute";
    car.style.display = "block";
    car.style.zIndex = "10";
});
    const density = Math.floor(Math.random() * 35) + 45;
    const speed = Math.floor(Math.random() * 20) + 25;

    densityCount.textContent = density + "%";
    speedCount.innerHTML = speed + ' <span>km/h</span>';
    progressFill.style.width = density + "%";
}

function changeTrafficSignals() {
    signalStates = signalStates.map(state => {
        if (state === "Red") return "Green";
        if (state === "Green") return "Yellow";
        return "Red";
    });

    trafficLights.forEach((light, index) => {
        const bulbs = light.querySelectorAll("span");

        bulbs.forEach(bulb => {
            bulb.classList.remove(
                "light-red",
                "light-yellow",
                "light-green"
            );
        });

        const state = signalStates[index];

        if (state === "Red") {
            bulbs[0].classList.add("light-red");
        } else if (state === "Yellow") {
            bulbs[1].classList.add("light-yellow");
        } else {
            bulbs[2].classList.add("light-green");
        }

        const badge = signalRows[index].querySelector(".badge");
        badge.textContent = state;
        badge.className = "badge " + state.toLowerCase() + "-badge";
    });
}

function startSimulation() {
    simulationRunning = true;

    updateStatus();

    simulationInterval = setInterval(moveVehicles, 500);
    signalInterval = setInterval(changeTrafficSignals, 4000);
}

function stopSimulation() {
    simulationRunning = false;

    clearInterval(simulationInterval);
    clearInterval(signalInterval);

    updateStatus();
}

startBtn.addEventListener("click", () => {
    if (simulationRunning) {
        stopSimulation();
    } else {
        startSimulation();
    }
});

resetBtn.addEventListener("click", () => {
    stopSimulation();

    signalStates = ["Red", "Green", "Yellow", "Red"];

    initializeSimulation();

    changeTrafficSignals();
    updateStatus();
});

initializeSimulation();
updateStatus();
