
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
    let movement;
    let signalTimer;
    let densityTimer;

    let positions = [8, 48, 82, 4, 48, 50];

    let densities = {
        north: 0,
        south: 0,
        east: 0,
        west: 0
    };

    let activeRoad = "north";

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

        densities.north = Math.floor(Math.random() * 15) + 5;
        densities.south = Math.floor(Math.random() * 15) + 5;
        densities.east = Math.floor(Math.random() * 15) + 5;
        densities.west = Math.floor(Math.random() * 15) + 5;

        densityElements.north.textContent = densities.north + " Vehicles";
        densityElements.south.textContent = densities.south + " Vehicles";
        densityElements.east.textContent = densities.east + " Vehicles";
        densityElements.west.textContent = densities.west + " Vehicles";

        Object.keys(densities).forEach(road => {

            const value = densities[road];
            const element = densityElements[road];

            element.className = "badge";

            if (value >= 15) {
                element.classList.add("red-badge");
            } else if (value >= 10) {
                element.classList.add("yellow-badge");
            } else {
                element.classList.add("green-badge");
            }

        });

        smartTrafficControl();
    }

    function smartTrafficControl() {

        const roads = Object.keys(densities);

        activeRoad = roads.reduce((highest, road) => {
            return densities[road] > densities[highest] ? road : highest;
        }, roads[0]);

        const highestDensity = densities[activeRoad];

        const greenTime = Math.min(60, Math.max(15, highestDensity * 3));

        smartStatus.textContent =
            activeRoad.toUpperCase() + " GREEN - " + greenTime + " sec";

        smartStatus.style.color = "#22d3ee";

        return greenTime;
    }

    function changeSignals() {

        const greenTime = smartTrafficControl();

        lights.forEach((light, index) => {

            const bulbs = light.querySelectorAll("span");

            bulbs.forEach(bulb => {
                bulb.className = "";
            });

            if (index === 0) {
                bulbs[2].className = "light-green";
            } else {
                bulbs[0].className = "light-red";
            }

        });

        const activeLight = lights[0];
        const bulbs = activeLight.querySelectorAll("span");

        clearTimeout(signalTimer);

        bulbs.forEach(bulb => {
            bulb.className = "";
        });

        bulbs[2].className = "light-green";

        signalTimer = setTimeout(() => {

            bulbs[2].className = "";
            bulbs[1].className = "light-yellow";

            setTimeout(() => {

                bulbs[1].className = "";
                bulbs[0].className = "light-red";

                updateDensity();

                if (running) {
                    changeSignals();
                }

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

        statusBox.innerHTML =
            '<span class="red-dot"></span> Simulation Paused';

        startBtn.textContent = "▶ Start Simulation";
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

        Object.keys(densities).forEach(road => {
            densities[road] = 0;
            densityElements[road].textContent = "0 Vehicles";
            densityElements[road].className = "badge";
        });

        smartStatus.textContent = "Waiting";
        smartStatus.style.color = "";

        lights.forEach(light => {

            const bulbs = light.querySelectorAll("span");

            bulbs.forEach(bulb => {
                bulb.className = "";
            });

            bulbs[0].className = "light-red";
        });
    }

    startBtn.addEventListener("click", startSimulation);

    resetBtn.addEventListener("click", resetSimulation);

    console.log("Smart Traffic Simulator Loaded Successfully");

});
