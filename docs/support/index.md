---
nav: Support
description: The support channels that exist for the Pack SDK.
---

# How to get help

We use a mixture of different platforms to provide support to Pack makers, so review the options below to determine the best way to get help.


## Quick questions

For general questions about Packs, or advice on how to build them, we recommend you post in the [Coda Community "Making Packs" category][community_packs]. Codans actively monitor the community and answer questions, as well as other Pack makers that have experience with the platform. Posting questions and answers in a public forum helps build up a knowledge base of information that helps everyone.

[Search existing questions][community_search]{: .md-button}
[Post a new question][community_post]{: .md-button .md-button--primary}


## In-depth discussion

For a deeper discussion about the specific challenges you are dealing with, we recommend booking a slot during the [Packs Office Hours][office_hours]. You'll get one-on-one time with a Coda Developer Advocate to explore new Pack ideas, talk through an issue, or share your screen and do some live debugging.

[Book now][office_hours]{: .md-button .md-button--primary}


## Problems or bugs

If you are experiencing a problem with your Pack or have identified a bug you can reach out to the Coda Support team. Send an email to [support+packstudio@coda.io][support_email], and include the following information:

- The URL of your Pack in the Pack Studio.
- The URL of a doc where the error occurred (make sure to [share it with support][hc_share]).
- Any relevant error messages or snippets of code.

[Send email][support_email]{: .md-button .md-button--primary}


## Approvals and exemptions {: #approvals}

<a name="network-domains"></a><!-- Keep for backwards compatibility -->

Certain Pack features are restricted by default and require approval before you can use them. Coda enforces these restrictions when you attempt to create a new version of your Pack. This means you can test your Pack locally using the CLI, but will need to have the approval granted before you can test in a real doc.

The following features require approval:

- Sending fetcher requests to multiple [network domains][fetcher_network_domains].
- Using [`OAuth2` authentication][authentication_url_limitations] with an authorization and token URL on different domains.
- Using [`Custom` authentication][authentication_custom_tokens].

To request approval please fill out the form linked below. Ensure you are signed in with the same Coda account you are using to develop the Pack. We'll review your request and respond with a decision within a few business days.

[Request approval][network_domains_form]{: .md-button .md-button--primary}


[community_packs]: https://community.coda.io/c/15
[community_search]: https://community.coda.io/search?q=%23making-packs
[community_post]: https://community.coda.io/new-topic?category=making-packs
[support_email]: mailto:support+packstudio@coda.io
[hc_share]: https://help.coda.io/en/articles/1137949-sharing-your-doc#h_5061fdf96a
[fetcher_network_domains]: ../guides/basics/fetcher.md#network-domains
[network_domains_form]: https://coda.io/form/Pack-Network-Domains-Request_ddvuAhFq3IZ
[office_hours]: https://calendly.com/ekoleda/packs-office-hours
[authentication_custom_tokens]: ../guides/basics/authentication/index.md#custom-tokens
[authentication_url_limitations]: ../guides/basics/authentication/oauth2.md#url-limitations
