import CreateArticleEditor from "@/components/new-editor";
import { createClient } from "@/utils/supabase/server";

export default async function CreateArticle() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto min-h-screen flex justify-center p-4">
      <CreateArticleEditor user={user} />
    </div>
  );
}
