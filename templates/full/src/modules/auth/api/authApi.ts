import { asyncSleep } from "@shared";
import type { AuthUser } from "@modules";

const users: AuthUser[] = [
  { id: "1", name: "Admin", email: "admin@inverixo.io", role: "admin" }
];

const otpStore = new Map<string, string>();

export const authApi = {
  async login(email: string, password: string) {
    await asyncSleep(300);
    const user = users.find((item) => item.email === email);
    if (!user || password !== "password") {
      throw new Error("Invalid credentials");
    }
    return user;
  },
  async requestOtp(email: string) {
    await asyncSleep(200);
    const code = "123456";
    otpStore.set(email, code);
    return { message: "OTP sent", code };
  },
  async verifyOtp(email: string, code: string) {
    await asyncSleep(200);
    const stored = otpStore.get(email);
    if (!stored || stored !== code) {
      throw new Error("Invalid OTP");
    }
    const user = users.find((item) => item.email === email);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
  async register(name: string, email: string) {
    await asyncSleep(300);
    const existing = users.find((item) => item.email === email);
    if (existing) {
      throw new Error("Email already registered");
    }
    const user = { id: String(users.length + 1), name, email, role: "viewer" as const };
    users.push(user);
    return user;
  },
  async forgotPassword(email: string) {
    await asyncSleep(200);
    if (!users.find((item) => item.email === email)) {
      throw new Error("Email not found");
    }
    return { message: "Password reset email sent" };
  },
  async resetPassword(_password: string) {
    await asyncSleep(200);
    return { message: "Password updated" };
  },
  async logout() {
    await asyncSleep(150);
    return { message: "Logged out" };
  }
};
