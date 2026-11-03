document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.querySelector(".start-btn");
    const resetBtn = document.querySelector(".reset-btn");
    const statusBox = document.querySelector(".status");

    const cars = document.querySelectorAll(".car");
    const lights = document.querySelectorAll(".traffic-light");

    let running = false;
    let movement;
    let signalTimer;

    let positions = [
        8, 48, 82, 4, 48, 50
    ];

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

    function changeSignals() {

        lights.forEach((light, index) => {

            const bulbs = light.querySelectorAll("span");

            bulbs.forEach(bulb => {
                bulb.className = "";
            });

            const state = Math.floor(Math.random() * 3);

            if (state === 0) {
                bulbs[0].className = "light-red";
            } else if (state === 1) {
                bulbs[1].className = "light-yellow";
            } else {
                bulbs[2].className = "light-green";
            }

        });

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

        movement = setInterval(moveCars, 300);
        signalTimer = setInterval(changeSignals, 3000);

    }

    function stopSimulation() {

        running = false;

        clearInterval(movement);
        clearInterval(signalTimer);

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

        changeSignals();

    }

    startBtn.addEventListener("click", startSimulation);

    resetBtn.addEventListener("click", resetSimulation);

    console.log("Traffic Simulator Loaded Successfully");

});