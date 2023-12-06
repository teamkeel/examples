# Clerk auth + Keel

This example provides a minimal setup to use Clerk auth with Keel.

Process overview

1. Login with Clerk
1. Exchange Clerk token for Keel token
1. Make Keel requests with the Keel token

## Clerk setup

Out of the box Clerk doesn't completely follow the OpenID Connect spec so you need to use a custom JWT template on the clerk side.

In the Clerk console, create a new JWT template and set the following claims.

N.B. The `aud` claim can be any string but just needs to match the value in your `keelconfig.yaml`

```json
{
  "aud": "keel",
  "email": "{{user.primary_email_address}}",
  "email_verified": "{{user.email_verified}}"
}
```

When fetching a Clerk token, use that new JWT template name. In this example this is happening at `./src/keel/index.tsx:37`

```js
getToken({ template: "keel" });
```

Finally, rename `.env.example` to `.env` and set your `VITE_REACT_APP_CLERK_PUBLISHABLE_KEY`

## Keel setup

Add Clerk as an auth provider in your `keelconfig.yaml` file

```yaml
auth:
  providers:
    - type: oidc
      name: clerk
      issuerUrl: "https://artistic-ostrich-8.clerk.accounts.dev" # Your Clerk url
      clientId: "keel" # Must match the Clerk JWT aud claim
```
