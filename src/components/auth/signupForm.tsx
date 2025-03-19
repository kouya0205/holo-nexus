import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CircleChevronRight } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { useFormState } from "react-dom";

import { authConfig } from "@/config/auth";
import { signupSchema } from "@/config/schema";
import { signup } from "@/hooks/useActions";

import { Separate } from "../separate";
import { Button } from "../ui/button";
import { CardContent, CardFooter } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export const SignupForm: FC = () => {
  const [lastResult, action] = useFormState(signup, undefined);
  const [form, fields] = useForm({
    // 前回の送信結果を同期
    lastResult,

    // クライアントでバリデーション・ロジックを再利用する
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signupSchema });
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
            <Label htmlFor="email">{authConfig.signup.email.label}</Label>
            <Input
              id="email"
              type="email"
              placeholder={authConfig.signup.email.placeholder}
              className="focus:border-[#349BD1] focus:ring-[#349BD1]"
              key={fields.email.key}
              name={fields.email.name}
              defaultValue={fields.email.initialValue}
            />
            <div className="text-xs text-red-600">{fields.email.errors}</div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="username">{authConfig.signup.username.label}</Label>
            <Input
              id="username"
              type="text"
              placeholder={authConfig.signup.username.placeholder}
              className="focus:border-[#349BD1] focus:ring-[#349BD1]"
              key={fields.username.key}
              name={fields.username.name}
              defaultValue={fields.username.initialValue}
            />
            <div className="text-xs text-red-600">{fields.username.errors}</div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">{authConfig.signup.password.label}</Label>
            <Input
              id="password"
              type="password"
              placeholder={authConfig.signup.password.placeholder}
              className="focus:border-[#349BD1] focus:ring-[#349BD1]"
              key={fields.password.key}
              name={fields.password.name}
              defaultValue={fields.password.initialValue}
            />
            <div className="text-xs text-red-600">{fields.password.errors}</div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">{authConfig.signup.confirmPassword.label}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={authConfig.signup.confirmPassword.placeholder}
              className="focus:border-[#349BD1] focus:ring-[#349BD1]"
              key={fields.confirmPassword.key}
              name={fields.confirmPassword.name}
              defaultValue={fields.confirmPassword.initialValue}
            />
            <div className="text-xs text-red-600">{fields.confirmPassword.errors}</div>
          </div>
          {/* checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              className="focus:border-[#349BD1] focus:ring-[#349BD1]"
              key={fields.acceptCheckbox.key}
              name={fields.acceptCheckbox.name}
              defaultChecked={fields.acceptCheckbox.initialValue === "on"}
            />
            <Label htmlFor="terms" className="font-thin">
              <Link
                href="https://dot-scallop-d45.notion.site/5103947e446548ca8a9d7191fa512be7"
                target="_blank"
                className="text-[#349BD1] hover:underline"
              >
                利用規約
              </Link>
              に同意します。
            </Label>
          </div>
          <div className="text-xs text-red-600">{fields.acceptCheckbox.errors}</div>
        </CardContent>
        <CardFooter className="flex flex-col py-0">
          <Button className="w-full bg-[#349BD1] text-white hover:bg-[#38B8EA]">
            {authConfig.signup.button} <CircleChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Separate />
        </CardFooter>
      </form>
    </>
  );
};
