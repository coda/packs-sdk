import type {ObjectSchemaDefinition} from '../schema';
import type {SetEndpoint} from '../types';
import type {SetEndpointDef} from '../types';
import {ensureExists} from '../helpers/ensure';

export function objectSchemaHelper<T extends ObjectSchemaDefinition<string, string>>(schema: T): ObjectSchemaHelper<T> {
  return new ObjectSchemaHelper(schema);
}

export class ObjectSchemaHelper<T extends ObjectSchemaDefinition<string, string>> {
  private readonly _schema: T;

  constructor(schema: T) {
    this._schema = schema;
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

  get properties() {
    return this._schema.properties;
  }

  get type() {
    return this._schema.type;
  }
}

export function setEndpointHelper(step: SetEndpoint) {
  return new SetEndpointHelper(step);
}

export class SetEndpointHelper {
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

export class SetEndpointDefHelper {
  private readonly _step: SetEndpointDef;

  constructor(step: SetEndpointDef) {
    this._step = step;
  }

  get getOptions() {
    return ensureExists(this._step.getOptions ?? this._step.getOptionsFormula);
  }
}
