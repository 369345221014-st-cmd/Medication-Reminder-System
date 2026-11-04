<template>
  <div class="impact-container">
    <h1>สรุปผลลัพธ์การใช้งานระบบ (Impact & Feedback)</h1>
    <p class="subtitle">ผลการนำระบบแจ้งเตือนการทานยาไปทดลองใช้งานกับกลุ่มเป้าหมายผู้สูงอายุและผู้ดูแล</p>

    <!-- 1. แสดงหลักฐานแบบตัวเลข (ดึงจาก DB จริง) -->
    <section class="section-box">
      <h2>📊 1. หลักฐานเชิงตัวเลข (Statistics จาก Supabase)</h2>
      <div v-if="loading" class="loading-text">กำลังดึงข้อมูล...</div>
      <div v-else class="stat-grid">
        <div class="stat-card">
          <span class="stat-number">{{ uniqueUsersCount }} คน</span>
          <span class="stat-label">จำนวนผู้ใช้กลุ่มเป้าหมายที่ลงทะเบียน/ทดลองใช้</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ totalLogsCount }} ครั้ง</span>
          <span class="stat-label">จำนวนครั้งที่บันทึกการทานยาสะเร็จ</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ totalDosageSum }} มก.</span>
          <span class="stat-label">ปริมาณยารวมที่รับประทานแล้ว</span>
        </div>
      </div>
    </section>

    <!-- 2. แสดงหลักฐานแบบคำพูด (ดึงจากตาราง impact_log จริง) -->
    <section class="section-box">
      <h2>💬 2. เสียงตอบรับจากผู้ใช้งาน (User Feedback)</h2>
      <div v-if="loading" class="loading-text">กำลังดึงข้อมูลคำพูด...</div>
      <div v-else-if="impactLogs.length === 0" class="empty-box">
        ⚠️ ยังไม่มีข้อมูลคำพูดในตาราง <code>impact_log</code> บน Supabase
      </div>
      <div v-else class="quote-grid">
        <div class="quote-card" v-for="item in impactLogs" :key="item.id">
          <div class="user-badge">{{ item.user_code || 'ผู้ใช้' }}</div>
          <p class="quote-text">"{{ item.quote || item.consent }}"</p>
        </div>
      </div>
    </section>

    <!-- 3. ภาพบรรยากาศ (ดึงรูปจาก image_url ใน Supabase โดยอัตโนมัติ) -->
    <section class="section-box">
      <h2>🖼️ 3. ภาพบรรยากาศหน้าจอการใช้งานจริง</h2>
      <div v-if="loading" class="loading-text">กำลังดึงข้อมูลรูปภาพ...</div>
      <div v-else-if="imageLogs.length === 0" class="empty-box">
        📷 ยังไม่มีลิงก์รูปภาพในคอลัมน์ <code>image_url</code> บน Supabase
      </div>
      <div v-else class="image-grid">
        <div class="img-card" v-for="(item, index) in imageLogs" :key="item.id">
          <img 
            :src="item.image_url" 
            :alt="'ภาพบรรยากาศที่ ' + (index + 1)" 
            class="img-real" 
          />
          <p class="img-caption">ภาพที่ {{ index + 1 }}: {{ item.user_code || 'ภาพการใช้งานจริง' }}</p>
        </div>
      </div>
    </section>

    <!-- 4. สิ่งที่ปรับปรุง -->
    <section class="section-box highlight-box">
      <h2>🛠️ 4. สิ่งที่ได้ปรับปรุงแก้ไขจากฟีดแบ็ก (Improvement)</h2>
      <div class="improvement-item">
        <strong>ข้อเสนอแนะจากผู้ใช้:</strong> "ผู้สูงอายุบางท่านมองเห็นไม่ชัด ทำให้สับสนเมนูนำทางด้านบน"
      </div>
      <div class="improvement-item success">
        <strong>สิ่งที่ทีมปรับปรุงแก้ไข:</strong> ปรับเปลี่ยนแถบเมนูนำทาง (Navbar) ให้เป็นรูปแบบ **"กล่องการ์ดปุ่มใหญ่"** เพิ่มไอคอนสัญลักษณ์ชัดเจน และซ่อนหน้าผลลัพธ์ในส่วนผู้ใช้งานทั่วไป
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { supabase } from '../supabase.js';

const loading = ref(true);
const medicationLogs = ref([]);
const impactLogs = ref([]);

// ดึงข้อมูลจริงจาก Supabase
async function fetchSupabaseData() {
  loading.value = true;
  try {
    const { data: medData } = await supabase.from('medication_logs').select('*');
    if (medData) medicationLogs.value = medData;

    const { data: impactData } = await supabase.from('impact_log').select('*');
    if (impactData) impactLogs.value = impactData;
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    loading.value = false;
  }
}

// กรองรายการที่มี image_url เพื่อนำมาแสดงผลเป็นรูปภาพ
const imageLogs = computed(() => {
  return impactLogs.value.filter(item => item.image_url && item.image_url.trim() !== '');
});

// การคำนวณสถิติต่างๆ
const totalLogsCount = computed(() => medicationLogs.value.length);
const totalDosageSum = computed(() => {
  return medicationLogs.value.reduce((sum, item) => sum + (Number(item.dosage) || 0), 0);
});
const uniqueUsersCount = computed(() => {
  return Math.max(impactLogs.value.length, 0);
});

onMounted(() => {
  fetchSupabaseData();
});
</script>

<style scoped>
.impact-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: 'Sarabun', system-ui, -apple-system, sans-serif;
  color: #1e293b;
}

h1 {
  font-size: 26px;
  color: #0E8C7B;
  margin-bottom: 6px;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #64748b;
  margin-bottom: 30px;
}

.loading-text {
  text-align: center;
  padding: 20px;
  color: #64748b;
}

.empty-box {
  background: #fffbebf8;
  border: 1px solid #fef3c7;
  color: #d97706;
  padding: 16px;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
}

.section-box {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
}

.section-box h2 {
  font-size: 18px;
  color: #0f172a;
  margin-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 8px;
}

/* Stat Grid */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #16a34a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #334155;
}

/* Quote Grid */
.quote-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.quote-card {
  background: #f8fafc;
  border-left: 4px solid #0E8C7B;
  border-radius: 8px;
  padding: 16px;
}

.user-badge {
  font-weight: bold;
  font-size: 13px;
  color: #0E8C7B;
  margin-bottom: 8px;
}

.quote-text {
  font-size: 14px;
  color: #334155;
  font-style: italic;
  line-height: 1.5;
}

/* Image Grid และ การจัดขนาดรูปให้สมดุล */
.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  align-items: stretch;
}

.img-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.img-real {
  width: 100%;
  height: 220px;
  object-fit: contain;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  padding: 4px;
}

.img-caption {
  font-size: 13px;
  color: #475569;
  margin-top: 10px;
  font-weight: 600;
  text-align: center;
}

/* Highlight Box */
.highlight-box {
  background: #f0f9ff;
  border-color: #bae6fd;
}

.improvement-item {
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
}

.improvement-item.success {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #065f46;
}
</style>