interface ObjectConstructor {
  keys<T extends any[]>(o: T): string[];
  keys<T extends {[key in string | number | symbol]: any}>(o: T): Array<Extract<keyof T, string>>;
  values<T extends {[key in string | number | symbol]: any}>(o: T): Array<$Values<T>>;
  entries<T extends {[key in string | number | symbol]: any}>(
    o: T,
  ): Array<$Values<{[K in Extract<keyof T, string | number>]: [K extends string ? K : string, T[K]]}>>;
}
