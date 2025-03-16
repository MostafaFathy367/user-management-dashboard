<template>
  <div class="user-detail">
    <el-skeleton :rows="6" :loading="loading" animated>
      <template #default>
        <el-alert
        v-if="error"
        type="error"
        :title="error"
        :closable="false"
        style="margin-bottom: 20px"
        />
        <el-card v-if="user" shadow="hover">
          <page-header has-back :title="$t('userProfile')" />
          
          <el-form
            ref="userFormRef"
            :model="formData"
            :rules="formRules"
            label-width="120px"
          >
            <el-form-item :label="$t('name')" prop="name">
              <el-input v-model="formData.name" :disabled="!isEditing" v-focus />
            </el-form-item>
            <el-form-item :label="$t('role')" prop="role">
              <el-select v-model="formData.role" :disabled="!isEditing">
                <el-option v-for="r in roles" :key="r" :label="r" :value="r" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('status')" prop="status">
              <el-select v-model="formData.status" :disabled="!isEditing">
                <el-option label="Active" value="active" />
                <el-option label="Inactive" value="inactive" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('dateJoined')" prop="dateJoined">
              <el-input v-model="formData.dateJoined" :disabled="true" />
            </el-form-item>
            <el-form-item>
              <el-button
                v-if="!isEditing"
                type="primary"
                @click="isEditing = true"
                >{{ $t("edit") }}</el-button
              >
              <template v-if="isEditing">
                <el-button type="success" @click="saveUser">{{
                  $t("save")
                }}</el-button>
                <el-button @click="cancelEdit">{{ $t("cancel") }}</el-button>
                <el-button type="danger" @click="confirmDelete">{{
                  $t("delete")
                }}</el-button>
              </template>
            </el-form-item>
          </el-form>
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/useStore";
import { mockApi } from "../api/mockApi";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import type { User } from "../interfaces";
import PageHeader from "../components/PageHeader.vue";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userId = Number(route.params.id);

const userStore = useUserStore();
const { updateUser, deleteUser } = userStore;

const user = ref<User | null>(null);
const isEditing = ref(false);
const roles = ref<string[]>([]);
const formData = reactive<User>({
  id: 0,
  name: "",
  role: "viewer",
  status: "active",
  dateJoined: "",
});

const loading = computed(() => userStore.isLoading)
const error = computed(() => userStore.error)

const formRules = {
  name: [{ required: true, message: "Name is required", trigger: "blur" }],
  role: [{ required: true, message: "Role is required", trigger: "change" }],
  status: [
    { required: true, message: "Status is required", trigger: "change" },
  ],
};

async function fetchUser() {
  userStore.isLoading = true;
  try {
    user.value = await mockApi.getUser(userId);
    Object.assign(formData, user.value);
  } catch (err) {
    userStore.error = (err as Error).message;
  } finally {
    userStore.isLoading = false;
  }
}

async function saveUser() {
  userStore.isLoading = true;
  try {
    await updateUser(formData);
    user.value = { ...formData };
    isEditing.value = false;
    ElMessage.success(t("userSaved"));
  } catch (err) {
    userStore.error = (err as Error).message;
  } finally {
    userStore.isLoading = false;
  }
}

function cancelEdit() {
  Object.assign(formData, user.value);
  isEditing.value = false;
}

function confirmDelete() {
  ElMessageBox.confirm(t("deleteConfirm"), t("warning"), {
    confirmButtonText: t("yes"),
    cancelButtonText: t("no"),
    type: "warning",
  })
    .then(async () => {
      await deleteUser(userId);
      ElMessage.success(t("userDeleted"));
      router.push("/");
    })
    .catch(() => ElMessage.info(t("deleteCanceled")));
}

onMounted(async () => {
  fetchUser();
  roles.value = await mockApi.getRoles();
});
</script>

<style scoped>
.user-detail {
  padding: 20px;
}
</style>
