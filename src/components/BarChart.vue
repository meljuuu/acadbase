<template>
    <canvas ref="barChartCanvas"></canvas>
  </template>
  
  <script>
  import { defineComponent, onMounted, ref } from "vue";
  import Chart from "chart.js/auto";
  
  export default defineComponent({
    setup() {
      const barChartCanvas = ref(null);
  
      onMounted(() => {
        if (barChartCanvas.value) {
          new Chart(barChartCanvas.value, {
            type: "bar",
            data: {
              labels: [
                "JHS Male Students",
                "JHS Female Students",
                "SHS Female Students",
                "SHS Male Students",
              ],
              datasets: [
                {
                  label: "Number of Students",
                  data: [80, 180, 140, 300], 
                  backgroundColor: "#1E3A8A",
                  borderRadius: 5, 
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 50 },
                },
              },
            },
          });
        }
      });
  
      return { barChartCanvas };
    },
  });
  </script>
  
  
  <style scoped>
  .bar-chart-container {
    width: 100%;
    max-width: 500px;
    height: 390px;
    margin: auto;
    border-radius: 8px;

    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  .chart-title {
    font-size: 18px;
    font-weight: bold;
    text-align: left;
  }
  .chart-subtitle {
    font-size: 14px;
    text-align: center;
    color: gray;
    margin-bottom: 8px;
  }
  </style>
  