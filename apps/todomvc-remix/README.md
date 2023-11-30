---
title: TodoMVC (Remix)
tags: todo, todomvc, remix
---

This application is a minimal demo of how to use Keel with Remix, using Remix's support for loaders, form actions, and more. It also covers a full CRUD (Create, Read, Update, Delete) flow, along with authentication with an OIDC (OpenID Connect) provider.

## Getting Started

To get started, follow the steps below:

1. Clone this repository
2. Navigate to `./apps/todomvc-remix`
3. Copy `.env.tpl` to `.env` and fill in related values
4. Run `npm install` to install dependencies
5. Run `npm run dev` to start the development server
6. Open [http://localhost:3000](http://localhost:3000) in your browser

From there, you can play around with the application and see how it works.

## Authentication

This application uses Google as an OIDC provider. To use it, you'll need to create a [Google OAuth application](https://console.cloud.google.com/apis/credentials), and then add its Client ID and Client Secret to your local `.env` file.

To learn more about OIDC provider authentication, check out Google's [OIDC Provider Authentication](https://developers.google.com/identity/openid-connect/openid-connect) guide. A number of other online services like Facebook, GitHub, and more also support OIDC, so you can use them as well.

Remix's session management makes it easy to add authentication to your application. You can learn more about it in Remix's [Authentication](https://remix.run/docs/en/main/utils/sessions#using-sessions) guide.
