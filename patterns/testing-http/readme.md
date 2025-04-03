---
tags: functions, tests
title: Mocking an HTTP call in tests
---

# Mocking an HTTP call in tests

If you want to write a test for a function that calls an external API you can mock the API call by starting a simple HTTP server in your tests and then using an environment variable to set the API URL during your tests.

This example just uses `fetch` inside a function, but even if you're using a 3rd party SDK to make API calls there is normally a way to set the API domain, either via an environment variable or by passing a config value to the SDK.
