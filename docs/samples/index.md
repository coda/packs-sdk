---
nav: Samples
description: An index of code examples to browse through.
hide:
- toc
---

# Sample code

No need to start from scratch; we've got dozens of sample Packs for your to browse, copy, and learn from. Small Packs that demonstrate a single feature are organized by topic, while the larger and more complete Packs each have their own page.

{% for section in page.parent.children|selectattr("is_section") %}

## {{section.title}}

<section class="box-row" markdown>

{% for child in section.children %}

<div class="box-item" markdown>
{# Read the child page's source, but don't output anything. This is required to populate the child page's title and metadata. #}
{{ child.read_source(config) or "" }}

### {% if child.meta.icon %}:{{child.meta.icon|replace("/", "-")}}:{% endif %} {{ child.meta.get("nav", child.title) }}

{{child.meta.description}}

[View]({{getRelativePath(child, page)}}){ .md-button }
</div>

{% endfor %}

</section>

{% endfor %}


[packs_examples]: https://github.com/coda/packs-examples
