export interface User {
  id?: number;
  username: string;
  password?: string;   // opcional → solo se usa al crear/editar
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  enabled?: boolean;
  profile?: string;
  authorities?: { authority: string }[]; // opcional → solo viene en el DTO
}