<template>
  <Panel>
    <template #header>
      📋 รายการยาและเวลาทานยาสำหรับผู้สูงอายุ
    </template>

    <p v-if="loading" role="status">กำลังโหลดรายการยา...</p>
    <div v-else-if="errorMsg" role="alert">
      <p>{{ errorMsg }}</p>
      <button @click="loadMedications">ลองใหม่</button>
    </div>

    <div v-else class="med-list">
      <ProductCard
        v-for="item in medications"
        :key="item.id"
        :id="item.id"
        :title="item.medication_name || item.title"
        :price="item.dosage || item.price"
        :time="item.reminder_time"
        :image="item.image"
        @add="takeMedicine"
      />
    </div>

    <template #footer>
      <p aria-live="polite">
        ทานยาไปแล้ววันนี้: <strong>{{ itemCount }}</strong> รายการ | ปริมาณรวม: <strong>{{ totalDosage }} มก.</strong>
      </p>
      <p role="status" aria-live="polite" class="notice-msg">{{ notice }}</p>
      <router-link to="/summary" class="btn-summary">ดูประวัติการกินยา →</router-link>
    </template>
  </Panel>
</template>

<script setup>
import Panel from '../components/Panel.vue';
import ProductCard from '../components/ProductCard.vue';
import {
  medications,
  itemCount,
  totalDosage,
  notice,
  takeMedicine,
  loading,
  errorMsg,
  loadMedications
} from '../store.js';
</script>

<style scoped>
.notice-msg { color: #27ae60; font-weight: bold; }
.btn-summary { display: inline-block; margin-top: 8px; color: #0E8C7B; font-weight: bold; text-decoration: none; }
</style>