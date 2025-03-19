"use client";

import { useState } from "react";

import CustomAlert from "@/components/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAlert } from "@/hooks/useAlert";

import ProfileForm from "./profileForm";
import { Profile } from "@/types";

export default function AccountSettingModal({ profile }: { profile: Profile }) {
  const [open, setOpen] = useState(false);
  const { alertOpen, alertMessage, alertSeverity, showAlert, handleAlertClose } = useAlert();

  function onProfileUpdate(success: boolean, message: string) {
    setOpen(false);
    showAlert(message, success ? "success" : "error");
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">プロフィールを編集</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>プロフィールを編集</DialogTitle>
          </DialogHeader>
          <ProfileForm profile={profile} onProfileUpdate={onProfileUpdate} />
        </DialogContent>
      </Dialog>
      <CustomAlert open={alertOpen} onClose={handleAlertClose} message={alertMessage} severity={alertSeverity} />
    </>
  );
}
