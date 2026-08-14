import type { NextApiRequest, NextApiResponse } from "next";
import { LeadContact } from "@/lib/types";

type ResponseData = { success: true; booking: LeadContact } | { success: false; error: string };

export default function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, error: "Method not allowed" });
    return;
  }

  const {
    name,
    phone,
    email,
    contactMethod,
    comments,
    destination,
    travelers,
    duration,
    transport,
    transfer,
    hotel,
    totalCostUsd,
  } = req.body ?? {};

  if (!name || !phone) {
    res.status(400).json({ success: false, error: "Имя и номер телефона обязательны для связи" });
    return;
  }

  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const bookingId = `DYR-${randomNum}`;

  const leadRecord: LeadContact = {
    bookingId,
    name,
    phone,
    email: email || "",
    contactMethod: contactMethod || "telegram",
    comments: comments || "",
    destination: destination || "samarkand",
    travelers: travelers || { type: "couple", adults: 2, children: 0, total: 2 },
    duration: duration || { totalDays: 3, activeDays: 3, restDays: 0 },
    transport,
    transfer,
    hotel,
    totalCostUsd: totalCostUsd || 0,
    createdAt: new Date().toISOString(),
  };

  res.status(200).json({ success: true, booking: leadRecord });
}
