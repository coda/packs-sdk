---
description: Embed external content using Packs and optimize your app for embedding.
---

# Embedding content

Packs typically operate purely on data and actions, leaving the display up to the document. However there are times in which you may want to provide a richer experience, which can be accomplished by embedding a portion of an application directly within the doc.

Coda uses the 3rd party service [Iframely][iframely] to handle embeds. Many popular apps and websites are already supported, and you can use their site to [check if a URL already supports embedding][iframely_check].

## Adding support

If you want to add embed support to your own application follow the instructions in the [Iframely documentation][iframely_docs]. This is most commonly done by adding support for the [oEmbed specification][oembed], which is used by many platforms. Once that is complete, [submit your application][iframely_submit] to Iframely to have it added to their registry.

The iframe containing the embed is sandboxed by default has limited permissions (for example, it can't present content full screen). If you need access to additional iframe sandbox permissions please [contact support][support].

!!! note "User embeds"
    Users can [embed content in their docs][help_center_embed] directly, without Packs, using the `/embed` slash command or the `=Embed()` formula. Even if you aren't planning to build a Pack you may want to support embeds for your users that manually embed the content in their docs.


## Generating an embed

Pack formulas can generate an embed by returning a URL with the `Embed` value hint.

```ts
pack.addFormula({
  // ...
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Embed,
  execute: async function ([], context) {
    // TODO: Build or fetch embed URL.
    return embedUrl;
  },
});
```

### Forcing an embed

You may still be able to embed URLs that aren't supported by Iframely by using the `force` option.

```ts
pack.addFormula({
  // ...
  resultType: coda.ValueType.String,
  schema: {
    type: coda.ValueType.String,
    codaType: coda.ValueHintType.Embed,
    force: true,
  },
  execute: async function ([], context) {
    // TODO: Build or fetch embed URL.
    return embedUrl;
  },
});
```

A forced embed is initially displayed in a disabled state:

<img src="../../../images/embed_force_enable.png" srcset="../../../images/embed_force_enable_2x.png 2x" class="screenshot" alt="Force embeds are initially disabled">

Once a user clicks the embed they are prompted to approve embedding the URL:

<img src="../../../images/embed_force_approve.png" srcset="../../../images/embed_force_approve_2x.png 2x" class="screenshot" alt="Force embeds must be approved">

!!! info "Embed approval scope"
    This approval is once per-domain, per-user. This means that each user in the document will need to approve the embed in order to see the content, but that approval works across all embeds in that doc or others.

Once approved, Coda attempts to load the URL int an `<iframe>` element with [sandboxing applied][mdn_iframe_sandbox]. The URL must be secure (begin with `https://`) and must not prevent being loaded in an iframe (via the [`X-Frame-Options`][mdn_xfo] or [`Content-Security-Policy`][mdn_csp] headers).


[help_center_embed]: https://help.coda.io/en/articles/1211364-embedding-content-in-your-doc
[iframely]: https://iframely.com/
[iframely_check]: https://iframely.com/embed
[iframely_docs]: https://iframely.com/docs/webmasters
[oembed]: https://oembed.com/
[iframely_submit]: https://iframely.com/qa/request
[mdn_iframe_sandbox]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox
[mdn_xfo]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
[mdn_csp]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
[support]: ../../support/index.md
