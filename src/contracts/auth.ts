import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  username: z.string().min(3, 'Username deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  avatarUrl: z.string().optional(),
  bio: z.string().max(300).optional(),
  createdAt: z.string(),
});
export type User = z.infer<typeof UserSchema>;

export const LoginRequestSchema = z.object({
  emailOrUsername: z.string().min(3, 'Informe seu e-mail ou nome de usuário'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const RegisterRequestSchema = z.object({
  name: z.string().min(2, 'Nome completo é obrigatório'),
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;

export const ChangePasswordRequestSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});
export type ChangePasswordRequest = z.infer<typeof ChangePasswordRequestSchema>;

export const AuthResponseSchema = z.object({
  user: UserSchema,
  token: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
