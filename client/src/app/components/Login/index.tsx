"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Nova importação para Next.js 13+
import {
  getUserFavorites,
  getUserHistory,
  loginUser,
} from "@/app/services/authService";
import Image from "next/image";
import dicionario from "../../../../public/images/dicionario.png";

export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { token } = await loginUser(email, password);
      localStorage.setItem("token", token);

      const [favorites, history] = await Promise.all([
        getUserFavorites(token),
        getUserHistory(token),
      ]);

      localStorage.setItem("favorites", JSON.stringify(favorites));
      localStorage.setItem("history", JSON.stringify(history));

      router.push("/dashboard");
    } catch (err) {
      setError("Falha ao fazer login");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 text-white bg-gradient-to-br from-gray-800 to-black">
      <Image
        src={dicionario}
        alt="foto Promoçoes"
        width={470}
        height={371}
        quality={100}
        placeholder="blur"
        loading="lazy"
        className="w-full max-w-xs sm:max-w-md lg:max-w-lg rounded-xl shadow-lg"
      />
      <div className="w-full max-w-md mt-8 space-y-8 bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg backdrop-blur-md">
        <h2 className="text-center text-3xl font-extrabold text-[#FF6B00]">
          Fazer Login
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-center text-red-500 bg-red-100 p-2 rounded">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              E-mail
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="block w-full appearance-none rounded-md border border-gray-300 bg-white text-black px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[#FF6B00] focus:outline-none focus:ring-1 focus:ring-[#FF6B00] sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Senha
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="block w-full appearance-none rounded-md border border-gray-300 bg-white text-black px-3 py-2 placeholder-gray-400 shadow-sm focus:border-[#FF6B00] focus:outline-none focus:ring-1 focus:ring-[#FF6B00] sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#FF6B00] py-2 px-4 text-sm font-medium text-white shadow-lg transition duration-300 ease-in-out hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] focus:ring-offset-2 focus:ring-offset-black"
            >
              Entrar
            </button>
          </div>
          <div>
            <p className="mt-2 text-center text-sm text-gray-300">
              Não tem uma conta?
              <Link
                href="/register"
                className="ml-2 font-medium text-[#FF6B00] transition-transform duration-300 ease-in-out hover:scale-105 hover:brightness-110"
              >
                Criar Conta
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
