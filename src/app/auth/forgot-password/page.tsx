"use client";

import { useState } from "react";

import { createClient } from "../../../../utils/supabase/client";

export default function ForgotPassword() {
  const supabase = createClient();
  const [email, setEmail] = useState("");

  const onSubmit = async () => {
    try {
      const { error: sendEmailError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:3000/passwordReset/",
      });
      if (sendEmailError) {
        throw sendEmailError;
      }
      alert("パスワード設定メールを確認してください");
    } catch (error) {
      alert("エラーが発生しました");
    }
  };

  return (
    <>
      <div>
        <main>
          <div>
            <form onSubmit={onSubmit}>
              <div>
                <label>登録メールアドレス</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <button type="submit">メールを送信</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
