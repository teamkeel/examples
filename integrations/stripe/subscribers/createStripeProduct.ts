import { CreateStripeProduct, models } from '@teamkeel/sdk';
import Stripe from 'stripe';

export default CreateStripeProduct(async (ctx, event) => {
  try {
    const stripeSecretKey = ctx.secrets.STRIPE_SECRET_KEY;
    const stripe = new Stripe(stripeSecretKey);
    const productDataParams: Stripe.ProductCreateParams = {
      name: event.target.data.name,
    };
    // Create a product object in Stripe
    const stripeProduct = await stripe.products.create(productDataParams);
    // Price needs to be in cents for Stripe API
    const productPriceCents = Math.round(event.target.data.priceDollars * 100);
    const stripeBasePriceParams: Stripe.PriceCreateParams = {
      product: stripeProduct.id,
      currency: 'usd',
      unit_amount: productPriceCents,
    };
    // Create price object in Stripe
    const stripePrice = await stripe.prices.create(stripeBasePriceParams);
    const where = { id: event.target.data.id };
    const values = {
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id
    };
    // Update the product with the new Stripe IDs
    await models.product.update(where, values);
  } catch (error) {
    throw error;
  }
});