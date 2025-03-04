import { CreateStripeCustomer, models } from "@teamkeel/sdk";
import Stripe from "stripe";

export default CreateStripeCustomer(async (ctx, event) => {
  try {
    const stripeSecretKey = ctx.secrets.STRIPE_SECRET_KEY;
    const stripe = new Stripe(stripeSecretKey);
    const params: Stripe.CustomerCreateParams = {
      name: event.target.data.name,
    };
    // Create a new customer in Stripe
    const stripeCustomer: Stripe.Customer = await stripe.customers.create(
      params
    );
    // Update the customer to add our new Stripe ID
    const where = { id: event.target.data.id };
    const values = { stripeCustomerId: stripeCustomer.id };
    await models.customer.update(where, values);
  } catch (error) {
    throw error;
  }
});