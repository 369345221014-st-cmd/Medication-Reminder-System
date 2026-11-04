<template>
  <section class="home-container">
    <h1>ระบบแจ้งเตือนการทานยาของผู้สูงอายุ</h1>
    <p>ดูแลสุขภาพผู้สูงอายุด้วยการบันทึกและเตือนทานยาให้ตรงเวลาอย่างปลอดภัย</p>
    
    <div class="actions">
      <router-link to="/medications" class="btn-primary">ดูรายการยาทั้งหมด →</router-link>
    </div>

    <!-- 🧪 ชั่วคราว: ทดสอบ RLS - ลบออกหลังทดสอบเสร็จ -->
    <div class="test-rls-section">
      <p><button @click="tryInsert" class="btn-test">🧪 ทดสอบเพิ่มยาโดยไม่ผ่านหลังบ้าน</button></p>
      <p role="status" class="test-msg">{{ testMsg }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { addMedication } from '../store.js';

const testMsg = ref('');

async function tryInsert() {
  // ทดลองเพิ่มข้อมูลยาจำลองโดยยังไม่ได้ล็อกอินผ่านหน้า admin
  const problem = await addMedication({
    medication_name: 'ยาทดสอบ RLS',
    dosage: '50',
    reminder_time: '08:00:00'
  });

  testMsg.value = problem
    ? '🛡️ ฐานข้อมูลปฏิเสธ: ' + problem
    : '⚠️ เพิ่มได้ – ถ้ายังไม่ได้ล็อกอิน แปลว่ากฎ RLS ยังไม่ทำงาน';
}
</script>

<style scoped>
.home-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

/* 🛠️ ปรับขนาดหัวข้อและระยะห่างไม่ให้ตัวอักษรซ้อนทับกัน */
.home-container h1 {
  font-size: 26px;
  color: #0E8C7B;
  margin-bottom: 10px;
  line-height: 1.3;
}

.home-container p {
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
}

.btn-primary {
  display: inline-block;
  padding: 10px 18px;
  background-color: #0E8C7B;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
}

.btn-primary:hover {
  background-color: #0b6f62;
}

.test-rls-section {
  margin-top: 40px;
  padding: 15px;
  border: 1px dashed #0E8C7B;
  border-radius: 8px;
  background: #f4fcfb;
}

.btn-test {
  padding: 8px 14px;
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.btn-test:hover {
  background-color: #d35400;
}

.test-msg {
  margin-top: 8px;
  font-weight: bold;
  color: #333;
}
</style>