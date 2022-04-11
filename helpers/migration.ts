import type {ObjectSchemaDefinition} from '../schema';

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
