  <template>
    <div class="dropdown-container">
      <!-- <select
        v-if="showCurriculum"
        v-model="selectedCurriculum"
        class="filter-dropdown"
        @change="$emit('update:selectedCurriculum', selectedCurriculum)"
      >
        <option disabled value="">Curriculum</option>
        <option v-for="curriculum in curriculums" :key="curriculum">
          {{ curriculum }}
        </option>
      </select> -->

      <select
         v-if="showYear"
  v-model="selectedYear"
  class="filter-dropdown"
  @change="$emit('update:selectedYear', selectedYear)"
>
  <option disabled value="">Year</option>
  <option v-for="year in finalYearOptions" :key="year">
  
  {{ year }}
</option>
      </select>

      <!-- DD Batch-->

      <!-- DD track-->
      <select
        v-if="showTrack"
        v-model="selectedTrack"
        class="filter-dropdown"
        @change="$emit('update:selectedTrack', selectedTrack)"
      >
        <option disabled value="">Track</option>
        <option v-for="track in tracks" :key="track">
          {{ track }}
        </option>
      </select>

      <!-- DD type-->
      <select
        v-if="showType"
        v-model="selectedType"
        class="filter-dropdown"
        @change="$emit('update:selectedType', selectedType)"
      >
        <option disabled value="">Download CSV</option>
        <option v-for="type in types" :key="type">
          {{ type }}
        </option>
      </select>
    </div>

  <!-- DD Status -->
    <select
      v-if="showStatus"
      v-model="selectedStatus"
      class="filter-dropdown"
      @change="$emit('update:selectedStatus', selectedStatus)"
    >
      <option disabled value="">Status</option>
      <option v-for="status in statuses" :key="status">
        {{ status }}
      </option>
    </select>
  </template>

 <script setup>
import { ref, defineProps, computed } from "vue";

const props = defineProps({
  showCurriculum: { type: Boolean, default: false },
  showYear: { type: Boolean, default: false },
  showBatch: { type: Boolean, default: false },
  showTrack: { type: Boolean, default: false },
  showType: { type: Boolean, default: false },
  showStatus: { type: Boolean, default: false },
  yearOptions: { type: Array, default: () => [] },
  hideAllOption: Boolean,
});

const selectedCurriculum = ref("");
const selectedYear = ref("");
const selectedBatch = ref("");
const selectedTrack = ref("");
const selectedType = ref("");
const selectedStatus = ref("");

// For curriculum dropdown
const curriculums = ["Junior High School", "Senior High School"];

// For fallback dropdowns only (used if yearOptions not passed)
const defaultYears = ["2021 - 2026", "2023 - 2024", "2026 - 2027"];
const batchs = ["All", "S.Y 2020 - 2021", "S.Y 2021 - 2022", "S.Y 2022 - 2023", "S.Y 2023 - 2024", "S.Y 2024 - 2025"];
const tracks = ["All", "SPJ", "SPA", "BEC"];
const statuses = ["Dropped-Out", "Not-Applicable", "Released", "Unreleased"];

// Use yearOptions prop if provided; otherwise fallback to default
const finalYearOptions = computed(() => {
  return props.yearOptions.length ? props.yearOptions : defaultYears;
});
</script>


<style scoped>
.dropdown-container {
  display: flex;
  gap: 10px;
}

.filter-dropdown {
  padding: 15px 20px;
  width: 210px;
  border: 1px solid #295f98;
  border-radius: 5px;
  font-size: 14px;
  background: #fff;
  font-weight: bold;
  color: #295f98;
  cursor: pointer;
  appearance: none;
  position: relative;
  background-repeat: no-repeat;
  background-position: right 10px center;
  padding-right: 30px;
  transition: all 0.3s ease-in-out;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M14 7l-5 5 5 5V7z'/></svg>");
}

.filter-dropdown:focus {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%23295f98'><path d='M7 10l5 5 5-5H7z'/></svg>");
}
</style>
