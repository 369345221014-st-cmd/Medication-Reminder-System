<template>
  <div class="admin-container">
    <div class="header-section">
      <h1>⚙️ ระบบจัดการยา (สำหรับผู้ดูแล)</h1>
      <p class="subtitle">จำนวนยาทั้งหมดในระบบ: <strong>{{ medications.length }}</strong> รายการ</p>
    </div>

    <!-- ฟอร์มเพิ่ม/ตั้งเวลาทานยา -->
    <div class="form-card">
      <h2>1. ตั้งเวลาและเพิ่มรายการยาใหม่</h2>
      <form @submit.prevent="handleSubmit" class="admin-form">
        <div class="form-group">
          <label for="name">ชื่อยา <span class="required">*</span></label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="เช่น ยาลดความดัน, ยาเบาหวาน"
            required
            class="form-control"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="dosage">ขนาดยา (มก.) <span class="required">*</span></label>
            <input
              id="dosage"
              v-model.number="form.dosage"
              type="number"
              min="1"
              required
              class="form-control"
            />
          </div>

          <!-- ช่องเลือกเวลาแบบ 24 ชั่วโมง (00:00 - 23:59 น.) -->
          <div class="form-group">
            <label>เวลาทานยา (ระบบ 24 ชม.) <span class="required">*</span></label>
            <div class="time-picker-wrapper">
              <select v-model="selectedHour" class="form-control select-time">
                <option v-for="h in 24" :key="h" :value="String(h - 1).padStart(2, '0')">
                  {{ String(h - 1).padStart(2, '0') }}
                </option>
              </select>
              <span class="time-colon">:</span>
              <select v-model="selectedMinute" class="form-control select-time">
                <option v-for="m in 60" :key="m" :value="String(m - 1).padStart(2, '0')">
                  {{ String(m - 1).padStart(2, '0') }}
                </option>
              </select>
              <span class="time-unit">น.</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label for="image">ลิงก์รูปภาพยา (ไม่บังคับ)</label>
          <input
            id="image"
            v-model="form.image_url"
            type="url"
            placeholder="https://..."
            class="form-control"
          />
        </div>

        <button type="submit" class="btn-submit">
          💾 บันทึกเวลาและข้อมูลยา
        </button>
      </form>
    </div>

    <!-- รายการยาที่มีในระบบ -->
    <div class="list-section">
      <h2>2. รายการยาในระบบทั้งหมด</h2>
      <div v-if="medications.length === 0" class="empty-state">
        ยังไม่มีข้อมูลรายการยา กรุณาเพิ่มยาจากฟอร์มด้านบน
      </div>
      <div v-else class="med-grid">
        <div v-for="med in medications" :key="med.id" class="med-item-card">
          <div class="med-info">
            <span class="med-time">⏰ {{ (med.reminder_time || med.time || '00:00').substring(0, 5) }} น.</span>
            <h3>{{ med.medication_name || med.name || med.title }}</h3>
            <p>ขนาด: {{ med.dosage || med.dose }} มก.</p>
          </div>
          <button @click="deleteMedication(med.id)" class="btn-delete" title="ลบรายการยา">
            🗑️ ลบ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  medications, 
  loadMedications, 
  addMedication, 
  deleteMedication, 
  startRealtime,
  requestNotificationPermission 
} from '../store.js';

const form = ref({
  name: '',
  dosage: 10,
  image_url: ''
});

// ตัวแปรสำหรับเลือกชั่วโมง (00-23) และนาที (00-59)
const selectedHour = ref('08');
const selectedMinute = ref('00');

onMounted(() => {
  loadMedications();
  startRealtime();
  requestNotificationPermission();
});

async function handleSubmit() {
  if (!form.value.name) return;

  // รวมชั่วโมงและนาที เช่น "08:00" หรือ "15:30"
  const formattedTime = `${selectedHour.value}:${selectedMinute.value}`;

  const err = await addMedication({
    medication_name: form.value.name,
    dosage: form.value.dosage,
    reminder_time: formattedTime,
    image_url: form.value.image_url ? form.value.image_url.trim() : null
  });
  
  if (!err) {
    alert('บันทึกเวลาและข้อมูลยาเรียบร้อยแล้ว!');
    form.value.name = '';
    form.value.dosage = 10;
    selectedHour.value = '08';
    selectedMinute.value = '00';
    form.value.image_url = '';
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 10px 0;
}

.header-section {
  text-align: center;
  margin-bottom: 24px;
}

.header-section h1 {
  color: #0E8C7B;
  font-size: 24px;
  margin-bottom: 6px;
}

.subtitle {
  color: #64748b;
  font-size: 15px;
}

.form-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  margin-bottom: 30px;
}

.form-card h2 {
  font-size: 18px;
  color: #1e293b;
  margin-bottom: 18px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 10px;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  font-size: 14px;
  color: #334155;
}

.required {
  color: #ef4444;
}

.form-control {
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #0E8C7B;
  box-shadow: 0 0 0 3px rgba(14, 140, 123, 0.1);
}

/* ปรับแต่งช่องเลือกเวลา 24 ชั่วโมง */
.time-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-time {
  flex: 1;
  text-align: center;
  cursor: pointer;
  background-color: #ffffff;
  font-weight: 600;
}

.time-colon {
  font-size: 20px;
  font-weight: bold;
  color: #475569;
}

.time-unit {
  font-size: 15px;
  font-weight: 600;
  color: #64748b;
  padding-left: 2px;
}

.btn-submit {
  background-color: #0E8C7B;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 8px;
  transition: background-color 0.2s;
}

.btn-submit:hover {
  background-color: #0b6f62;
}

.list-section h2 {
  font-size: 18px;
  color: #1e293b;
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 30px;
  background: #f8fafc;
  border-radius: 12px;
  color: #94a3b8;
}

.med-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.med-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
}

.med-time {
  display: inline-block;
  background: #e6f4f1;
  color: #0E8C7B;
  font-weight: bold;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 6px;
}

.med-info h3 {
  margin: 0;
  font-size: 17px;
  color: #0f172a;
}

.med-info p {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #64748b;
}

.btn-delete {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fca5a5;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background-color: #dc2626;
  color: white;
}
</style>