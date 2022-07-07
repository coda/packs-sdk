---
title: "SetEndpointDef"
---
# Type alias: SetEndpointDef

[core](../modules/core.md).SetEndpointDef

Ƭ **SetEndpointDef**: `Omit`<[`SetEndpoint`](../interfaces/core.SetEndpoint.md), ``"getOptions"`` \| ``"getOptionsFormula"``\> & { `getOptions?`: [`MetadataFormulaDef`](core.MetadataFormulaDef.md) ; `getOptionsFormula?`: [`MetadataFormulaDef`](core.MetadataFormulaDef.md)  }

Simplified configuration for [SetEndpoint](../interfaces/core.SetEndpoint.md) that a pack developer can specify when calling
[setUserAuthentication](../classes/core.PackDefinitionBuilder.md#setuserauthentication) or [setSystemAuthentication](../classes/core.PackDefinitionBuilder.md#setsystemauthentication).

#### Defined in

[types.ts:170](https://github.com/coda/packs-sdk/blob/main/types.ts#L170)
