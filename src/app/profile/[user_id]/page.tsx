import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ProfileSkelton } from "@/components/profileSkelton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { createClient } from "../../../../utils/supabase/server";
import UserProfile from "../../profile/userprofile";

export default async function UserProfilePage({ params }: { params: { user_id: string } }) {
  const supabase = createClient();

  // 現在ログインしているユーザーを取得
  const { data: userData } = await supabase.auth.getUser();
  const currentUser = userData.user;

  // 表示対象のユーザープロフィールを取得
  const { data: profileData, error } = await supabase.from("users").select("*").eq("id", params.user_id).single();

  if (error) {
    console.error("プロフィールの取得中にエラーが発生しました:", error);
    redirect("/");
  }

  const profile = profileData;

  // ユーザーの記事数を取得
  const { count: userArticlesCount } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  profile.userArticlesCount = userArticlesCount || 0;

  // 現在のユーザーが表示対象のプロフィールの所有者かどうか
  const isOwner = currentUser && currentUser.id === profile.id;

  return (
    <Suspense fallback={<ProfileSkelton />}>
      <div className="mx-auto flex min-h-screen justify-center p-4">
        <Card className="w-[460px]">
          <CardContent>
            <CardHeader></CardHeader>
            <UserProfile profile={profile} user={currentUser} isEditable={isOwner} />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
