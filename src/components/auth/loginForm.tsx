import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CircleChevronRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { useFormState } from "react-dom";

import { authConfig } from "@/config/auth";
import { loginSchema } from "@/config/schema";
import { emailLogin } from "@/hooks/useActions";

import { Separate } from "../separate";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const LoginForm: FC = () => {
  const [lastResult, action] = useFormState(emailLogin, undefined);
  const [form, fields] = useForm({
    // 前回の送信結果を同期
    lastResult,

    // クライアントでバリデーション・ロジックを再利用する
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: loginSchema });
    },

    // blurイベント発生時にフォームを検証する
    shouldValidate: "onBlur",
  });

  return (
    <>
      <form id={form.id} onSubmit={form.onSubmit} action={action} noValidate>
        <CardContent className="space-y-2">
          <div id={form.errorId} className="text-xs text-red-600">
            {form.errors}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">{authConfig.login.email.label}</Label>
            <Input
              key={fields.email.key}
              name={fields.email.name}
              defaultValue={fields.email.initialValue}
              id="email"
              type="email"
              placeholder={authConfig.login.email.placeholder}
              className="focus:border-[#349BD1] focus:ring-[#349BD1]"
            />
            <div className="text-xs text-red-600">{fields.email.errors}</div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">{authConfig.login.password.label}</Label>
            <Input
              id="password"
              type="password"
              placeholder={authConfig.login.password.placeholder}
              className="focus:border-[#349BD1] focus:ring-[#349BD1]"
              key={fields.password.key}
              name={fields.password.name}
              defaultValue={fields.password.initialValue}
            />
            <div className="text-xs text-red-600">{fields.password.errors}</div>
          </div>
          <div className="space-y-1">
            <Link href="/auth/forgot-password" className="text-xs text-[#349BD1] hover:underline">
              パスワードを忘れた方はこちら
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col py-0">
          <Button className="w-full bg-[#349BD1] text-white hover:bg-[#38B8EA]">
            {authConfig.login.button} <CircleChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Separate />
        </CardFooter>
      </form>
    </>
  );
};
