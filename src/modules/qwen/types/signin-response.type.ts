export interface SignInResponse {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'pending';
  token: string;
}
