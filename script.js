
document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.querySelector(".start-btn");
    const resetBtn = document.querySelector(".reset-btn");
    const statusBox = document.querySelector(".status");

    const cars = document.querySelectorAll(".car");
    const lights = document.querySelectorAll(".traffic-light");

    const densityElements = {
        north: document.getElementById("northDensity"),
        south: document.getElementById("southDensity"),
        east: document.getElementById("eastDensity"),
        west: document.getElementById("westDensity")
    };

    const smartStatus = document.getElementById("smartStatus");
const accidentRoadSelect = document.getElementById("accidentRoad");
const detectAccidentBtn = document.getElementById("detectAccident");
const clearAccidentBtn = document.getElementById("clearAccident");
const accidentAlert = document.getElementById("accidentAlert");
const accidentDetails = document.getElementById("accidentDetails");

let accidentActive = false;
let accidentRoad = "";
const emergencyRoadSelect = document.getElementById("emergencyRoad");
const emergencyToggle = document.getElementById("emergencyToggle");
const emergencyStatus = document.getElementById("emergencyStatus");

let emergencyActive = false;
let emergencyRoad = "north";

    const activeVehiclesElement = document.getElementById("activeVehicles");
    const averageSpeedElement = document.getElementById("averageSpeed");
    const trafficDensityElement = document.getElementById("trafficDensity");
    const activeSignalsElement = document.getElementById("activeSignals");

    const totalVehiclesElement = document.getElementById("totalVehicles");
    const movingVehiclesElement = document.getElementById("movingVehicles");
    const stoppedVehiclesElement = document.getElementById("stoppedVehicles");

    const vehicleStatusElements = [
        document.getElementById("vehicleStatus1"),
        document.getElementById("vehicleStatus2"),
        document.getElementById("vehicleStatus3"),
        document.getElementById("vehicleStatus4"),
        document.getElementById("vehicleStatus5"),
        document.getElementById("vehicleStatus6")
    ];

    let running = false;
    let currentWeather = "sunny";
    let movement = null;
    let densityTimer = null;
    let signalTimer = null;
    let yellowTimer = null;

    let positions = [8, 48, 82, 4, 48, 50];

    let densities = {
        north: 8,
        south: 12,
        east: 6,
        west: 10
    };

    let activeRoad = "north";

    const roads = ["north", "south", "east", "west"];

    function moveCars() {
        cars.forEach((car, index) => {
            if (index < 3) {
                positions[index] += 2;
                if (positions[index] > 95) positions[index] = 0;
                car.style.left = positions[index] + "%";
            } else {
                positions[index] += 2;
                if (positions[index] > 90) positions[index] = 0;
                car.style.top = positions[index] + "%";
            }
        });
    }

    function updateVehicleManagement() {
        const total = cars.length;
        const moving = running ? total : 0;
        const stopped = total - moving;

        totalVehiclesElement.textContent = total;
        movingVehiclesElement.textContent = moving;
        stoppedVehiclesElement.textContent = stopped;

        vehicleStatusElements.forEach(element => {
            element.textContent = running ? "Moving" : "Stopped";
            element.style.color = running ? "#22c55e" : "#facc15";
        });
    }

    function updateDashboardStats() {
        const totalDensity = roads.reduce((sum, road) => {
            return sum + densities[road];
        }, 0);

        const averageDensity = totalDensity / roads.length;

        const trafficPercentage = Math.round((averageDensity / 20) * 100);

        let averageSpeed = 0;

if (running) {
    let normalSpeed = Math.max(10, Math.round(60 - averageDensity * 2));

    if (currentWeather === "rainy") {
        averageSpeed = Math.round(normalSpeed * 0.65);
    } 
    else if (currentWeather === "foggy") {
        averageSpeed = Math.round(normalSpeed * 0.45);
    } 
    else {
        averageSpeed = normalSpeed;
    }
}

        activeVehiclesElement.textContent = cars.length;
        averageSpeedElement.textContent = averageSpeed;
        trafficDensityElement.textContent = trafficPercentage + "%";
        activeSignalsElement.textContent = lights.length;
    }

    function updateTrafficGraph() {
        if (!running) return;

        const averageDensity = roads.reduce((sum, road) => {
            return sum + densities[road];
        }, 0) / roads.length;

        const newValue = Math.max(
            15,
            Math.min(160, 180 - averageDensity * 8)
        );

        graphValues.shift();
        graphValues.push(newValue);

        const points = graphValues.map((value, index) => {
            return `${index * 50},${value}`;
        }).join(" ");

        graphLine.setAttribute("points", points);

        graphArea.setAttribute(
            "d",
            `M${points.replaceAll(" ", " L")} L400,180 L0,180 Z`
        );
    }

    const graphLine = document.getElementById("trafficGraphLine");
    const graphArea = document.getElementById("trafficGraphArea");

    let graphValues = [145, 120, 132, 70, 90, 45, 65, 20, 40];
    
const congestionElements = {
    north: document.getElementById("northCongestion"),
    south: document.getElementById("southCongestion"),
    east: document.getElementById("eastCongestion"),
    west: document.getElementById("westCongestion")
};

