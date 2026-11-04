<template>
  <div class="panel">
    <div class="panel-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
    <div class="panel-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.panel {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #fff;
  overflow: hidden;
}
.panel-header {
  background-color: #f5f5f5;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  font-weight: bold;
}
.panel-body {
  padding: 16px;
}
.panel-footer {
  background-color: #fffdd0;
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
}
</style>
