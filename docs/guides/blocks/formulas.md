---
title: Formulas
---

# Add custom formulas

Formulas are one of the most basic building blocks in Coda; used to calculate values, filter tables, and so much more. Coda provides a wide array of [built-in formulas][formulas], and using Packs you can add your own custom formulas. Once your Pack is installed in a doc you can use those custom formulas anywhere, intermingling them with built-in formulas or those from other Packs.

[View Sample Code][samples]{ .md-button }


## Structure of a formula

TODO


## Naming

The name of a formula can only contain the letters, numbers, and underscores. By convention these names should by written in upper camel case, like `DoSomethingCool`.

Formula names must be unique within a Pack, but can be the same as built-in formulas or those in other Packs. When a doc has access to multiple formulas with the same name the Pack's icon is used to distinguish them.

[![Icons used to disambiguate formulas][formula_disambiguation]{: .screenshot}][formula_disambiguation]


## Parameters

Formulas can accept parameters, which is the primary way for them to access data from the document. See the [Parameters guide][parameters] for more information and examples.


## Results

Except [action formulas][actions] that power buttons and automation, all formulas must return a result.


## Caching

TODO


## Recalculation

TODO

[samples]: ../../samples/topic/formula.md
[formulas]: https://coda.io/formulas
[formula_disambiguation]: ../../images/formula_disambiguation.png
[parameters]: ../basics/parameters.md
[actions]: actions.md
