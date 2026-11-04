<template>
  <Panel>
    <template #header>
      📜 ประวัติการกินยาและการกินยาย้อนหลัง
    </template>

    <!-- ตัวเลือกวันที่สำหรับย้อนดูประวัติ -->
    <div class="date-picker-box">
      <label for="history-date">📅 เลือกวันที่ต้องการดูประวัติ: </label>
      <input 
        id="history-date" 
        type="date" 
        v-model="filterDate" 
        @change="onDateChange"
        class="date-input"
      />
      <button @click="selectToday" class="btn-today">วันนี้</button>
    </div>

    <div v-if="loadingHistory" class="loading-text">กำลังโหลดประวัติ...</div>

    <!-- รายการประวัติย้อนหลัง -->
    <div v-else-if="historyLogs.length > 0">
      <p class="summary-count">พบประวัติการทานยา <strong>{{ historyLogs.length }}</strong> รายการ ประจำวันที่ {{ formatDate(filterDate) }}</p>
      <ul class="history-list">
        <li v-for="log in historyLogs" :key="log.id" class="history-item">
          <div class="time-tag">
            ⏰ เวลาที่กดทาน: <strong>{{ formatTime(log.taken_at) }} น.</strong>
          </div>
          <div class="med-detail">
            <span class="med-name">💊 {{ log.medication_name }}</span>
            <span class="med-dosage">ขนาด: {{ log.dosage }} มก.</span>
            <span class="scheduled-time">(เวลาที่กำหนด: {{ log.scheduled_time || '-' }} น.)</span>
          </div>
        </li>
      </ul>
    </div>

    <p v-else class="empty-msg">❌ ไม่พบประวัติการทานยาในวันที่ {{ formatDate(filterDate) }}</p>

    <template #footer>
      <div class="action-buttons">
        <button @click="router.push('/medications')" class="btn-back">← กลับหน้าตารางยา</button>
      </div>
    </template>
  </Panel>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Panel from '../components/Panel.vue';
import { historyLogs, loadHistoryByDate } from '../store.js';

const router = useRouter();
const filterDate = ref(new Date().toISOString().substring(0, 10));
const loadingHistory = ref(false);

async function fetchHistory() {
  loadingHistory.value = true;
  await loadHistoryByDate(filterDate.value);
  loadingHistory.value = false;
}

function onDateChange() {
  fetchHistory();
}

function selectToday() {
  filterDate.value = new Date().toISOString().substring(0, 10);
  fetchHistory();
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(isoStr) {
  if (!isoStr) return '-';
  const d = new Date(isoStr);
  return d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
}

onMounted(() => {
  fetchHistory();
});
</script>

<style scoped>
.date-picker-box { background: #f0fdf4; padding: 14px; border-radius: 8px; border: 1px solid #bbf7d0; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.date-input { padding: 6px 12px; font-size: 15px; border-radius: 6px; border: 1px solid #ccc; }
.btn-today { background: #0E8C7B; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; }
.loading-text { text-align: center; color: #666; padding: 20px; }
.summary-count { font-size: 15px; color: #333; margin-bottom: 12px; }
.history-list { list-style: none; padding: 0; margin: 0; }
.history-item { background: #ffffff; border: 1px solid #e5e7eb; border-left: 5px solid #27ae60; padding: 12px 16px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.time-tag { color: #27ae60; font-size: 14px; margin-bottom: 4px; }
.med-detail { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; font-size: 16px; }
.med-name { font-weight: bold; color: #111827; }
.med-dosage { color: #4b5563; }
.scheduled-time { font-size: 13px; color: #9ca3af; }
.empty-msg { text-align: center; color: #888; padding: 30px; font-size: 16px; background: #fafafa; border-radius: 8px; }
.action-buttons { display: flex; gap: 10px; margin-top: 10px; }
.btn-back { background: #0E8C7B; color: white; border: none; padding: 10px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; }
</style>