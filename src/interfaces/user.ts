export interface User {
  id: number;
  name: string;
  role: 'admin' | 'manager' | 'viewer';
  status: 'active' | 'inactive';
  dateJoined: string;
}