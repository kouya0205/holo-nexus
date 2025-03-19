"use client";

import { Provider } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { socialSignIn } from "@/hooks/useActions";
import React from "react";

type SocialProvider = {
  name: Provider;
  displayName: string;
  icon?: React.ReactNode;
  className?: string;
};

export function SocialAccount({ tab }: { tab: "login" | "signup" }) {
  const SocialProviders: SocialProvider[] = [
    {
      name: "google",
      displayName: "Google",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
      ),
      className: "text-gray-400 bg-white shadow-lg hover:bg-gray-100",
    },
    {
      name: "twitter",
      displayName: "X",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 1024 1024">
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M921 912L601.11 445.745l.546.437L890.084 112h-96.385L558.738 384L372.15 112H119.367l298.648 435.31l-.036-.037L103 912h96.385l261.222-302.618L668.217 912zM333.96 184.727l448.827 654.546h-76.38l-449.19-654.546z"
          />
        </svg>
      ),
      className: "text-white shadow-lg hover:bg-gray-700",
    },
  ];

  return (
    <div className="flex flex-col space-y-2">
      {SocialProviders.map((provider) => (
        <Button
          key={provider.name}
          onClick={async () => {
            await socialSignIn(provider.name);
          }}
          className={`flex items-center justify-start space-x-2 pl-7 ${provider.className}`}
        >
          {provider.icon}
          <span>
            {provider.displayName}で{tab === "login" ? "ログイン" : "会員登録"}
          </span>
        </Button>
      ))}
    </div>
  );
}
