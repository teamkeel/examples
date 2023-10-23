---
tags: context, identity
title: Fetching the account of the currently signed in users
---

# Fetching the account of the currently signed in user

Create a get action called `myAccount` on the accounts model. This action takes no inputs as we'll then do the filtering manually with a `@where`

A get action needs a unique input. As the relationship between Account and Identity models is marked as unique, we can use the identity in context (the logged in user) to fetch their account.

```keel
@where(ctx.identity == account.identity)
```
