<script setup lang="ts">
import { RouterView } from "vue-router";
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import ar from 'element-plus/es/locale/lang/ar-eg'
import { computed, ref, watch } from "vue";
import { useUserStore } from './stores/useStore';
const useStore = useUserStore()
const preferredLocale = computed(() => useStore.preferredLocale)
const locale = ref(ar);
watch(preferredLocale, async (value) => {
  locale.value = value === 'ar' ? ar : en
})
</script>

<template>
  <el-config-provider :locale="locale">
    <RouterView />
  </el-config-provider>
</template>

<style>
[dir="rtl"] .filters {
  direction: rtl;
}

[dir="rtl"] .el-table th,
[dir="rtl"] .el-table td {
  text-align: right;
}
</style>
