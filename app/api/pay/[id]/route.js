import { createPostResponse } from "@solana/actions";
import { PublicKey } from "@solana/web3.js";
import { lamportsFromSol } from "../../../lib/lamports";
import { getDepositInstruction } from "../../../generated/vault";

// NOTE:
// This endpoint is a minimal Solana Actions implementation so the Blink UI can
// trigger a real wallet signing flow.
//
// It uses the existing Anchor vault program deposit instruction as the
// underlying transaction, because BlinkPay’s current on-chain program is a
// SOL vault (deposit/withdraw). Split/recurring are handled in the UI for now.

export async function POST(req, { params }) {
  const id = params?.id;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing blink id" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const url = new URL(req.url);
  const searchParams = url.searchParams;

  // The Solana Actions flow sends user parameters as querystring values.
  const amountStr = searchParams.get("amount") ?? "";
  const message = searchParams.get("message") ?? "";

  const amount = Number(amountStr);
  if (!Number.isFinite(amount) || amount <= 0) {
    return new Response(JSON.stringify({ error: "Invalid amount" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // The actions library expects a transaction builder.
  // Wallet adapter / the actions runtime will provide `account` (the payer)
  // to the function below.
  const { account } = await req.json().catch(() => ({ account: null }));

  const postResponse = await createPostResponse({
    fields: {
      amount: amountStr,
      message,
    },
    // The on-chain instruction: deposit SOL into a PDA vault.
    // We derive the vault PDA inside the generated instruction builder.
    // The deposit instruction takes `signer` (payer) + `vault` (resolved via PDA).
    //
    // `account` is expected to be the payer public key.
    // If the request doesn’t provide it, we return an error.
    async transaction(account) {
      if (!account) {
        throw new Error("Missing payer account for action transaction");
      }

      const payer = new PublicKey(account);

      const instruction = await getDepositInstruction({
        signer: payer,
        amount: lamportsFromSol(amount),
      });

      return {
        instructions: [instruction],
      };
    },
  });

  return postResponse;
}

