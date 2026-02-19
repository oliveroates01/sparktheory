import { NextResponse } from "next/server";
import {
  createBillingPortalSession,
  findCustomerByEmail,
  getBaseUrl,
} from "@/lib/stripe";

type PortalPayload = {
  email?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json().catch(() => ({}))) as PortalPayload;

    if (!payload.email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const customer = await findCustomerByEmail(payload.email);

    if (!customer) {
      return NextResponse.json(
        { error: "No Stripe customer found for this email" },
        { status: 404 },
      );
    }

    const portalSession = await createBillingPortalSession(
      customer.id,
      `${getBaseUrl(request.url)}/account`,
    );

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Billing portal failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
