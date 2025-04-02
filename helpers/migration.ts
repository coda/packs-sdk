import type {ObjectSchemaDefinition} from '../schema';
import type {ParamDef} from '../api_types';
import type {PostSetupMetadata} from '../compiled_types';
import type {SetEndpoint} from '../types';
import type {SetEndpointDef} from '../types';
import type {SuggestedValueType} from '../api_types';
import type {UnionType} from '../api_types';
import {ensureExists} from '../helpers/ensure';
import {ensureNever} from '../helpers/ensure';

export function objectSchemaHelper<T extends ObjectSchemaDefinition<string, string>>(schema: T): ObjectSchemaHelper<T> {
  return new ObjectSchemaHelper(schema);
}

class ObjectSchemaHelper<T extends ObjectSchemaDefinition<string, string>> {
  private readonly _schema: T;

  constructor(schema: T) {
    this._schema = schema;

    this._checkAgainstAllProperties(schema);
  }

  // This method doesn't do anything, but it gives developers a chance to double-check if they've forgotten
  // to update a client of ObjectSchemaHelper when they add a new property to ObjectSchemaDefinition.
  // For example, coda.makeReferenceSchemaFromObjectSchema() depends on ObjectSchemaHelper so if you
  // add a new schema option related to property options you would likely need to add it to ObjectSchemaHelper
  // and propagate it through coda.makeReferenceSchemaFromObjectSchema() also.
  private _checkAgainstAllProperties(schema: ObjectSchemaDefinition<string, string>) {
    const {
      // Properties needed by ObjectSchemaHelper clients.
      id,
      idProperty,
      primary,
      displayProperty,
      featuredProperties,
      featured,
      identity,
      options,
      properties,
      type,
      attribution,
      codaType,
      requireForUpdates,

      // Properties not needed by ObjectSchemaHelper clients.
      includeUnknownProperties,
      titleProperty,
      linkProperty,
      subtitleProperties,
      snippetProperty,
      imageProperty,
      description,
      createdAtProperty,
      createdByProperty,
      modifiedAtProperty,
      modifiedByProperty,
      userEmailProperty,
      userIdProperty,
      groupIdProperty,
      memberGroupIdProperty,
      versionProperty,
      index,
      parent,
      ...rest
    } = schema;

    ensureNever<keyof typeof rest>();
  }

  get id(): string | undefined {
    return this._schema.idProperty ?? this._schema.id;
  }

  get primary(): string | undefined {
    return this._schema.displayProperty ?? this._schema.primary;
  }

  get featured(): string[] | undefined {
    return this._schema.featuredProperties ?? this._schema.featured;
  }

  get identity() {
    return this._schema.identity;
  }

  get options() {
    return this._schema.options;
  }

  get properties() {
    return this._schema.properties;
  }

  get type() {
    return this._schema.type;
  }

  get attribution() {
    return this._schema.attribution ?? this._schema.identity?.attribution;
  }

  get codaType() {
    return this._schema.codaType;
  }

  get requireForUpdates() {
    return this._schema.requireForUpdates;
  }

  get titleProperty() {
    return this._schema.titleProperty ?? this._schema.displayProperty;
  }
}

export function paramDefHelper<S extends UnionType, T extends ParamDef<S>>(def: T): ParamDefHelper<S, T> {
  return new ParamDefHelper(def);
}

class ParamDefHelper<S extends UnionType, T extends ParamDef<S>> {
  private readonly _def: T;

  constructor(def: T) {
    this._def = def;
  }

  get defaultValue(): SuggestedValueType<S> | undefined {
    return this._def.suggestedValue ?? this._def.defaultValue;
  }
}

export function setEndpointHelper(step: SetEndpoint) {
  return new SetEndpointHelper(step);
}

class SetEndpointHelper {
  private readonly _step: SetEndpoint;

  constructor(step: SetEndpoint) {
    this._step = step;
  }

  get getOptions() {
    return ensureExists(this._step.getOptions ?? this._step.getOptionsFormula);
  }
}

export function setEndpointDefHelper(step: SetEndpointDef) {
  return new SetEndpointDefHelper(step);
}

class SetEndpointDefHelper {
  private readonly _step: SetEndpointDef;

  constructor(step: SetEndpointDef) {
    this._step = step;
  }

  get getOptions() {
    return ensureExists(this._step.getOptions ?? this._step.getOptionsFormula);
  }
}

export function postSetupMetadataHelper(metadata: PostSetupMetadata) {
  return new PostSetupMetadataHelper(metadata);
}

class PostSetupMetadataHelper {
  private readonly _metadata: PostSetupMetadata;

  constructor(metadata: PostSetupMetadata) {
    this._metadata = metadata;
  }

  get getOptions() {
    return ensureExists(this._metadata.getOptions ?? this._metadata.getOptionsFormula);
  }
}
