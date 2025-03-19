"use client";

import Image from "next/image";

import { CardDetail } from "./cardDetail";

export default function ModalCard({ modalCard }: { modalCard: any }) {
  return (
    <div>
      <div className="flex flex-col justify-center p-6 md:flex-row">
        <Image
          src={modalCard.image_url}
          alt={modalCard.card_name}
          width={200}
          height={278}
          className="rounded-lg shadow-xl"
        />
        <div className="mt-4 space-y-2 md:ml-6 md:mt-0">
          <CardDetail cardDetail={modalCard} />
        </div>
      </div>
    </div>
  );
}
