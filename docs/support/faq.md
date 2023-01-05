---
nav: FAQ
description: Answers to some of the most common questions about building Packs.
---

# Frequently asked questions

## How do I verify ownership of the Packs redirect URI for Google OAuth verification? {: #google}

To connect to a Google API from a Pack you need to use OAuth2 authentication. Many APIs require scopes that Google deems "sensitive", meaning that Google must approve your integration before other users can sign in. This approval process is known as [OAuth verification][google_verification], and involves many steps and checks.

!!! info "Exceptions"
    There are some [exceptions to Google's verification requirement][google_verification_exceptions], for example an app only used internally within a single organization. Check this list first before beginning the verification process.

One of the checks is that Google must verify you own the domain name for all of the domains used by the integration. This includes the redirect URI that users are sent to after they complete the approval screen. For Coda Packs this redirect URL follows the pattern:

```
https://coda.io/packsAuth/oauth2/{PACK ID}
```

To meet Google's verification requirements you would need to verify ownership of the `coda.io` domain, which isn't possible. However [Google's FAQ][google_verification_line] includes this line:

>  Note: If you are using a third party service provider and your domain is owned by them, then you need to provide a detailed justification for us to validate it.

Although Google includes an exception for apps that don't own the domain of their redirect URL, it's outside the standard script the review team follows and may take some convincing. Here are some tips to help you get your integration approved:

- Create a published doc for your Pack to act as the "home page". Ensure it, your Pack listing, and the Google consent screen branding all match (name, icon, etc).
- Ensure you have a privacy policy published, even if it's just a minimal one. It can live in the published doc mentioned above.
- Record a video showing the installation and usage of the Pack.
- In the verification form there is a field that asks for a similar app that has been verified, and you can refer them to the previously approved [Apps Script Pack][packs_apps_script], with project number 367090187070.
- If they insist on proof of ownership of `coda.io`, quote the clause from the FAQ and mention that Coda requires that everyone uses a redirect URL hosted on `coda.io`. You can link them to [this section][oauth_redirect] of the OAuth documentation.
- If they insist that a branded "Google Sign-in" button be used to start the OAuth flow, mention that the Coda platform controls these buttons and that you can't change them.

With enough persistence you should be able to get your Pack verified. The process may take a week or more to complete, so plan accordingly.


## Can you add my company's icon as an option in Coda?

Building a template or demo document is an important part of creating a Pack, as it shows users how to apply you Pack to real problems. Many Pack makers wish to use their company's branding on that document for visual consistency.

Coda supports both document- and page-level icons, from a library we source from an external provider. While some this library includes the icons for some popular brands, it's not comprehensive and your brand may not be present. At the moment we don't have a process for adding new icons to the library, nor do we support using custom icons within a document. This is something we hope to address in the future, but for the time being we recommend using a generic icon.


## Can formulas return dynamic schemas?

No, unfortunately they can't. While [dynamic sync tables][dynamic_sync_tables] can flex their schema based upon the specific data source being connected to, this option isn't available for formulas. The schema for a formula must be declared statically, and there is no equivalent `getSchema()` function that formulas can provide.

If you have a formula that returns a dynamic set of custom fields, there are two common approaches:

1. Include an array of sub-objects representing the custom fields, with each containing a `name` and `value` property. Users can retrieve the value of a specific custom field using a formula like:

    ```
    Task.CustomFields.Filter(CurrentValue.Name="price").First().Value
    ```

2. Include the custom fields as a block of JSON, like `{"price": 10}`. Users can retrieve a specific custom field using a formula like:

    ```
    Task.CustomFieldsJson.ParseJSON("price")
    ```


[google_verification]: https://support.google.com/cloud/answer/9110914
[google_verification_exceptions]: https://support.google.com/cloud/answer/9110914#exceptions-ver-reqts&zippy=%2Cexceptions-to-verification-requirements
[google_verification_line]: https://support.google.com/cloud/answer/9110914?hl=en#zippy=%2Chow-can-i-make-sure-the-verification-process-is-as-streamlined-as-possible
[oauth_redirect]: ../guides/basics/authentication/oauth2.md#redirect-url
[packs_apps_script]: https://coda.io/packs/apps-script-14470
[dynamic_sync_tables]: ../guides/blocks/sync-tables/dynamic.md
