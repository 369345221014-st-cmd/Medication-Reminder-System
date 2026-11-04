<script setup>
import { ref } from 'vue';
import ProductCard from './components/ProductCard.vue';
import Panel from './components/Panel.vue';

// ข้อมูลรายการยา
const medications = ref([
  { 
    id: 1, 
    title: 'ยาลดความดันโลหิต', 
    dosage: '1 เม็ด', 
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500', 
    time: 'หลังอาหารเช้า 08:00 น.' 
  },
  { 
    id: 2, 
    title: 'ยาเบาหวาน', 
    dosage: '1 เม็ด', 
    image: 'https://images.unsplash.com/photo-1550572017-edf706256241?w=500', 
    time: 'ก่อนอาหารเย็น 17:30 น.' 
  },
  { 
    id: 3, 
    title: 'วิตามินบำรุงร่างกาย', 
    dosage: '2 เม็ด', 
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=500', 
    time: 'ก่อนนอน 21:00 น.' 
  }
]);

// เก็บรายการยาที่กดทานแล้ว
const takenList = ref([]);
function takeMedicine(name) {
  if (!takenList.value.includes(name)) {
    takenList.value.push(name);
  }
}

// เก็บคะแนน/จำนวนการตั้งเตือนด่วน
const reminderCount = ref(0);
function addReminder() {
  reminderCount.value++;
}
</script>

<template>
  <main class="container">
    <!-- Panel ที่ 1: ตารางการทานยา -->
    <Panel>
      <template #header>
        <h2>💊 ตารางการทานยาประจำวัน</h2>
      </template>

      <!-- แสดงการ์ดรายการยา -->
      <div class="card-list">
        <ProductCard
          v-for="item in medications"
          :key="item.id"
          :title="item.title"
          :price="item.dosage" 
          :image="item.image"
          :desc="item.time"
          @add="takeMedicine"
          @favorite="addReminder" />
      </div>

      <!-- สรุปสถานะ -->
      <div class="status-box">
        <p>🔔 ตั้งเตือนด่วน: <strong>{{ reminderCount }}</strong> รายการ</p>
      </div>

      <!-- ส่วนท้าย Panel -->
      <template #footer>
        <p aria-live="polite">✅ ทานยาไปแล้ว <strong>{{ takenList.length }} / {{ medications.length }}</strong> รายการ</p>
        <small>อย่าลืมทานยาตรงเวลาเพื่อสุขภาพที่ดีครับ</small>
      </template>
    </Panel>

    <!-- Panel ที่ 2: ข้อแนะนำเพิ่มเติม -->
    <Panel>
      <template #header>
        <h3>📋 ข้อควรปฏิบัติในการทานยา</h3>
      </template>
      <ol>
        <li>ทานยาตรงตามเวลาที่กำหนดอย่างสม่ำเสมอ</li>
        <li>ดื่มน้ำสะอาดตามอย่างน้อย 1 แก้ว</li>
        <li>หากลืมทานยา ให้รีบปรึกษาเภสัชกรหรือผู้ดูแล</li>
      </ol>
    </Panel>
  </main>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: sans-serif;
}

.status-box {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f4f8;
  border-radius: 8px;
}

ol {
  padding-left: 20px;
  line-height: 1.8;
}
</style>