This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stripe setup

Add these values to `.env.local`:

```bash
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PRICE_ID=price_xxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Notes:
- `STRIPE_PRICE_ID` should be a recurring price ID for your subscription product.
- `NEXT_PUBLIC_BASE_URL` should match your deployed domain in production.
- Billing Portal must be enabled/configured in your Stripe Dashboard.

## Included Stripe endpoints

- `POST /api/stripe/checkout`: creates a Stripe Checkout session.
- `POST /api/stripe/portal`: opens Stripe Billing Portal for an existing customer email.

Both are wired from `/account` page buttons.
