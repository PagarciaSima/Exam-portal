export interface User {
  id?: number;
  username: string;
  password?: string;   
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enabled?: boolean;
  profile?: string;
  authorities?: { authority: string }[]; 
}