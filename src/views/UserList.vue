<template>
  <div class="user-list">
    <el-alert
      v-if="error"
      type="error"
      :title="error"
      :closable="false"
      style="margin-bottom: 20px"
    />
    <page-header :title="$t('userList')" />
    <div class="filters">
      <el-input
        v-model="searchQuery"
        :placeholder="$t('searchByName')"
        @input="debouncedFetch"
        style="width: 200px"
      />
      <el-select
        v-model="roleFilter"
        :placeholder="$t('role')"
        @change="fetchUsersData"
        style="width: 150px; margin-left: 10px"
        clearable
      >
        <el-option label="All Roles" value="" />
        <el-option
          v-for="role in roles"
          :key="role"
          :label="role"
          :value="role"
        />
      </el-select>
      <el-select
        v-model="statusFilter"
        :placeholder="$t('status')"
        @change="fetchUsersData"
        style="width: 150px; margin-left: 10px"
        clearable
      >
        <el-option :label="$t('allStatuses')" value="" />
        <el-option :label="$t('active')" value="active" />
        <el-option :label="$t('inactive')" value="inactive" />
      </el-select>
      <el-dropdown placement="bottom" @command="handleExportCSV">
        <span>
          {{ $t("exportCSV") }}
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="all">{{
              $t("exportAllCSV")
            }}</el-dropdown-item>
            <el-dropdown-item command="page">{{
              $t("exportPageCSV")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-table
      :data="paginatedUsers"
      style="width: 100%; margin-top: 20px"
      @sort-change="handleSortChange"
      ref="tableRef"
    >
      <el-table-column prop="name" :label="$t('name')" sortable />
      <el-table-column prop="role" :label="$t('role')" sortable />
      <el-table-column prop="status" :label="$t('status')" sortable />
      <el-table-column prop="dateJoined" :label="$t('dateJoined')" sortable />
      <el-table-column
        :label="$t('actions')"
        v-if="currentUser?.role === 'admin'"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            @click="$router.push(`/user/${row.id}`)"
            >{{ $t("edit") }}</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="currentPage"
      :page-size="itemsPerPage"
      :total="total"
      layout="prev, pager, next"
      style="margin-top: 20px"
      @current-change="fetchUsersData"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "../stores/useStore";
import { mockApi } from "../api/mockApi";
import { debounce } from "../composables/useDebounce";
import { ElTable } from "element-plus";
import { useI18n } from "vue-i18n";
import PageHeader from "../components/PageHeader.vue";
import Papa from "papaparse";

const { t } = useI18n();
const userStore = useUserStore();
const { users, currentUser, error, fetchUsers } = userStore;

const tableRef = ref<InstanceType<typeof ElTable>>();
const searchQuery = ref<string>("");
const roleFilter = ref<string>("");
const statusFilter = ref<string>("");
const currentPage = ref<number>(1);
const itemsPerPage = 10;
const roles = ref<string[]>([]);
const sortKey = ref<string>("");
const sortOrder = ref<"ascending" | "descending">("ascending");

const debouncedFetch = debounce(() => fetchUsersData(), 300);

function fetchUsersData() {
  fetchUsers({
    page: currentPage.value,
    limit: itemsPerPage,
    search: searchQuery.value,
    role: roleFilter.value,
    status: statusFilter.value,
  });
}

const paginatedUsers = computed(() => {
  let result = userStore.users;
  if (sortKey.value) {
    result.sort((a, b) => {
      const aValue = a[sortKey.value as keyof typeof a];
      const bValue = b[sortKey.value as keyof typeof b];
      return sortOrder.value === "ascending"
        ? aValue > bValue
          ? 1
          : -1
        : aValue < bValue
        ? 1
        : -1;
    });
  }
  return result;
});

const total = computed(() => userStore.totalUsers);

const handleSortChange = ({
  prop,
  order,
}: {
  prop: string;
  order: "ascending" | "descending" | null;
}) => {
  sortKey.value = prop;
  sortOrder.value = order || "ascending";
};

const exportPageToCSV = () => {
  const csvData = paginatedUsers.value.map((user) => ({
    [t("name")]: user.name,
    [t("role")]: user.role,
    [t("status")]: user.status,
    [t("dateJoined")]: user.dateJoined,
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    "download",
    `users_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const exportAllToCSV = async () => {
  const { data } = await mockApi.getUsers({
    search: searchQuery.value,
    role: roleFilter.value,
    status: statusFilter.value,
  });
  const csvData = data.map((user) => ({
    [t("name")]: user.name,
    [t("role")]: user.role,
    [t("status")]: user.status,
    [t("dateJoined")]: user.dateJoined,
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    "download",
    `users_${new Date().toISOString().split("T")[0]}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleExportCSV = (command:string) => {
  command === "all" ? exportAllToCSV() : exportPageToCSV();
};

onMounted(async () => {
  fetchUsersData();
  roles.value = await mockApi.getRoles();
});
</script>

<style scoped>
.user-list {
  padding: 20px;
}
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
[dir="rtl"] .filters {
  flex-direction: row-reverse;
}
</style>
