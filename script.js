
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

    const roads = ["north", "south", "east", "west"];

    function moveCars() {

        cars.forEach((car, index) => {

            if (index < 3) {

                positions[index] += 2;

                if (positions[index] > 95) {
                    positions[index] = 0;
                }

                car.style.left = positions[index] + "%";

            } else {

                positions[index] += 2;

                if (positions[index] > 90) {
                    positions[index] = 0;
                }

                car.style.top = positions[index] + "%";

            }

        });

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

    }

    function getHighestTrafficRoad() {

        return roads.reduce((highest, road) => {

            return densities[road] > densities[highest]
                ? road
                : highest;

        }, roads[0]);

    }

    function smartTrafficControl() {

        activeRoad = getHighestTrafficRoad();

        const highestDensity = densities[activeRoad];

        const greenTime = Math.min(
            60,
            Math.max(15, highestDensity * 3)
        );

        return greenTime;

    }

    function setAllRed() {

        lights.forEach(light => {

            const bulbs = light.querySelectorAll("span");

            bulbs.forEach(bulb => {
                bulb.className = "";
            });

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

        smartStatus.textContent =
            activeRoad.toUpperCase() +
            " GREEN - " + greenTime + " sec";

        signalTimer = setTimeout(() => {

            if (!running) return;

            activeBulbs[2].className = "";
            activeBulbs[1].className = "light-yellow";

            smartStatus.textContent =
                activeRoad.toUpperCase() + " YELLOW";

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

        statusBox.innerHTML =
            '<span class="online-dot"></span> Simulation Running';

        startBtn.textContent = "⏸ Stop Simulation";

        updateDensity();

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

        statusBox.innerHTML =
            '<span class="red-dot"></span> Simulation Paused';

        startBtn.textContent = "▶ Start Simulation";

        smartStatus.textContent = "Paused";

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

    }

    startBtn.addEventListener("click", startSimulation);

    resetBtn.addEventListener("click", resetSimulation);

    setAllRed();

    console.log("Smart Traffic Simulator Loaded Successfully");

});
