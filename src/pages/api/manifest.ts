import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { type AppManifest } from "@saleor/app-sdk/types";

import packageJson from "../../../package.json";
import { paymentGatewayInitializeSessionSyncWebhook } from "./webhooks/saleor/payment-gateway-initialize-session";
import { transactionInitializeSessionSyncWebhook } from "./webhooks/saleor/transaction-initialize-session";
import { transactionCancelationRequestedSyncWebhook } from "./webhooks/saleor/transaction-cancelation-requested";
import { transactionChargeRequestedSyncWebhook } from "./webhooks/saleor/transaction-charge-requested";
import { transactionProcessSessionSyncWebhook } from "./webhooks/saleor/transaction-process-session";
import { transactionRefundRequestedSyncWebhook } from "./webhooks/saleor/transaction-refund-requested";

import { env } from "@/lib/env.mjs";

const apiBaseUrl = env.VERCEL_URL ?? "toto";

export default createManifestHandler({
  async manifestFactory(context) {
    const manifest: AppManifest = {
      id: "app.saleor.stripe",
      name: "Stripe",
      about: packageJson.description,
      tokenTargetUrl: `${context.appBaseUrl}/api/register`,
      appUrl: `${context.appBaseUrl}`,
      permissions: ["HANDLE_PAYMENTS"],
      version: packageJson.version,
      requiredSaleorVersion: ">=3.14.0",
      homepageUrl: "https://github.com/saleor/saleor-app-payment-stripe",
      supportUrl: "https://github.com/saleor/saleor-app-payment-stripe/issues",
      brand: {
        logo: {
          default: `${context.appBaseUrl}/logo.png`,
        },
      },
      webhooks: [
        paymentGatewayInitializeSessionSyncWebhook.getWebhookManifest(apiBaseUrl),
        transactionInitializeSessionSyncWebhook.getWebhookManifest(apiBaseUrl),
        transactionProcessSessionSyncWebhook.getWebhookManifest(apiBaseUrl),
        transactionCancelationRequestedSyncWebhook.getWebhookManifest(apiBaseUrl),
        transactionChargeRequestedSyncWebhook.getWebhookManifest(apiBaseUrl),
        transactionRefundRequestedSyncWebhook.getWebhookManifest(apiBaseUrl),
      ],
      extensions: [],
    };

    return manifest;
  },
});
