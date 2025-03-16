import { defineStore } from "pinia";
import { ref } from "vue";
import { mockApi } from "../api/mockApi";
import type { User } from "@/interfaces";
import { ElLoading, ElNotification } from "element-plus";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const router = useRouter();

  const users = ref<User[]>([]);
  const totalUsers = ref(0);
  const currentUser = ref<User | null>({
    id: 1,
    name: "Admin",
    role: "admin",
    status: "active",
    dateJoined: "2023-01-01",
  });
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const preferredLocale = ref<string>('en');

  async function fetchUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const loading = ElLoading.service({
      lock: true,
      background: "rgba(0, 0, 0, .6)",
      text: "Loading....",
    });
    isLoading.value = true;
    error.value = null;
    try {
      const response = await mockApi.getUsers(params);
      console.log("🚀 ~ useUserStore ~ response:", response)
      users.value = response.data;
      totalUsers.value = response.total;
    } catch (err) {
      ElNotification.error({
        message: (err as Error).message,
        title: "Error",
      });
      error.value = (err as Error).message;
    } finally {
      loading.close();
      isLoading.value = false;
    }
  }

  async function updateUser(user: User) {
    isLoading.value = true;
    try {
      const updated = await mockApi.updateUser(user.id, user);
      const index = users.value.findIndex((u) => u.id === user.id);
      if (index !== -1) users.value[index] = updated;
    } catch (err) {
      error.value = (err as Error).message;
    } finally {
      isLoading.value = false;
    }
  }

  async function deleteUser(id: number) {
    isLoading.value = true;
    try {
      users.value = users.value.filter((u) => u.id !== id);
      await mockApi.deleteUser(id);
      router.back();
    } catch (err) {
      error.value = (err as Error).message;
      fetchUsers({});
    } finally {
      isLoading.value = false;
    }
  }

  function setLocale(newLocale: string) {
    preferredLocale.value = newLocale;
  }

  return {
    users,
    currentUser,
    isLoading,
    error,
    totalUsers,
    preferredLocale,
    fetchUsers,
    updateUser,
    deleteUser,
    setLocale,
  };
});