const congestionAlert = document.getElementById("congestionAlert");

function updateCongestion() {

    let highCount = 0;
    let moderateCount = 0;

    roads.forEach(road => {

        const density = densities[road];
        const element = congestionElements[road];

        element.className = "congestion-badge";

        if (density >= 15) {

            element.textContent = "High";
            element.classList.add("high");
            highCount++;

        } else if (density >= 10) {

            element.textContent = "Moderate";
            element.classList.add("moderate");
            moderateCount++;

        } else {

            element.textContent = "Smooth";
            element.classList.add("smooth");

        }

    });

    if (highCount > 0) {

        congestionAlert.innerHTML =
            "🔴 <strong>" + highCount + " Road(s) Experiencing High Congestion</strong>";

        congestionAlert.style.color = "#ef4444";

    } else if (moderateCount > 0) {

        congestionAlert.innerHTML =
            "🟡 <strong>Moderate Traffic Detected</strong>";

        congestionAlert.style.color = "#facc15";

    } else {

        congestionAlert.innerHTML =
            "🟢 <strong>All Roads Normal</strong>";

        congestionAlert.style.color = "#22c55e";

    }

}


    function updateDensity() {
        roads.forEach(road => {
            densities[road] = Math.floor(Math.random() * 16) + 5;

            const element = densityElements[road];

            element.textContent = densities[road] + " Vehicles";
            element.className = "badge";

            if (densities[road] >= 15) {
                element.classList.add("red-badge");
            } else if (densities[road] >= 10) {
                element.classList.add("yellow-badge");
            } else {
                element.classList.add("green-badge");
            }
            updateCongestion();
        });

        updateDashboardStats();
        updateTrafficGraph();
    }

    function getHighestTrafficRoad() {
        return roads.reduce((highest, road) => {
            return densities[road] > densities[highest] ? road : highest;
        }, roads[0]);
    }

   
function smartTrafficControl() {
    if (emergencyActive) {
        activeRoad = emergencyRoad;
        return 30;
    }

    activeRoad = getHighestTrafficRoad();

    const highestDensity = densities[activeRoad];

    const greenTime = Math.min(60, Math.max(15, highestDensity * 3));

    return greenTime;
}


    function setAllRed() {
        lights.forEach(light => {
            const bulbs = light.querySelectorAll("span");

            bulbs.forEach(bulb => bulb.className = "");

            bulbs[0].className = "light-red";
        });
    }

    function changeSignals() {
        if (!running) return;

        clearTimeout(signalTimer);
        clearTimeout(yellowTimer);

        const greenTime = smartTrafficControl();

        const activeIndex = roads.indexOf(activeRoad);

        setAllRed();

        const activeLight = lights[activeIndex];

        if (!activeLight) return;

        const activeBulbs = activeLight.querySelectorAll("span");

        activeBulbs[0].className = "";
        activeBulbs[2].className = "light-green";

        smartStatus.textContent = emergencyActive
    ? "🚑 " + activeRoad.toUpperCase() + " EMERGENCY GREEN - " + greenTime + " sec"
    : activeRoad.toUpperCase() + " GREEN - " + greenTime + " sec";
        signalTimer = setTimeout(() => {
            if (!running) return;

            activeBulbs[2].className = "";
            activeBulbs[1].className = "light-yellow";

            smartStatus.textContent = activeRoad.toUpperCase() + " YELLOW";

            yellowTimer = setTimeout(() => {
                if (!running) return;

                activeBulbs[1].className = "";
                activeBulbs[0].className = "light-red";

                updateDensity();
                changeSignals();

            }, 2000);

        }, greenTime * 1000);
    }

    function startSimulation() {
        if (running) {
            stopSimulation();
            return;
        }

        running = true;

        statusBox.innerHTML = '<span class="online-dot"></span> Simulation Running';

        startBtn.textContent = "⏸ Stop Simulation";

        updateDensity();
        updateDashboardStats();
        updateVehicleManagement();

        movement = setInterval(moveCars, 300);

        densityTimer = setInterval(updateDensity, 5000);

        changeSignals();
    }

    function stopSimulation() {
        running = false;

        clearInterval(movement);
        clearInterval(densityTimer);
        clearTimeout(signalTimer);
        clearTimeout(yellowTimer);

        movement = null;
        densityTimer = null;
        signalTimer = null;
        yellowTimer = null;

        statusBox.innerHTML = '<span class="red-dot"></span> Simulation Paused';

        startBtn.textContent = "▶ Start Simulation";

        smartStatus.textContent = "Paused";

        updateDashboardStats();
        updateVehicleManagement();
    }
    
function updateEmergencyStatus() {
    emergencyToggle.textContent = emergencyActive
        ? "Deactivate Emergency"
        : "Activate Emergency";

    emergencyStatus.classList.toggle("active", emergencyActive);

    if (emergencyActive) {
        emergencyStatus.textContent = running
            ? "🚑 Emergency Priority Active: " + emergencyRoad.toUpperCase()
            : "Emergency Mode ON - Start simulation to apply";
    } else {
        emergencyStatus.textContent = "Emergency Mode: OFF";
    }
}

