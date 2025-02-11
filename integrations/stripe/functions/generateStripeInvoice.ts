import { GenerateStripeInvoice, permissions, models, useDatabase } from '@teamkeel/sdk';
import Stripe from 'stripe';

export default GenerateStripeInvoice(async (ctx, inputs) => {
  try {
    // This is where you implement any auth logic
    permissions.allow();

    if (!inputs.customerStripeCustomerId) {
      throw new Error("Stripe customer ID missing from customer data");
    }
    const stripeSecretKey = ctx.secrets.STRIPE_SECRET_KEY;
    const stripe = new Stripe(stripeSecretKey);
    // Create the invoice params data
    const invoiceParams: Stripe.InvoiceCreateParams = {
      customer: inputs.customerStripeCustomerId,
      currency: 'usd',
      auto_advance: false,
    };
    // Create the new invoice
    const stripeInvoice: Stripe.Invoice = await stripe.invoices.create(invoiceParams);
    // Update the order with the new Stripe invoice ID
    const where = { id: inputs.id };
    const values = { stripeInvoiceId: stripeInvoice.id };
    await models.order.update(where, values);
    const db = useDatabase();
    // Use a databse API query to fetch the order items and their Stripe price IDs
    const orderItemsPrices = await db
      .selectFrom("order_item")
      .innerJoin("product", "product.id", "order_item.productId")
      .where("order_item.orderId", "=", inputs.id)
      .select(["order_item.quantity as quantity", "product.stripePriceId as stripePriceId"])
      .execute();
    // Error if we cannot find the order items or any reason
    if (orderItemsPrices.length < 1) {
      throw new Error(`No orderItems found for order.id: ${inputs.id}`);
    }
    // Error if any items ordered are missing Stripe price data
    if (orderItemsPrices.some((item) => item.stripePriceId == null)) {
      throw new Error("Stripe price object data missing for products in this order");
    }
    for (const item of orderItemsPrices) {
      // Create the invoice items parames
      const invoiceItemParams: Stripe.InvoiceItemCreateParams = {
        customer: inputs.customerStripeCustomerId,
        price: item.stripePriceId!,
        invoice: stripeInvoice.id,
        quantity: item.quantity,
      };
      // Create the new invoice item
      await stripe.invoiceItems.create(invoiceItemParams);
    }
  } catch (error) {
    throw error;
  }
});