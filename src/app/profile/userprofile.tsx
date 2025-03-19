import { type User } from "@supabase/supabase-js";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import AccountSettingModal from "./accountSetting";

export default function UserProfile({
  profile,
  user,
  isEditable = false,
}: {
  profile: any;
  user: User | null;
  isEditable?: boolean | null;
}) {
  const snsAccounts = user?.app_metadata?.providers || [];

  const haveSNSAccount = (provider: string) => {
    return snsAccounts.includes(provider);
  };

  const providerIcons: { [provider: string]: JSX.Element } = {
    google: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
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
    twitter: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 1024 1024">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M921 912L601.11 445.745l.546.437L890.084 112h-96.385L558.738 384L372.15 112H119.367l298.648 435.31l-.036-.037L103 912h96.385l261.222-302.618L668.217 912zM333.96 184.727l448.827 654.546h-76.38l-449.19-654.546z"
        />
      </svg>
    ),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <div>
          {profile.avatar_url ? (
            <Avatar className="h-32 w-32">
              <AvatarImage src={profile.avatar_url} alt="avatar" />
              <AvatarFallback>
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200" />
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200" />
          )}
        </div>
        <Link href="/articles" className="flex w-1/3 flex-col items-center justify-center">
          <h1 className="text-2xl font-semibold">{profile.userArticlesCount}</h1>
          <p className="text-sm text-gray-500">投稿数</p>
        </Link>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col py-2">
          <div className="flex w-auto items-center gap-2">
            <h1 className="text-xl font-semibold">{profile.username || ""}</h1>
            {haveSNSAccount.length > 0 ? (
              <div className="flex">
                {snsAccounts.map((provider: string) => (
                  <div key={provider}>{providerIcons[provider]}</div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
        <div className="flex flex-col py-2">{isEditable && <AccountSettingModal profile={profile} />}</div>
      </div>
    </div>
  );
}
