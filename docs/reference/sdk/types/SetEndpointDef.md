---
title: "SetEndpointDef"
---
# Type alias: SetEndpointDef

Ƭ **SetEndpointDef**: `Omit`<[`SetEndpoint`](../interfaces/SetEndpoint.md), ``"getOptions"`` \| ``"getOptionsFormula"``\> & { `getOptions?`: [`MetadataFormulaDef`](MetadataFormulaDef.md) ; `getOptionsFormula?`: [`MetadataFormulaDef`](MetadataFormulaDef.md)  }

Simplified configuration for [SetEndpoint](../enums/PostSetupType.md#setendpoint) that a pack developer can specify when calling
[setUserAuthentication](../classes/PackDefinitionBuilder.md#setuserauthentication) or [setSystemAuthentication](../classes/PackDefinitionBuilder.md#setsystemauthentication).

#### Defined in

[types.ts:170](https://github.com/coda/packs-sdk/blob/main/types.ts#L170)
