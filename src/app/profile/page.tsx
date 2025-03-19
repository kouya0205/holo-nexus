import { redirect } from "next/navigation";

import { createClient } from "../../../utils/supabase/server";

export default async function ProfileRedirect() {
  const supabase = createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    redirect("/login");
  }

  // ユーザー自身のプロフィールページにリダイレクト
  redirect(`/profile/${user.id}`);
}
