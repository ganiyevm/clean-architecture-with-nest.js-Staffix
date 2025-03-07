export class ResetPasswordDto {
    email: string;
  }
  
  export class UpdatePasswordDto {
    token: string;
    newPassword: string;
  }