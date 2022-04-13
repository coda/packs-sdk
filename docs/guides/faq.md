---
title: FAQ
---

# Frequently asked questions

## How do I verify ownership of the Packs redirect URI for Google OAuth verification?

To connect to a Google API from a Pack you need to use OAuth2 authentication. Many APIs require scopes that Google deems "sensitive", meaning that Google must approve your integration before other users can sign in. This approval process is known as [OAuth verification][google_verification], and involves many steps and checks.

One of those checks is that Google must verify you own the domain name for all of the domains used by the integration. This includes the redirect URI that users are sent to after they complete the approval screen. For Coda Packs this redirect URL is always:

```
https://coda.io/packsAuth/oauth2
```

To meet Google's verification requirements you would need to verify ownership of the `coda.io` domain, which isn't possible. While we hope to find a solution to this problem in the long run, at the moment it isn't possible to complete the verification process with Google.

There are some [exceptions to Google's verification requirement][google_verification_exceptions], for example an app only used internally within a single organization. If you can adjust your Pack to meet one of these exceptions you can work around the problem.


[google_verification]: https://support.google.com/cloud/answer/9110914
[google_verification_exceptions]: https://support.google.com/cloud/answer/9110914#exceptions-ver-reqts&zippy=%2Cexceptions-to-verification-requirements
