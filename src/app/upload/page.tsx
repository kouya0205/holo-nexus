import { createClient } from "../../../utils/supabase/server";
import UploadForm from "./uploadform";

export default async function UploadPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin1 = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const admin2 = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL2;

  return admin1 || admin2 ? (
    <div className="container mx-auto">
      <UploadForm />
    </div>
  ) : (
    <div className="container mx-auto">
      <h1>許可されていません</h1>
    </div>
  );
}
