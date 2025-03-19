import { AuthConfig } from "@/types";

export const authConfig: AuthConfig = {
  tab: {
    login: "ログイン",
    signup: "会員登録",
  },
  login: {
    title: "ログイン",
    description: "メールアドレスとパスワードを入力してください。",
    button: "ログイン",
    email: {
      label: "メールアドレス",
      placeholder: "example@xxx.com",
    },
    password: {
      label: "パスワード",
      placeholder: "••••••",
    },
  },
  signup: {
    title: "会員登録",
    description: "以下の情報を入力し、会員登録を行なってください。",
    button: "会員登録",
    email: {
      label: "メールアドレス",
      placeholder: "example@xxx.com",
    },
    username: {
      label: "ユーザー名",
      placeholder: "ユーザー名を入力",
    },
    password: {
      label: "パスワード",
      placeholder: "••••••",
    },
    confirmPassword: {
      label: "パスワード(確認用)",
      placeholder: "••••••",
    },
  },
};
