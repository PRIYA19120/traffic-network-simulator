
document.addEventListener("DOMContentLoaded", function () {

    const startBtn = document.querySelector(".start-btn");
    const resetBtn = document.querySelector(".reset-btn");
    const statusBox = document.querySelector(".status");
    const map = document.querySelector(".map");

    const cars = document.querySelectorAll(".car");
    const lights = document.querySelectorAll(".traffic-light");

    const activeVehicles = document.getElementById("activeVehicles");
    const averageSpeed = document.getElementById("averageSpeed");
    const trafficDensity = document.getElementById("trafficDensity");
    const activeSignals = document.getElementById("activeSignals");

    const smartStatus = document.getElementById("smartStatus");

    const weatherCity = document.getElementById("weatherCity");
    const getWeather = document.getElementById("getWeather");
    const weatherStatus = document.getElementById("weatherStatus");
    const weatherDetails = document.getElementById("weatherDetails");
    const weatherTemp = document.getElementById("weatherTemp");
    const weatherHumidity = document.getElementById("weatherHumidity");
    const weatherWind = document.getElementById("weatherWind");
    const weatherConditionText = document.getElementById("weatherConditionText");

    let simulationRunning = false;
    let simulationInterval = null;
    let dashboardInterval = null;
    let signalInterval = null;

    let signalTimer = 0;
    let currentWeather = "sunny";
    let emergencyActive = false;
    let accidentActive = false;

    let densityValues = {
        north: 0,
        south: 0,
        east: 0,
        west: 0
    };

    let graphValues = [145, 120, 132, 70, 90, 45, 65, 20, 40];

    const carPositions = [
        { x: -5, y: 35, direction: "right", speed: 0.65 },
        { x: 105, y: 42, direction: "left", speed: 0.55 },
        { x: 35, y: -5, direction: "down", speed: 0.50 },
        { x: 65, y: 105, direction: "up", speed: 0.60 },
        { x: -15, y: 58, direction: "right", speed: 0.45 },
        { x: 115, y: 65, direction: "left", speed: 0.50 }
    ];

    const originalCarPositions = carPositions.map(car => ({ ...car }));

    function setCarPositions() {
        cars.forEach((car, index) => {
            const position = carPositions[index];

            if (!position) return;

            car.style.position = "absolute";
            car.style.left = position.x + "%";
            car.style.top = position.y + "%";
            car.style.transform = "translate(-50%, -50%)";

            if (position.direction === "up" || position.direction === "down") {
                car.style.transform += " rotate(90deg)";
            }
        });
    }

    function moveCars() {
        cars.forEach((car, index) => {

            const position = carPositions[index];

            if (!position) return;

            let speed = position.speed * 0.3;

            if (currentWeather === "rainy") {
                speed *= 0.65;
            } else if (currentWeather === "foggy") {
                speed *= 0.45;
            } else if (currentWeather === "snowy") {
                speed *= 0.50;
            }

            if (accidentActive) {
                speed *= 0.45;
            }

            if (emergencyActive && index === 0) {
                speed *= 1.8;
            }

            if (position.direction === "right") {
                position.x += speed;
                if (position.x > 105) position.x = -5;
            }

            if (position.direction === "left") {
                position.x -= speed;
                if (position.x < -5) position.x = 105;
            }

            if (position.direction === "down") {
                position.y += speed;
                if (position.y > 105) position.y = -5;
            }

            if (position.direction === "up") {
                position.y -= speed;
                if (position.y < -5) position.y = 105;
            }

            car.style.left = position.x + "%";
            car.style.top = position.y + "%";
            car.style.transform = "translate(-50%, -50%)";

            if (position.direction === "up" || position.direction === "down") {
                car.style.transform += " rotate(90deg)";
            }
        });
    }

    function changeSignalState(index, state) {
        const light = lights[index];

        if (!light) return;

        const bulbs = light.querySelectorAll("span");

        bulbs.forEach(bulb => {
            bulb.classList.remove("light-red", "light-yellow", "light-green");
        });

        if (state === "red") {
            bulbs[0]?.classList.add("light-red");
        } else if (state === "yellow") {
            bulbs[1]?.classList.add("light-yellow");
        } else {
            bulbs[2]?.classList.add("light-green");
        }
    }

    function updateSignalRows() {
        const rows = document.querySelectorAll("#signals .signal-row");

        const states = [
            ["red", "Red"],
            ["green", "Green"],
            ["yellow", "Yellow"],
            ["red", "Red"]
        ];

        rows.forEach((row, index) => {
            const badge = row.querySelector(".badge");
            const symbol = row.querySelector(".signal-symbol");

            if (!badge || !symbol || !states[index]) return;

            const state = states[index][0];
            const label = states[index][1];

            badge.textContent = label;
            badge.className = "badge " + state + "-badge";
            symbol.className = "signal-symbol " + state + "-signal";
        });
    }

    function updateSignals() {

        if (emergencyActive) {
            const emergencyRoad = document.getElementById("emergencyRoad")?.value;

            const roadIndex = {
                north: 0,
                south: 1,
                east: 2,
                west: 3
            };

            const priorityIndex = roadIndex[emergencyRoad];

            lights.forEach((light, index) => {
                if (index === priorityIndex) {
                    changeSignalState(index, "green");
                } else {
                    changeSignalState(index, "red");
                }
            });

            if (smartStatus) {
                smartStatus.textContent = "Emergency Priority Active";
            }

            return;
        }

        signalTimer++;

        const phase = Math.floor(signalTimer / 5) % 3;

        const states = [
            ["green", "red", "red", "red"],
            ["yellow", "red", "red", "red"],
            ["red", "green", "yellow", "red"]
        ];

        states[phase].forEach((state, index) => {
            changeSignalState(index, state);
        });

        updateSignalRows();

        if (simulationRunning && smartStatus) {
            smartStatus.textContent = "Automatic Signal Control";
        }
    }

    function updateDensity() {

        const roads = ["north", "south", "east", "west"];

        roads.forEach(road => {

            densityValues[road] = Math.floor(Math.random() * 25) + 5;

            if (accidentActive) {
                const accidentRoad = document.getElementById("accidentRoad")?.value;

                if (road === accidentRoad) {
                    densityValues[road] = Math.floor(Math.random() * 30) + 70;
                }
            }
        });

        if (emergencyActive) {
            const emergencyRoad = document.getElementById("emergencyRoad")?.value;

            if (emergencyRoad) {
                densityValues[emergencyRoad] = Math.max(
                    5,
                    densityValues[emergencyRoad] - 10
                );
            }
        }

        const totalDensity = roads.reduce((sum, road) => {
            return sum + densityValues[road];
        }, 0);

        const averageDensity = Math.round(totalDensity / roads.length);

        if (trafficDensity) {
            trafficDensity.textContent = averageDensity + "%";
        }

        const progress = document.querySelector(".progress-fill");

        if (progress) {
            progress.style.width = averageDensity + "%";
        }

        roads.forEach(road => {

            const element = document.getElementById(road + "Density");
            const congestion = document.getElementById(road + "Congestion");

            const value = densityValues[road];

            if (element) {
                element.textContent = value + " Vehicles";

                element.className = "badge " +
                    (value >= 70 ? "red-badge" :
                        value >= 40 ? "yellow-badge" : "green-badge");
            }

            if (congestion) {

                let condition = "Smooth";
                let className = "smooth";

                if (value >= 70) {
                    condition = "Heavy";
                    className = "heavy";
                } else if (value >= 40) {
                    condition = "Moderate";
                    className = "moderate";
                }

                congestion.textContent = condition;
                congestion.className = "congestion-badge " + className;
            }
        });

        updateCongestionAlert();
    }

    function updateCongestionAlert() {

        const alertBox = document.getElementById("congestionAlert");

        if (!alertBox) return;

        const roads = ["north", "south", "east", "west"];

        const heavyRoads = roads.filter(road => densityValues[road] >= 70);

        const moderateRoads = roads.filter(road => {
            return densityValues[road] >= 40 && densityValues[road] < 70;
        });

        if (heavyRoads.length > 0) {
            alertBox.innerHTML = `
                <span>🔴</span>
                <strong>Heavy Congestion: ${heavyRoads.join(", ")}</strong>
            `;
        } else if (moderateRoads.length > 0) {
            alertBox.innerHTML = `
                <span>🟡</span>
                <strong>Moderate Traffic Detected</strong>
            `;
        } else {
            alertBox.innerHTML = `
                <span>🟢</span>
                <strong>All Roads Normal</strong>
            `;
        }
    }

    function updateDashboardStats() {

        const moving = simulationRunning ? cars.length : 0;
        const stopped = cars.length - moving;

        if (activeVehicles) {
            activeVehicles.textContent =
                (1248 + (simulationRunning ? Math.floor(Math.random() * 30) : 0))
                .toLocaleString("en-IN");
        }

        if (averageSpeed) {

            let speed = 32;

            if (currentWeather === "rainy") speed *= 0.65;
            if (currentWeather === "foggy") speed *= 0.45;
            if (currentWeather === "snowy") speed *= 0.50;
            if (accidentActive) speed *= 0.70;

            averageSpeed.textContent = Math.round(speed);
        }

        if (activeSignals) {
            activeSignals.textContent = emergencyActive ? "1" : "12";
        }

        const movingElement = document.getElementById("movingVehicles");
        const stoppedElement = document.getElementById("stoppedVehicles");
        const totalElement = document.getElementById("totalVehicles");

        if (movingElement) movingElement.textContent = moving;
        if (stoppedElement) stoppedElement.textContent = stopped;
        if (totalElement) totalElement.textContent = cars.length;

        cars.forEach((car, index) => {

            const vehicleStatus = document.getElementById("vehicleStatus" + (index + 1));

            if (vehicleStatus) {
                vehicleStatus.textContent = simulationRunning ? "Moving" : "Stopped";
                vehicleStatus.style.color = simulationRunning ? "#16a34a" : "#64748b";
            }
        });
    }

    function updateGraph() {

        graphValues.shift();
        graphValues.push(Math.floor(Math.random() * 130) + 20);

        const points = graphValues.map((value, index) => {
            return `${index * 50},${value}`;
        }).join(" ");

        const line = document.getElementById("trafficGraphLine");
        const area = document.getElementById("trafficGraphArea");

        if (line) {
            line.setAttribute("points", points);
        }

        if (area) {
            area.setAttribute(
                "d",
                `M${points.replaceAll(" ", " L")} L400,180 L0,180 Z`
            );
        }
    }

    function startSimulation() {

        if (simulationRunning) return;

        simulationRunning = true;

        if (startBtn) {
            startBtn.textContent = "⏸ Stop Simulation";
            startBtn.style.background = "#dc2626";
        }

        if (statusBox) {
            statusBox.innerHTML = '<span style="color:#16a34a">●</span> Simulation Running';
        }

        if (map) {
            map.classList.add("simulation-running");
        }

        updateDashboardStats();

        simulationInterval = setInterval(() => {
            moveCars();
        }, 100);

        dashboardInterval = setInterval(() => {
            updateDensity();
            updateDashboardStats();
            updateGraph();
        }, 4000);

        signalInterval = setInterval(updateSignals, 2000);

        if (smartStatus) {
            smartStatus.textContent = "Smart Control Active";
        }
    }

    function stopSimulation() {

        simulationRunning = false;

        clearInterval(simulationInterval);
        clearInterval(dashboardInterval);
        clearInterval(signalInterval);

        simulationInterval = null;
        dashboardInterval = null;
        signalInterval = null;

        if (startBtn) {
            startBtn.textContent = "▶ Start Simulation";
            startBtn.style.background = "";
        }

        if (statusBox) {
            statusBox.innerHTML = '<span style="color:#dc2626">●</span> Simulation Paused';
        }

        if (map) {
            map.classList.remove("simulation-running");
        }

        if (smartStatus) {
            smartStatus.textContent = "Waiting";
        }

        updateDashboardStats();
    }

    function resetSimulation() {

        stopSimulation();

        signalTimer = 0;

        carPositions.forEach((position, index) => {
            Object.assign(position, originalCarPositions[index]);
        });

        setCarPositions();

        densityValues = {
            north: 0,
            south: 0,
            east: 0,
            west: 0
        };

        updateDensity();
        updateSignals();
        updateDashboardStats();

        if (trafficDensity) {
            trafficDensity.textContent = "68%";
        }

        if (averageSpeed) {
            averageSpeed.textContent = "32";
        }

        graphValues = [145, 120, 132, 70, 90, 45, 65, 20, 40];

        updateGraph();
    }

    // Emergency Vehicle Priority

    const emergencyToggle = document.getElementById("emergencyToggle");
    const emergencyStatus = document.getElementById("emergencyStatus");

    if (emergencyToggle) {

        emergencyToggle.addEventListener("click", function () {

            emergencyActive = !emergencyActive;

            if (emergencyActive) {
                emergencyToggle.textContent = "Deactivate Emergency";
                emergencyToggle.style.background = "#dc2626";

                if (emergencyStatus) {
                    emergencyStatus.textContent = "Emergency Mode: ON";
                    emergencyStatus.style.color = "#dc2626";
                }
            } else {
                emergencyToggle.textContent = "Activate Emergency";
                emergencyToggle.style.background = "";

                if (emergencyStatus) {
                    emergencyStatus.textContent = "Emergency Mode: OFF";
                    emergencyStatus.style.color = "";
                }
            }

            updateSignals();
            updateDashboardStats();
        });
    }

    // Accident Detection

    const detectAccident = document.getElementById("detectAccident");
    const clearAccident = document.getElementById("clearAccident");
    const accidentRoad = document.getElementById("accidentRoad");
    const accidentAlert = document.getElementById("accidentAlert");
    const accidentDetails = document.getElementById("accidentDetails");

    if (detectAccident) {

        detectAccident.addEventListener("click", function () {

            accidentActive = true;

            const road = accidentRoad?.value || "north";

            if (accidentAlert) {
                accidentAlert.innerHTML = `
                    <span>🔴</span> Accident Reported on ${road.toUpperCase()} Road
                `;

                accidentAlert.style.background = "#fee2e2";
                accidentAlert.style.color = "#991b1b";
            }

            if (accidentDetails) {
                accidentDetails.textContent =
                    "Alert: Traffic movement reduced on " + road +
                    " road. Emergency monitoring activated.";
            }

            updateDensity();
            updateDashboardStats();
        });
    }

    if (clearAccident) {

        clearAccident.addEventListener("click", function () {

            accidentActive = false;

            if (accidentAlert) {
                accidentAlert.innerHTML = `
                    <span>🟢</span> No Accident Detected
                `;

                accidentAlert.style.background = "";
                accidentAlert.style.color = "";
            }

            if (accidentDetails) {
                accidentDetails.textContent = "All roads are operating normally.";
            }

            updateDensity();
            updateDashboardStats();
        });
    }

    // Live Weather

    async function updateWeather() {

        const city = weatherCity?.value.trim();

        if (!city) {
            if (weatherStatus) {
                weatherStatus.textContent = "Please enter a city name.";
            }
            return;
        }

        if (getWeather) getWeather.disabled = true;

        if (weatherStatus) weatherStatus.textContent = "⏳ Loading weather data...";
        if (weatherDetails) weatherDetails.textContent = "Please wait...";

        try {

            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
            );

            if (!geoResponse.ok) {
                throw new Error("Location search failed.");
            }

            const geoData = await geoResponse.json();

            if (!geoData.results || geoData.results.length === 0) {
                throw new Error("City not found. Try another city.");
            }

            const location = geoData.results[0];

            const weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
            );

            if (!weatherResponse.ok) {
                throw new Error("Weather data unavailable.");
            }

            const weatherData = await weatherResponse.json();
            const current = weatherData.current;

            if (!current) {
                throw new Error("Current weather data not found.");
            }

            const code = Number(current.weather_code);

            let condition = "Unknown";
            let icon = "🌤️";

            currentWeather = "sunny";

            if (code === 0) {
                condition = "Clear Sky";
                icon = "☀️";
                currentWeather = "sunny";
            } else if (code === 1) {
                condition = "Mainly Clear";
                icon = "🌤️";
                currentWeather = "sunny";
            } else if (code === 2) {
                condition = "Partly Cloudy";
                icon = "⛅";
                currentWeather = "cloudy";
            } else if (code === 3) {
                condition = "Overcast";
                icon = "☁️";
                currentWeather = "cloudy";
            } else if ([45, 48].includes(code)) {
                condition = "Foggy";
                icon = "🌫️";
                currentWeather = "foggy";
            } else if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) {
                condition = "Rainy";
                icon = "🌧️";
                currentWeather = "rainy";
            } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
                condition = "Snowy";
                icon = "❄️";
                currentWeather = "snowy";
            }

            if (weatherStatus) {
                weatherStatus.textContent = `${icon} ${location.name}, ${location.country}`;
            }

            if (weatherDetails) {
                weatherDetails.textContent = "Live weather updated successfully.";
            }

            if (weatherTemp) {
                weatherTemp.textContent = `${current.temperature_2m ?? "--"} °C`;
            }

            if (weatherHumidity) {
                weatherHumidity.textContent = `${current.relative_humidity_2m ?? "--"}%`;
            }

            if (weatherWind) {
                weatherWind.textContent = `${current.wind_speed_10m ?? "--"} km/h`;
            }

            if (weatherConditionText) {
                weatherConditionText.textContent = `${condition} ${icon}`;
            }

            if (weatherStatus) {
                if (currentWeather === "rainy") {
                    weatherStatus.style.background = "#dbeafe";
                    weatherStatus.style.color = "#1d4ed8";
                } else if (currentWeather === "foggy") {
                    weatherStatus.style.background = "#e5e7eb";
                    weatherStatus.style.color = "#374151";
                } else if (currentWeather === "snowy") {
                    weatherStatus.style.background = "#e0f2fe";
                    weatherStatus.style.color = "#075985";
                } else {
                    weatherStatus.style.background = "#dcfce7";
                    weatherStatus.style.color = "#166534";
                }
            }

            updateDashboardStats();

        } catch (error) {

            if (weatherStatus) weatherStatus.textContent = "⚠️ Weather Error";
            if (weatherDetails) weatherDetails.textContent = error.message;

            console.error("Weather Error:", error);

        } finally {

            if (getWeather) getWeather.disabled = false;
        }
    }

    if (getWeather) {
        getWeather.addEventListener("click", updateWeather);
    }

    if (weatherCity) {
        weatherCity.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                updateWeather();
            }
        });
    }

    // Button Events

    if (startBtn) {
        startBtn.addEventListener("click", function () {
            if (simulationRunning) {
                stopSimulation();
            } else {
                startSimulation();
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener("click", resetSimulation);
    }

    // Initial Setup

    setCarPositions();
    updateDensity();
    updateSignals();
    updateDashboardStats();

    if (weatherCity && getWeather) {
        updateWeather();
    }

});
