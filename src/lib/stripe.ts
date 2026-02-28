export type CreateCheckoutSessionInput = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  email?: string;
  uid?: string;
};

type StripeCheckoutSession = {
  url?: string;
};

type StripeCustomer = {
  id: string;
};

type StripeSubscription = {
  id: string;
  status: string;
  cancel_at_period_end: boolean;
  current_period_end?: number;
};

type StripeErrorResponse = {
  error?: {
    message?: string;
  };
};

function getSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }

  return secretKey;
}

async function stripePost<T>(path: string, params: URLSearchParams): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const json = (await response.json()) as T & StripeErrorResponse;

  if (!response.ok) {
    throw new Error(json.error?.message || "Stripe request failed");
  }

  return json as T;
}

async function stripeGet<T>(path: string, query: URLSearchParams): Promise<T> {
  const response = await fetch(`https://api.stripe.com/v1/${path}?${query.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
    },
  });

  const json = (await response.json()) as T & StripeErrorResponse;

  if (!response.ok) {
    throw new Error(json.error?.message || "Stripe request failed");
  }

  return json as T;
}

export function getBaseUrl(requestUrl?: string) {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }

  if (requestUrl) {
    return new URL(requestUrl).origin;
  }

  return "http://localhost:3000";
}

export async function createCheckoutSession(input: CreateCheckoutSessionInput) {
  const params = new URLSearchParams();
  params.set("mode", "subscription");
  params.set("line_items[0][price]", input.priceId);
  params.set("line_items[0][quantity]", "1");
  params.set("allow_promotion_codes", "true");
  params.set("success_url", input.successUrl);
  params.set("cancel_url", input.cancelUrl);

  if (input.email) {
    params.set("customer_email", input.email);
  }

  if (input.uid) {
    params.set("client_reference_id", input.uid);
    params.set("metadata[userId]", input.uid);
    params.set("metadata[firebaseUid]", input.uid);
    params.set("subscription_data[metadata][userId]", input.uid);
    params.set("subscription_data[metadata][firebaseUid]", input.uid);
  }

  return stripePost<StripeCheckoutSession>("checkout/sessions", params);
}

export async function findCustomerByEmail(email: string) {
  const query = new URLSearchParams();
  query.set("email", email);
  query.set("limit", "1");

  const result = await stripeGet<{ data: StripeCustomer[] }>("customers", query);
  return result.data[0];
}

export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  const params = new URLSearchParams();
  params.set("customer", customerId);
  params.set("return_url", returnUrl);

  return stripePost<{ url: string }>("billing_portal/sessions", params);
}

export async function listSubscriptions(customerId: string) {
  const query = new URLSearchParams();
  query.set("customer", customerId);
  query.set("status", "all");
  query.set("limit", "10");

  const result = await stripeGet<{ data: StripeSubscription[] }>("subscriptions", query);
  return result.data;
}

export function pickCurrentSubscription(subscriptions: StripeSubscription[]) {
  return subscriptions.find((subscription) =>
    ["active", "trialing", "past_due"].includes(subscription.status),
  );
}

async function updateSubscriptionCancelAtPeriodEnd(subscriptionId: string, cancelAtPeriodEnd: boolean) {
  const params = new URLSearchParams();
  params.set("cancel_at_period_end", cancelAtPeriodEnd ? "true" : "false");

  return stripePost<StripeSubscription>(`subscriptions/${subscriptionId}`, params);
}

export async function cancelSubscriptionAtPeriodEnd(subscriptionId: string) {
  return updateSubscriptionCancelAtPeriodEnd(subscriptionId, true);
}

export async function resumeSubscriptionAtPeriodEnd(subscriptionId: string) {
  return updateSubscriptionCancelAtPeriodEnd(subscriptionId, false);
}