function toggleEmergency() {
    emergencyActive = !emergencyActive;
    emergencyRoad = emergencyRoadSelect.value;

    updateEmergencyStatus();

    if (running) {
        changeSignals();
    }
}

emergencyToggle.addEventListener("click", toggleEmergency);

emergencyRoadSelect.addEventListener("change", function () {
    emergencyRoad = emergencyRoadSelect.value;

    if (emergencyActive) {
        updateEmergencyStatus();

        if (running) {
            changeSignals();
        }
    }
});


function detectAccident() {
    accidentRoad = accidentRoadSelect.value;
    accidentActive = true;

    accidentAlert.classList.add("detected");
    accidentAlert.innerHTML =
        "🔴 ACCIDENT DETECTED - " + accidentRoad.toUpperCase() + " ROAD";

    accidentDetails.textContent =
        "Alert: An accident has been reported on " +
        accidentRoad.toUpperCase() + " Road. Please monitor this simulated location.";

    accidentRoadSelect.disabled = true;
    detectAccidentBtn.disabled = true;

    const densityElement = densityElements[accidentRoad];
    densityElement.textContent = "Accident Detected";
    densityElement.className = "badge red-badge";
}

function clearAccident() {
    accidentActive = false;
    accidentRoad = "";

    accidentAlert.classList.remove("detected");
    accidentAlert.innerHTML = "🟢 No Accident Detected";

    accidentDetails.textContent =
        "All roads are operating normally.";

    accidentRoadSelect.disabled = false;
    detectAccidentBtn.disabled = false;

    roads.forEach(road => {
        densityElements[road].textContent =
            densities[road] + " Vehicles";
    });

    updateDensityDisplay();
}

function updateDensityDisplay() {
    roads.forEach(road => {
        const element = densityElements[road];

        if (road === accidentRoad && accidentActive) {
            element.textContent = "Accident Detected";
            element.className = "badge red-badge";
            return;
        }

        element.textContent = densities[road] + " Vehicles";
        element.className = "badge";

        if (densities[road] >= 15) {
            element.classList.add("red-badge");
        } else if (densities[road] >= 10) {
            element.classList.add("yellow-badge");
        } else {
            element.classList.add("green-badge");
        }
    });
}

detectAccidentBtn.addEventListener("click", detectAccident);
clearAccidentBtn.addEventListener("click", clearAccident);

    function resetSimulation() {
        stopSimulation();
        clearAccident();
        emergencyActive = false;
emergencyRoad = "north";
emergencyRoadSelect.value = "north";
updateEmergencyStatus();

        positions = [8, 48, 82, 4, 48, 50];

        cars.forEach((car, index) => {
            if (index < 3) {
                car.style.left = positions[index] + "%";
            } else {
                car.style.top = positions[index] + "%";
            }
        });

        roads.forEach(road => {
            densities[road] = 0;

            densityElements[road].textContent = "0 Vehicles";
            densityElements[road].className = "badge";
        });
        updateCongestion();

        setAllRed();

        smartStatus.textContent = "Waiting";

        graphValues = [145, 120, 132, 70, 90, 45, 65, 20, 40];

        graphLine.setAttribute(
            "points",
            graphValues.map((value, index) => `${index * 50},${value}`).join(" ")
        );

        graphArea.setAttribute(
            "d",
            "M0,145 L50,120 L100,132 L150,70 L200,90 L250,45 L300,65 L350,20 L400,40 L400,180 L0,180 Z"
        );

        updateDashboardStats();
        updateVehicleManagement();
        updateEmergencyStatus();
    }

    startBtn.addEventListener("click", startSimulation);

    resetBtn.addEventListener("click", resetSimulation);

    setAllRed();

    updateDashboardStats();
    updateVehicleManagement();

    console.log("Smart Traffic Simulator Loaded Successfully");

});


const weatherCondition = document.getElementById("weatherCondition");
const applyWeather = document.getElementById("applyWeather");
const weatherStatus = document.getElementById("weatherStatus");
const weatherDetails = document.getElementById("weatherDetails");

applyWeather.addEventListener("click", function () {

    currentWeather = weatherCondition.value;

    if (currentWeather === "sunny") {

        weatherStatus.innerHTML = "☀️ Normal Weather Conditions";
        weatherDetails.innerHTML = "Traffic is operating under normal weather conditions.";
        weatherStatus.style.background = "#dcfce7";
        weatherStatus.style.color = "#166534";

    }

    else if (currentWeather === "rainy") {

        weatherStatus.innerHTML = "🌧️ Rain Alert: Drive Slowly!";
        weatherDetails.innerHTML = "Rain detected. Traffic speed is reduced by 35%.";
        weatherStatus.style.background = "#fef3c7";
        weatherStatus.style.color = "#92400e";

    }

    else if (currentWeather === "foggy") {

        weatherStatus.innerHTML = "🌫️ Fog Alert: Low Visibility!";
        weatherDetails.innerHTML = "Fog detected. Traffic speed is reduced by 55%. Drive carefully.";
        weatherStatus.style.background = "#fee2e2";
        weatherStatus.style.color = "#991b1b";

    }

    updateDashboardStats();

});
