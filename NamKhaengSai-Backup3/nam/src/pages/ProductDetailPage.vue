<template>
  <!-- กำลังโหลด -->
  <p v-if="loading" role="status">⏳ กำลังโหลดข้อมูลยา...</p>

  <!-- เจอข้อมูลยา -->
  <section v-else-if="medication">
    <h1>{{ medication.medication_name || medication.title }}</h1>
    <img :src="medication.image" :alt="medication.medication_name || medication.title" width="200" />
    <p>ปริมาณยา: {{ medication.dosage || medication.price }} มก.</p>
    <button @click="takeNow">💊 บันทึกทานยาทันที</button>
    <p><router-link to="/medications">← กลับรายการยาทั้งหมด</router-link></p>
  </section>

  <!-- ไม่พบข้อมูลยา -->
  <section v-else>
    <h1>ไม่พบข้อมูลยา รหัส {{ route.params.id }}</h1>
    <router-link to="/medications">← กลับรายการยาทั้งหมด</router-link>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { medications, takeMedicine, loading } from '../store.js';

const route = useRoute();
const router = useRouter();

const medication = computed(() =>
  medications.value.find((p) => p.id === Number(route.params.id))
);

function takeNow() {
  const p = medication.value;
  takeMedicine({
    id: p.id,
    title: p.medication_name || p.title,
    dosage: p.dosage || p.price
  });
  router.push('/summary');
}
</script>