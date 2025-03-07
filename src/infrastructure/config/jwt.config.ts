export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'your_secret_key', 
    expiresIn: process.env.JWT_EXPIRES_IN || '1h', 
  };
  