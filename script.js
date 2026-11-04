
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

    const activeVehiclesElement = document.getElementById("activeVehicles");
    const averageSpeedElement = document.getElementById("averageSpeed");
    const trafficDensityElement = document.getElementById("trafficDensity");
    const activeSignalsElement = document.getElementById("activeSignals");

    let running = false;
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
    const graphLine = document.getElementById("trafficGraphLine");
const graphArea = document.getElementById("trafficGraphArea");

let graphValues = [145, 120, 132, 70, 90, 45, 65, 20, 40];

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

    function updateDashboardStats() {
        const totalDensity = roads.reduce((sum, road) => {
            return sum + densities[road];
        }, 0);

        const averageDensity = totalDensity / roads.length;

        const trafficPercentage = Math.round((averageDensity / 20) * 100);

        const averageSpeed = running
            ? Math.max(10, Math.round(60 - averageDensity * 2))
            : 0;

        activeVehiclesElement.textContent = cars.length;
        averageSpeedElement.textContent = averageSpeed;
        trafficDensityElement.textContent = trafficPercentage + "%";
        activeSignalsElement.textContent = lights.length;
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

        smartStatus.textContent = activeRoad.toUpperCase() + " GREEN - " + greenTime + " sec";

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
    }

    function resetSimulation() {
        stopSimulation();

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

        setAllRed();

        smartStatus.textContent = "Waiting";

        updateDashboardStats();
        graphValues = [145, 120, 132, 70, 90, 45, 65, 20, 40];

graphLine.setAttribute(
    "points",
    graphValues.map((value, index) => `${index * 50},${value}`).join(" ")
);

graphArea.setAttribute(
    "d",
    "M0,145 L50,120 L100,132 L150,70 L200,90 L250,45 L300,65 L350,20 L400,40 L400,180 L0,180 Z"
);
    }

    startBtn.addEventListener("click", startSimulation);

    resetBtn.addEventListener("click", resetSimulation);

    setAllRed();

    updateDashboardStats();

    console.log("Smart Traffic Simulator Loaded Successfully");

});
