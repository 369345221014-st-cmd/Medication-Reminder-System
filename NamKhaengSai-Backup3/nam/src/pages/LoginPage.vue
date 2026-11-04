<template>
  <section class="login-container">
    <h1>🔑 เข้าสู่ระบบผู้ดูแล (ระบบแจ้งเตือนการทานยา)</h1>
    <p class="subtitle">สำหรับเจ้าหน้าที่/ญาติผู้ดูแล เพื่อจัดการรายการยาและตั้งค่าการแจ้งเตือนผู้สูงอายุ</p>
    
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">อีเมลผู้ดูแล</label>
        <input 
          id="email" 
          v-model.trim="email" 
          type="email" 
          autocomplete="username" 
          placeholder="example@caregiver.com"
          required 
        />
      </div>

      <div class="form-group">
        <label for="password">รหัสผ่าน</label>
        <div class="password-wrapper">
          <input 
            id="password" 
            v-model="password" 
            :type="showPw ? 'text' : 'password'" 
            autocomplete="current-password" 
            placeholder="••••••••"
            required 
          />
          <button type="button" @click="showPw = !showPw" :aria-pressed="showPw" class="toggle-password-btn">
            {{ showPw ? '🙈 ซ่อนรหัส' : '👁️ แสดงรหัส' }}
          </button>
        </div>
      </div>

      <button type="submit" :disabled="busy" class="submit-btn">
        {{ busy ? '⏳ กำลังตรวจสอบข้อมูล...' : 'เข้าสู่ระบบผู้ดูแล' }}
      </button>
    </form>

    <!-- role="alert" สำหรับให้ screen reader อ่านข้อความแจ้งเตือนทันที -->
    <p v-if="message" class="error-message" role="alert">{{ message }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signIn } from '../store.js';

const email = ref('');
const password = ref('');
const busy = ref(false);        // ป้องกันการกดปุ่มซ้ำขณะกำลังตรวจสอบสิทธิ์
const message = ref('');
const showPw = ref(false);      // สถานะสำหรับเปิด/ปิดดูรหัสผ่าน
const router = useRouter();

async function login() {
  busy.value = true;
  message.value = ''; // ล้างข้อความผิดพลาดเดิมก่อนส่งข้อมูล
  
  const errorMsg = await signIn(email.value, password.value);
  busy.value = false;
  
  if (errorMsg) {
    message.value = errorMsg;
  } else {
    // เข้าสู่ระบบสำเร็จ -> ไปยังหน้าจัดการรายการยาของผู้สูงอายุ (/admin)
    router.push('/admin');  
  }
}
</script>

<style scoped>
.login-container {
  max-width: 420px;
  margin: 40px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: #f9f9f9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* 🛠️ ปรับขนาดหัวข้อและระยะห่างให้พอดี ไม่ซ้อนทับกัน */
.login-container h1 {
  font-size: 20px;
  line-height: 1.4;
  text-align: center;
  color: #0E8C7B;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 13px;
  color: #666;
  text-align: center;
  margin-bottom: 24px;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.password-wrapper {
  display: flex;
  gap: 8px;
}

.toggle-password-btn {
  padding: 0 12px;
  background: #e0e0e0;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 13px;
}

.toggle-password-btn:hover {
  background: #d0d0d0;
}

.submit-btn {
  width: 100%;
  padding: 11px;
  background-color: #0E8C7B;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #0b6f62;
}

.error-message {
  color: #e74c3c;
  margin-top: 12px;
  font-weight: bold;
  font-size: 13px;
  text-align: center;
}
</style>