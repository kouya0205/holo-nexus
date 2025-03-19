"use client";
import { Box, Step, StepLabel, Stepper } from "@mui/material";
import { User } from "@supabase/supabase-js";
import { Fragment, useState } from "react";

import { BreadCrumb } from "@/components/brandcrumb";

import Page1 from "./page1";
import Page2 from "./page2";
import Page3 from "./page3";

const steps = ["リーダーカード選択", "その他のカード選択", "デッキ情報入力"];

export type cardData = {
  card_id: number;
  card_name: string;
  color: string;
  type: string | null;
  release_deck: string | null;
  buzzholomencards: [] | null;
  holomencards: [] | null;
  oshiholomencards: { card_id: number; life_count: number };
  type_list: [] | null;
  updated_at: string | null;
  created_at: string | null;
  rarity: string | null;
  image_url: string | null;
};

export default function DeckCreate({ cardData, user }: { cardData: cardData[] | null; user: User }) {
  const [activeStep, setActiveStep] = useState(0);
  const [leaderCard, setLeaderCard] = useState<number>(0);
  const [card, setCard] = useState<{ [id: string]: number }>({});

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return (
          <Page1 cardData={cardData} handleBack={handleBack} handleNext={handleNext} handleLeaderCard={setLeaderCard} />
        );
      case 1:
        return (
          <Page2
            cardData={cardData}
            handleBack={handleBack}
            handleNext={handleNext}
            handleCard={setCard}
            leaderCard={leaderCard}
          />
        );
      case 2:
        return (
          <Page3
            cardData={cardData}
            handleNext={handleNext}
            card={card}
            leaderCard={leaderCard}
            handleBack={handleBack}
            user={user}
          />
        );
      default:
        return null;
    }
  };

  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Decklist", href: "/decklist" },
    { label: "DeckCreate", href: "/deckcreate" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-100">
      <BreadCrumb paths={breadcrumbPaths} />
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
          minHeight: "90vh",
          bgcolor: "background.paper",
          p: 4,
          mt: 4,
          borderRadius: 4,
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step
              key={label}
              sx={{
                "& .MuiStepIcon-root.Mui-active": {
                  color: "#534B88",
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: "#534B88",
                },
              }}
            >
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Fragment>{renderStepContent(activeStep)}</Fragment>
      </Box>
    </div>
  );
}
