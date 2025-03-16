import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '../../stores/useStore';
import { describe, it, expect, beforeEach } from 'vitest';

describe('User Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('fetches users successfully', async () => {
    const store = useUserStore();
    await store.fetchUsers({});
    expect(store.users.length).toBeGreaterThan(0);
    expect(store.isLoading).toBe(false);
  });
});