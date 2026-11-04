<template>
  <article class="card">
    <div class="time-header" v-if="props.time">
      ⏰ เวลาทานยา: <strong>{{ props.time }} น.</strong>
    </div>
    <img v-if="props.image" :src="props.image" :alt="props.title" width="110" />
    <h3>{{ props.title }}</h3>
    <p class="dosage-info">ขนาดยา: <strong>{{ props.price }} มก.</strong></p>
    
    <div class="card-actions">
      <button @click="emit('add', { id: props.id, title: props.title, dosage: props.price, time: props.time })" class="btn-take">
        ✅ กดทานยาแล้ว
      </button>
      <router-link :to="'/medication/' + props.id" class="btn-detail">ดูรายละเอียด</router-link>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  price: { type: [String, Number], default: '-' },
  image: { type: String, default: '' },
  time: { type: String, default: 'ไม่ระบุเวลา' }
});

const emit = defineEmits(['add']);
</script>

<style scoped>
.card { border: 2px solid #0E8C7B; border-radius: 12px; padding: 16px; margin: 12px 0; background: #fff; }
.time-header { background: #e6f4f1; color: #0E8C7B; padding: 6px 12px; border-radius: 6px; font-size: 16px; font-weight: bold; margin-bottom: 10px; }
.dosage-info { font-size: 15px; color: #444; }
.card-actions { display: flex; gap: 10px; margin-top: 12px; align-items: center; }
.btn-take { background-color: #27ae60; color: white; border: none; padding: 10px 16px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; }
.btn-take:hover { background-color: #219150; }
.btn-detail { color: #0E8C7B; text-decoration: none; font-weight: bold; }
</style>