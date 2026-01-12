import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "../../../libs/session";
import { redirect, RedirectType } from "next/navigation";

export async function GET(req: NextRequest) {
  await deleteSession();

  redirect("/", RedirectType.push);
}
