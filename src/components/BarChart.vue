<template>
  <canvas ref="barChartCanvas"></canvas>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";

export default defineComponent({
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const barChartCanvas = ref(null);
    let chartInstance = null;

    const renderChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
      if (barChartCanvas.value && props.chartData) {
        chartInstance = new Chart(barChartCanvas.value, {
          type: "bar",
          data: props.chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
              },
            },
          },
        });
      }
    };

    onMounted(() => {
      renderChart();
    });

    watch(
      () => props.chartData,
      () => {
        renderChart();
      },
      { deep: true }
    );

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
