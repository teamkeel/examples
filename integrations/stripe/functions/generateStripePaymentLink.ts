import { GenerateStripePaymentLink, permissions, models, useDatabase } from '@teamkeel/sdk';
import Stripe from 'stripe';

export default GenerateStripePaymentLink(async (ctx, inputs) => {
  try {
    // This is where you implement any auth logic
    permissions.allow();

    // Get the order data
    const order = await models.order.findOne({ id: inputs.id });
    // Check the order exists
    if (!order) {
      throw new Error(`Order data not found for ID ${inputs.id}`);
    }
    // Check if the payment link has already been created
    if (order.stripePaymentLink) {
      throw new Error("Payment link already generated for this order");
    }
    const stripeSecretKey = ctx.secrets.STRIPE_SECRET_KEY;
    const stripe = new Stripe(stripeSecretKey);
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
    const lineItems = orderItemsPrices.map((row) => {
      return {
        price: row.stripePriceId!,
        quantity: row.quantity
      }
    });
    // Create a stripe payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: lineItems
    });
    // Update the order with the new payment link
    const where = { id: inputs.id };
    const values = { stripePaymentLink: paymentLink.url };
    await models.order.update(where, values);
    return paymentLink.url;
  } catch (error) {
    throw error;
  }
});