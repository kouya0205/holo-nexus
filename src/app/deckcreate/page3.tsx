import { zodResolver } from "@hookform/resolvers/zod";
import { Box } from "@mui/material";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import CustomAlert from "@/components/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { createDeck } from "@/hooks/useActions";
import { useAlert } from "@/hooks/useAlert";

import { cardData } from "./deckCreate";

type Page3Props = {
  cardData: cardData[] | null;
  handleNext: () => void;
  handleBack: () => void;
  leaderCard: number;
  card: { [id: string]: number };
  user: User;
};

const formSchema = z.object({
  deckname: z.string().min(1).max(50),
  deckdescription: z.string().max(500),
  public: z.string().optional(),
});

export default function Page3({ cardData, handleNext, handleBack, leaderCard, card, user }: Page3Props) {
  const { alertOpen, alertMessage, alertSeverity, showAlert, handleAlertClose } = useAlert();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const leaderInfo = cardData.find((card) => card.card_id === leaderCard);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deckname: "",
      deckdescription: "",
      public: "general",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        const res = await createDeck({
          ...values,
          leaderInfo,
          card,
          userId: user.id,
        });
        showAlert(res.message, res.success ? "success" : "error");
        router.push(`/decklist/${res.deck_id}`);
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-[50%] space-y-8">
            <FormField
              control={form.control}
              name="deckname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>デッキ名を入力</FormLabel>
                  <FormControl>
                    <Input placeholder="デッキ1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deckdescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>デッキ概要</FormLabel>
                  <FormControl>
                    <Textarea placeholder="デッキの説明などを入力" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>公開設定</FormLabel>
                  <FormControl>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-3">
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="general" />
                        </FormControl>
                        <FormLabel className="font-normal">一般公開</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="limited" />
                        </FormControl>
                        <FormLabel className="font-normal">限定公開</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="private" />
                        </FormControl>
                        <FormLabel className="font-normal">非公開</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center gap-4">
              <Button type="button" onClick={handleBack} variant="outline">
                <span>戻る</span>
              </Button>
              <Button type="submit" className="font-bold" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin" />}
                <span>保存する</span>
              </Button>
            </div>
          </form>
        </Form>
      </Box>
      <CustomAlert open={alertOpen} onClose={handleAlertClose} message={alertMessage} severity={alertSeverity} />
    </>
  );
}
