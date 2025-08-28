export interface User {
    id?: number;           
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    enabled?: boolean;
    profile?: string;    
}