export class User {
    id?: string; 
    email: string;
    password: string;
    fullName: string;
    role: 'admin' | 'user';
    googleId?: string;
  
    constructor(partial: Partial<User>) {
      Object.assign(this, partial);
    }
  }
  