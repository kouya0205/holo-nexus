import { NextResponse } from "next/server";

import { createClient } from "../../../../utils/supabase/server";

export async function GET() {
  const supabase = createClient();

  try {
    const { data: cardData, error: getError } = await supabase
      .from("cards")
      .select("*, holomencards(*), oshiholomencards(*), buzzholomencards(*), type_list(*)");

    if (getError) {
      return NextResponse.json({ error: "Failed to get cards" }, { status: 500 });
    }

    return NextResponse.json({ cardData }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
