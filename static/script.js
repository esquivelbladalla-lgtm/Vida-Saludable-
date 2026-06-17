
// ================================
// VIDA SALUDABLE DASHBOARD
// ================================

let waterConsumed = 0;
let waterGoal = 2000;
let waterHistory = [];
let bmiHistory = [];
let streak = 0;

const weightSlider = document.getElementById("weightSlider");
const heightSlider = document.getElementById("heightSlider");

const weightInput = document.getElementById("weightInput");
const heightInput = document.getElementById("heightInput");

const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");
const bmiAdvice = document.getElementById("bmiAdvice");
const bmiBar = document.getElementById("bmiBar");

const waterFill = document.getElementById("waterFill");
const waterPercentage = document.getElementById("waterPercentage");
const currentWater = document.getElementById("currentWater");
const waterGoalInput = document.getElementById("waterGoal");
const todayWater = document.getElementById("todayWater");

const historyTable = document.getElementById("historyTable");

const achievementEarly =
    document.getElementById("achievementEarly");

const achievementHydration =
    document.getElementById("achievementHydration");

const achievementStreak =
    document.getElementById("achievementStreak");

const streakCounter =
    document.getElementById("streakCounter");

const miniIMC =
    document.getElementById("miniIMC");

let chart;

// ==================================
// LOCAL STORAGE
// ==================================

function saveData() {

    localStorage.setItem(
        "waterConsumed",
        waterConsumed
    );

    localStorage.setItem(
        "waterGoal",
        waterGoal
    );

    localStorage.setItem(
        "waterHistory",
        JSON.stringify(waterHistory)
    );

    localStorage.setItem(
        "bmiHistory",
        JSON.stringify(bmiHistory)
    );

    localStorage.setItem(
        "streak",
        streak
    );

}

function loadData() {

    const savedWater =
        localStorage.getItem("waterConsumed");

    const savedGoal =
        localStorage.getItem("waterGoal");

    const savedHistory =
        localStorage.getItem("waterHistory");

    const savedBMI =
        localStorage.getItem("bmiHistory");

    const savedStreak =
        localStorage.getItem("streak");

    if (savedWater) {

        waterConsumed =
            parseInt(savedWater);

    }

    if (savedGoal) {

        waterGoal =
            parseInt(savedGoal);

    }

    if (savedHistory) {

        waterHistory =
            JSON.parse(savedHistory);

    }

    if (savedBMI) {

        bmiHistory =
            JSON.parse(savedBMI);

    }

    if (savedStreak) {

        streak =
            parseInt(savedStreak);

    }

    waterGoalInput.value =
        waterGoal;

}

// ==================================
// BMI
// ==================================

function calculateBMI() {

    const weight =
        parseFloat(weightInput.value);

    const height =
        parseFloat(heightInput.value) / 100;

    if (
        !weight ||
        !height
    ) {
        return;
    }

    const bmi =
        weight /
        (height * height);

    bmiValue.textContent =
        bmi.toFixed(1);

    miniIMC.textContent =
        bmi.toFixed(1);

    let category = "";
    let color = "";
    let advice = "";

    if (bmi < 18.5) {

        category = "Bajo peso";

        color = "#60a5fa";

        advice =
            "Aumenta gradualmente tu ingesta de alimentos nutritivos y consulta a un especialista.";

        bmiBar.style.width = "25%";

    }

    else if (bmi < 25) {

        category = "Normal";

        color = "#10b981";

        advice =
            "Excelente trabajo. Mantén una alimentación equilibrada y actividad física regular.";

        bmiBar.style.width = "50%";

    }

    else if (bmi < 30) {

        category = "Sobrepeso";

        color = "#facc15";

        advice =
            "Pequeños cambios diarios pueden ayudarte a mejorar tu salud y energía.";

        bmiBar.style.width = "75%";

    }

    else {

        category = "Obesidad";

        color = "#ef4444";

        advice =
            "Considera apoyo profesional para crear hábitos saludables sostenibles.";

        bmiBar.style.width = "100%";

    }

    bmiCategory.textContent =
        category;

    bmiCategory.style.color =
        color;

    bmiAdvice.textContent =
        advice;

    bmiBar.style.background =
        color;

    const record = {

        date:
            new Date().toLocaleDateString(),

        bmi:
            bmi.toFixed(1)

    };

    bmiHistory.push(record);

    if (bmiHistory.length > 30) {

        bmiHistory.shift();

    }

    saveData();
    updateStatistics();

}

// ==================================
// SYNC SLIDERS
// ==================================

weightSlider.addEventListener(
    "input",
    () => {

        weightInput.value =
            weightSlider.value;

        calculateBMI();

    }
);

heightSlider.addEventListener(
    "input",
    () => {

        heightInput.value =
            heightSlider.value;

        calculateBMI();

    }
);

weightInput.addEventListener(
    "input",
    () => {

        weightSlider.value =
            weightInput.value;

        calculateBMI();

    }
);

