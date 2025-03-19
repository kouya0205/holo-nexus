import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ImageListType } from "react-images-uploading";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { profileSchema } from "@/config/schema";
import { updateProfile } from "@/hooks/useActions";

import UploadAvatar from "./avatar";

interface ProfileFormProps {
  profile: any;
  onProfileUpdate: (success: boolean, message: string) => void;
}

type updateProfileType = {
  username: string;
};

export default function ProfileForm({ profile, onProfileUpdate }: ProfileFormProps) {
  const [imageUpload, setImageUpload] = useState<ImageListType>([
    {
      dataURL: profile.avatar_url || "",
    },
  ]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: profile.username || "" },
  });

  const onSubmit = (values: updateProfileType) => {
    let base64Image: string | undefined;

    startTransition(async () => {
      try {
        if (imageUpload[0].dataURL && imageUpload[0].dataURL.startsWith("data:image")) {
          const image = imageUpload[0];

          if (image.dataURL) {
            base64Image = image.dataURL;
          }
        }

        const res = await updateProfile({
          ...values,
          profile,
          base64Image,
        });

        switch (res?.success) {
          case false:
            onProfileUpdate(false, res?.message);
            break;
          case true:
            onProfileUpdate(true, res?.message);
            break;
        }
        router.refresh();
      } catch (error) {
        console.error("プロフィールの更新中にエラーが発生しました:", error);
      }
    });
  };

  return (
    <>
      <div className="form-widget">
        <UploadAvatar
          uid={profile.id}
          profile={profile}
          initialUrl={imageUpload}
          onUpload={(imageList: ImageListType) => setImageUpload(imageList)}
        />
        <Input defaultValue={profile.email} readOnly />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">ユーザネーム</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-bold" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              <span>変更</span>
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
