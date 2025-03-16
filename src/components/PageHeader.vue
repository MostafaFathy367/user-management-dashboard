<template>
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <h2 style="margin-bottom: 10px">
      {{ props.title }}
    </h2>
    <div>
      <el-switch
        v-model="darkMode"
        :active-action-icon="Moon"
        :inactive-action-icon="Sunny"
      />
      <el-dropdown placement="bottom" @command="handleSelectLang">
        <span >
          {{locale == 'ar' ? 'العربية' : 'English'}}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="ar">العربية</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <el-page-header v-if="hasBack" @back="handleGoBack" />
</template>

<script lang="ts" setup>
import { computed, defineProps, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { Sunny, Moon } from "@element-plus/icons-vue";
import { useUserStore } from "../stores/useStore";
import { useI18n } from 'vue-i18n';

const props = defineProps({
  title: String,
  hasBack: Boolean,
});

const { locale } = useI18n();
const router = useRouter();
const useStore = useUserStore();

const darkMode = ref(true);

const direction = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'));

watch(darkMode, (value) => {
  if (value) {
    document.querySelector("html")?.classList.add("dark");
  } else {
    document.querySelector("html")?.classList.remove("dark");
  }
});

const handleGoBack = () => {
  router.back();
};
const handleSelectLang = (e: string) => {
  locale.value = e;
  useStore.setLocale(e);
  document.documentElement.setAttribute('lang', e);
  document.documentElement.setAttribute('dir', direction.value);
}

</script>