heightInput.addEventListener(
    "input",
    () => {

        heightSlider.value =
            heightInput.value;

        calculateBMI();

    }
);

// ==================================
// WATER
// ==================================

function updateWaterUI() {

    const percentage =
        Math.min(
            (waterConsumed / waterGoal) * 100,
            100
        );

    waterFill.style.height =
        percentage + "%";

    waterPercentage.textContent =
        Math.round(percentage) + "%";

    currentWater.textContent =
        waterConsumed + " ml";

    todayWater.textContent =
        waterConsumed + " ml";

    checkAchievements();

    saveData();

}

function addWater(amount) {

    waterConsumed += amount;

    const now =
        new Date();

    const item = {

        date:
            now.toLocaleDateString(),

        time:
            now.toLocaleTimeString(),

        amount:
            amount

    };

    waterHistory.unshift(item);

    updateHistory();

    updateWaterUI();

    updateChart();

}

document
    .getElementById("glassBtn")
    .addEventListener(
        "click",
        () => {

            addWater(250);

        }
    );

document
    .getElementById("bottleBtn")
    .addEventListener(
        "click",
        () => {

            addWater(500);

        }
    );

document
    .getElementById("customAddBtn")
    .addEventListener(
        "click",
        () => {

            const value =
                parseInt(
                    document.getElementById(
                        "customWater"
                    ).value
                );

            if (
                value &&
                value > 0
            ) {

                addWater(value);

                document.getElementById(
                    "customWater"
                ).value = "";

            }

        }
    );

// ==================================
// GOAL
// ==================================

waterGoalInput.addEventListener(
    "change",
    () => {

        waterGoal =
            parseInt(
                waterGoalInput.value
            );

        updateWaterUI();

    }
);

// ==================================
// HISTORY TABLE
// ==================================

function updateHistory() {

    historyTable.innerHTML = "";

    waterHistory.forEach(item => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${item.date}</td>
            <td>${item.time}</td>
            <td>${item.amount} ml</td>
        `;

        historyTable.appendChild(row);

    });

}

// ==================================
// ACHIEVEMENTS
// ==================================

function checkAchievements() {

    const percentage =
        (waterConsumed / waterGoal) * 100;

    if (
        percentage >= 100
    ) {

        achievementHydration.classList.add(
            "unlocked"
        );

        streak++;

        streakCounter.textContent =
            streak + " días";

    }

    const hour =
        new Date().getHours();

    if (
        hour < 9 &&
        waterConsumed > 0
    ) {

        achievementEarly.classList.add(
            "unlocked"
        );

    }

    if (
        streak >= 3
    ) {

        achievementStreak.classList.add(
            "unlocked"
        );

    }

}

// ==================================
// HEALTH SCORE
// ==================================

function updateHealthScore() {

    const bmi =
        parseFloat(
            bmiValue.textContent
        );

    let score = 5;

    if (
        bmi >= 18.5 &&
        bmi <= 24.9
    ) {

        score += 2;

    }

    const waterFactor =
        Math.min(
            waterConsumed /
                waterGoal,
            1
        ) * 3;

    score += waterFactor;

    document.getElementById(
        "healthScore"
    ).textContent =
        score.toFixed(1);

}

// ==================================
// CHART
// ==================================

function updateChart() {

    const labels =
        waterHistory
        .slice(0, 7)
        .reverse()
        .map(item =>
            item.date
        );

    const data =
        waterHistory
        .slice(0, 7)
        .reverse()
        .map(item =>
            item.amount
        );

    const ctx =
        document
        .getElementById(
            "waterChart"
        );

    if (chart) {

        chart.destroy();

    }

    chart =
        new Chart(ctx, {

            type: "line",

            data: {

                labels,

                datasets: [

                    {

                        label:
                            "Consumo de Agua",

                        data,

                        borderColor:
                            "#0ea5e9",

                        backgroundColor:
                            "rgba(14,165,233,0.15)",

                        borderWidth: 4,

                        tension: 0.4,

                        fill: true

                    }

                ]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        });

}

function updateStatistics(){

    document.getElementById("statBMI").textContent =
        bmiValue.textContent;

    document.getElementById("statWater").textContent =
        waterConsumed + " ml";

    document.getElementById("statGoal").textContent =
        waterGoal + " ml";

    const progress =
        Math.round(
            (waterConsumed / waterGoal) * 100
        );

    document.getElementById("statProgress").textContent =
        progress + "%";

}

// ==================================
// INIT
// ==================================

function init() {

    loadData();

    calculateBMI();

    updateWaterUI();
    updateStatistics();
    updateHistory();

    updateChart();

    updateHealthScore();

    streakCounter.textContent =
        streak + " días";

}

init();

// ==================================
// AUTO SCORE
// ==================================

setInterval(() => {

    updateHealthScore();

}, 1000);
