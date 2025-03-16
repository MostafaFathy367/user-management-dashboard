import type { User } from "@/interfaces";

const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  role: i % 3 === 0 ? "admin" : i % 2 === 0 ? "manager" : "viewer",
  status: i % 4 === 0 ? "inactive" : "active",
  dateJoined: new Date(2023, i % 12, (i % 28) + 1).toISOString().split("T")[0],
}));

const roles = ["admin", "manager", "viewer"];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async getUsers({
    page = 1,
    limit = 50,
    search = "",
    role = "",
    status = "",
  }) {
    
    await delay(500);
    let result = mockUsers;
    if (search)
      result = result.filter((u) =>
        u.name.includes(search)
      );
    if (role) result = result.filter((u) => u.role === role);
    if (status) result = result.filter((u) => u.status === status);
    const start = (page - 1) * limit;
    const end = start + limit;
    return { data: result.slice(start, end), total: result.length };
  },

  async getUser(id: number) {
    await delay(300);
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw new Error("User not found");
    return user;
  },

  async updateUser(id: number, user: Partial<User>) {
    await delay(600);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    mockUsers[index] = { ...mockUsers[index], ...user };
    return mockUsers[index];
  },

  async createUser(user: Omit<User, "id">) {
    await delay(400);
    const newUser = { ...user, id: mockUsers.length + 1 };
    mockUsers.push(newUser);
    return newUser;
  },

  async deleteUser(id: number) {
    await delay(800);
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    mockUsers.splice(index, 1);
  },

  async getRoles() {
    await delay(300);
    return roles;
  },
};
