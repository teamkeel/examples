import { GenerateStripeInvoice, permissions, models, useDatabase } from '@teamkeel/sdk';
import Stripe from 'stripe';

export default GenerateStripeInvoice(async (ctx, inputs) => {
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
    // Error if no corresponding Stripe ID for the customer
    const customer = await models.customer.findOne({ id: order.customerId });
    // Check the customer exists
    if (!customer) {
      throw new Error(`Customer data not found for ID ${order.customerId}`);
    }
    // Error if the Stripe ID has not been set
    if (!customer.stripeCustomerId) {
      throw new Error("Stripe customer ID missing from customer data");
    }
    const stripeSecretKey = ctx.secrets.STRIPE_SECRET_KEY;
    const stripe = new Stripe(stripeSecretKey);
    // Create the invoice params data
    const invoiceParams: Stripe.InvoiceCreateParams = {
      customer: customer.stripeCustomerId,
      currency: 'usd',
      auto_advance: false,
    };
    // Create the new invoice
    const stripeInvoice: Stripe.Invoice = await stripe.invoices.create(invoiceParams);

    // Use a databse API query to fetch the order items and their Stripe price IDs
    const db = useDatabase();
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
      // Create the invoice items params
      const invoiceItemParams: Stripe.InvoiceItemCreateParams = {
        customer: customer.stripeCustomerId,
        price: item.stripePriceId!,
        invoice: stripeInvoice.id,
        quantity: item.quantity,
      };
      // Create the new invoice item
      await stripe.invoiceItems.create(invoiceItemParams);
    }
    // Create Stripe shipping params object
    const addressParams: Stripe.ShippingAddressParam = {
      line1: customer.addressLineOne,
      line2: customer.addressLineTwo,
      city: customer.addressCity,
      state: customer.addressState,
      country: "US",
      postal_code: customer.addressPostalCode,
    };
    // Create shipping details params object
    const shippingDetailsParams: Stripe.InvoiceCreateParams.ShippingDetails = {
      name: customer.name,
      address: addressParams,
    };
    // Update Stripe invoice to add a shipping address
    await stripe.invoices.update(
      stripeInvoice.id,
      {
        shipping_details: shippingDetailsParams,
        // We could add shipping fees here too
        //shipping_cost: Stripe.InvoiceCreateParams.ShippingCost
      }
    );
    // Finalise the invoice in Stripe in order to allow payment
    const stripeInvoiceFinalised = await stripe.invoices.finalizeInvoice(stripeInvoice.id);
    // Update the order with the new Stripe invoice ID and payment link
    const where = { id: inputs.id };
    const values = {
      stripeInvoiceId: stripeInvoice.id,
      stripePaymentLink: stripeInvoiceFinalised.hosted_invoice_url,
    };
    const orderUpdate = await models.order.update(where, values);
    return stripeInvoiceFinalised.hosted_invoice_url;
  } catch (error) {
    throw error;
  }
});