/**
 * Credits to all the people who given inspiration and shared some very useful code snippets
 * in the following github issue: https://github.com/Microsoft/TypeScript/issues/12215
 */

/**
 * Primitive
 * @desc Type representing primitive types in TypeScript: `number | bigint | boolean | string | symbol`
 * @example
 *   type Various = number | string | object;
 *
 *    // Expect: object
 *   type Cleaned = Exclude<Various, Primitive>
 */
export type Primitive = number | bigint | boolean | string | symbol;

/**
 * Falsey
 * @desc Type representing falsey values in TypeScript: `null | undefined | false | 0 | ''`
 * @example
 *   type Various = 'a' | 'b' | undefined | false;
 *
 *   // Expect: "a" | "b"
 *   Exclude<Various, Falsey>;
 */
export type Falsey = null | undefined | false | 0 | '';

/**
 * SetIntersection (same as Extract)
 * @desc Set intersection of given union types `A` and `B`
 * @example
 *   // Expect: "2" | "3"
 *   SetIntersection<'1' | '2' | '3', '2' | '3' | '4'>;
 *
 *   // Expect: () => void
 *   SetIntersection<string | number | (() => void), Function>;
 */
export type SetIntersection<A, B> = A extends B ? A : never;

/**
 * SetDifference (same as Exclude)
 * @desc Set difference of given union types `A` and `B`
 * @example
 *   // Expect: "1"
 *   SetDifference<'1' | '2' | '3', '2' | '3' | '4'>;
 *
 *   // Expect: string | number
 *   SetDifference<string | number | (() => void), Function>;
 */
export type SetDifference<A, B> = A extends B ? never : A;

/**
 * SetComplement
 * @desc Set complement of given union types `A` and (it's subset) `A1`
 * @example
 *   // Expect: "1"
 *   SetComplement<'1' | '2' | '3', '2' | '3'>;
 */
export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;

/**
 * SymmetricDifference
 * @desc Set difference of union and intersection of given union types `A` and `B`
 * @example
 *   // Expect: "1" | "4"
 *   SymmetricDifference<'1' | '2' | '3', '2' | '3' | '4'>;
 */
export type SymmetricDifference<A, B> = SetDifference<A | B, A & B>;

/**
 * NonUndefined
 * @desc Exclude undefined from set `A`
 * @example
 *   // Expect: "string | null"
 *   SymmetricDifference<string | null | undefined>;
 */
export type NonUndefined<A> = A extends undefined ? never : A;

/**
 * NonNullable
 * @desc Exclude undefined and null from set `A`
 * @example
 *   // Expect: "string"
 *   SymmetricDifference<string | null | undefined>;
 */
// type NonNullable - built-in

/**
 * FunctionKeys
 * @desc get union type of keys that are functions in object type `T`
 * @example
 *  type MixedProps = {name: string; setName: (name: string) => void; someKeys?: string; someFn?: (...args: any) => any;};
 *
 *   // Expect: "setName | someFn"
 *   type Keys = FunctionKeys<MixedProps>;
 */
export type FunctionKeys<T extends object> = {
  [K in keyof T]-?: NonUndefined<T[K]> extends Function ? K : never
}[keyof T];

/**
 * NonFunctionKeys
 * @desc get union type of keys that are non-functions in object type `T`
 * @example
 *   type MixedProps = {name: string; setName: (name: string) => void; someKeys?: string; someFn?: (...args: any) => any;};
 *
 *   // Expect: "name | someKey"
 *   type Keys = NonFunctionKeys<MixedProps>;
 */
export type NonFunctionKeys<T extends object> = {
  [K in keyof T]-?: NonUndefined<T[K]> extends Function ? never : K
}[keyof T];

/**
 * WritableKeys
 * @desc get union type of keys that are writable in object type `T`
 * Credit: Matt McCutchen
 * https://stackoverflow.com/questions/52443276/how-to-exclude-getter-only-properties-from-type-in-typescript
 * @example
 *   type Props = { readonly foo: string; bar: number };
 *
 *   // Expect: "bar"
 *   type Keys = WritableKeys<Props>;
 */
export type WritableKeys<T extends object> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >
}[keyof T];

/**
 * ReadonlyKeys
 * @desc get union type of keys that are readonly in object type `T`
 * Credit: Matt McCutchen
 * https://stackoverflow.com/questions/52443276/how-to-exclude-getter-only-properties-from-type-in-typescript
 * @example
 *   type Props = { readonly foo: string; bar: number };
 *
 *   // Expect: "foo"
 *   type Keys = ReadonlyKeys<Props>;
 */
export type ReadonlyKeys<T extends object> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    never,
    P
  >
}[keyof T];

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X
  ? 1
  : 2) extends (<T>() => T extends Y ? 1 : 2)
  ? A
  : B;

/**
 * RequiredKeys
 * @desc get union type of keys that are required in object type `T`
 * @see https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; optUndef?: number | undefined; };
 *
 *   // Expect: "req" | "reqUndef"
 *   type Keys = RequiredKeys<Props>;
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T];

/**
 * OptionalKeys
 * @desc get union type of keys that are optional in object type `T`
 * @see https://stackoverflow.com/questions/52984808/is-there-a-way-to-get-all-required-properties-of-a-typescript-object
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; optUndef?: number | undefined; };
 *
 *   // Expect: "opt" | "optUndef"
 *   type Keys = OptionalKeys<Props>;
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T];

/**
 * Pick (complements Omit)
 * @desc From `T` pick a set of properties by key `K`
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *
 *   // Expect: { age: number; }
 *   type Props = Pick<Props, 'age'>;
 */
namespace Pick {}

/**
 * PickByValue
 * @desc From `T` pick a set of properties by value matching `ValueType`.
 * Credit: [Piotr Lewandowski](https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c)
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; };
 *
 *   // Expect: { req: number }
 *   type Props = PickByValue<Props, number>;
 *   // Expect: { req: number; reqUndef: number | undefined; }
 *   type Props = PickByValue<Props, number | undefined>;
 */
export type PickByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]: T[Key] extends ValueType ? Key : never }[keyof T]
>;

/**
 * PickByValueExact
 * @desc From `T` pick a set of properties by value matching exact `ValueType`.
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; };
 *
 *   // Expect: { req: number }
 *   type Props = PickByValueExact<Props, number>;
 *   // Expect: { reqUndef: number | undefined; }
 *   type Props = PickByValueExact<Props, number | undefined>;
 */
export type PickByValueExact<T, ValueType> = Pick<
  T,
  {
    [Key in keyof T]: [ValueType] extends [T[Key]]
      ? [T[Key]] extends [ValueType]
        ? Key
        : never
      : never
  }[keyof T]
>;

/**
 * Omit (complements Pick)
 * @desc From `T` remove a set of properties by key `K`
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *
 *   // Expect: { name: string; visible: boolean; }
 *   type Props = Omit<Props, 'age'>;
 */
export type Omit<T, K extends keyof any> = Pick<T, SetDifference<keyof T, K>>;

/**
 * OmitByValue
 * @desc From `T` remove a set of properties by value matching `ValueType`.
 * Credit: [Piotr Lewandowski](https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c)
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; };
 *
 *   // Expect: { reqUndef: number | undefined; opt?: string; }
 *   type Props = OmitByValue<Props, number>;
 *   // Expect: { opt?: string; }
 *   type Props = OmitByValue<Props, number | undefined>;
 */
export type OmitByValue<T, ValueType> = Pick<
  T,
  { [Key in keyof T]: T[Key] extends ValueType ? never : Key }[keyof T]
>;

/**
 * OmitByValueExact
 * @desc From `T` remove a set of properties by value matching exact `ValueType`.
 * @example
 *   type Props = { req: number; reqUndef: number | undefined; opt?: string; };
 *
 *   // Expect: { reqUndef: number | undefined; opt?: string; }
 *   type Props = OmitByValueExact<Props, number>;
 *   // Expect: { req: number; opt?: string }
 *   type Props = OmitByValueExact<Props, number | undefined>;
 */
export type OmitByValueExact<T, ValueType> = Pick<
  T,
  {
    [Key in keyof T]: [ValueType] extends [T[Key]]
      ? [T[Key]] extends [ValueType]
        ? never
        : Key
      : Key
  }[keyof T]
>;

/**
 * Intersection
 * @desc From `T` pick properties that exist in `U`
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *   type DefaultProps = { age: number };
 *
 *   // Expect: { age: number; }
 *   type DuplicateProps = Intersection<Props, DefaultProps>;
 */
export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>;

/**
 * Diff
 * @desc From `T` remove properties that exist in `U`
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *   type DefaultProps = { age: number };
 *
 *   // Expect: { name: string; visible: boolean; }
 *   type DiffProps = Diff<Props, DefaultProps>;
 */
export type Diff<T extends object, U extends object> = Pick<
  T,
  SetDifference<keyof T, keyof U>
>;

/**
 * Subtract
 * @desc From `T` remove properties that exist in `T1` (`T1` is a subtype of `T`)
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *   type DefaultProps = { age: number };
 *
 *   // Expect: { name: string; visible: boolean; }
 *   type RestProps = Subtract<Props, DefaultProps>;
 */
export type Subtract<T extends T1, T1 extends object> = Pick<
  T,
  SetComplement<keyof T, keyof T1>
>;

/**
 * Overwrite
 * @desc From `U` overwrite properties to `T`
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *   type NewProps = { age: string; other: string };
 *
 *   // Expect: { name: string; age: string; visible: boolean; }
 *   type ReplacedProps = Overwrite<Props, NewProps>;
 */
export type Overwrite<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T>
> = Pick<I, keyof I>;

/**
 * Assign
 * @desc From `U` assign properties to `T` (just like object assign)
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *   type NewProps = { age: string; other: string };
 *
 *   // Expect: { name: string; age: number; visible: boolean; other: string; }
 *   type ExtendedProps = Assign<Props, NewProps>;
 */
export type Assign<
  T extends object,
  U extends object,
  I = Diff<T, U> & Intersection<U, T> & Diff<U, T>
> = Pick<I, keyof I>;

/**
 * Exact
 * @desc create branded object type for exact type matching
 */
export type Exact<A extends object> = A & { __brand: keyof A };

/**
 * Unionize
 * @desc Disjoin object to form union of objects, each with single property
 * @example
 *   type Props = { name: string; age: number; visible: boolean };
 *
 *   // Expect: { name: string; } | { age: number; } | { visible: boolean; }
 *   type UnionizedType = Unionize<Props>;
 */
export type Unionize<T extends object> = {
  [P in keyof T]: { [Q in P]: T[P] }
}[keyof T];

/**
 * PromiseType
 * @desc Obtain Promise resolve type
 * @example
 *   // Expect: string;
 *   type Response = PromiseType<Promise<string>>;
 */
export type PromiseType<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

// TODO: inline _DeepReadonlyArray with infer in DeepReadonly, same for all other deep types
/**
 * DeepReadonly
 * @desc Readonly that works for deeply nested structure
 * @example
 *   // Expect: {
 *   //   readonly first: {
 *   //     readonly second: {
 *   //       readonly name: string;
 *   //     };
 *   //   };
 *   // }
 *   type NestedProps = {
 *     first: {
 *       second: {
 *         name: string;
 *       };
 *     };
 *   };
 *   type ReadonlyNestedProps = DeepReadonly<NestedProps>;
 */
export type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends any[]
  ? _DeepReadonlyArray<T[number]>
  : T extends object
  ? _DeepReadonlyObject<T>
  : T;
/** @private */
// tslint:disable-next-line:class-name
export interface _DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}
/** @private */
export type _DeepReadonlyObject<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>
};

/**
 * DeepRequired
 * @desc Required that works for deeply nested structure
 * @example
 *   // Expect: {
 *   //   first: {
 *   //     second: {
 *   //       name: string;
 *   //     };
 *   //   };
 *   // }
 *   type NestedProps = {
 *     first?: {
 *       second?: {
 *         name?: string;
 *       };
 *     };
 *   };
 *   type RequiredNestedProps = DeepRequired<NestedProps>;
 */
export type DeepRequired<T> = T extends (...args: any[]) => any
  ? T
  : T extends any[]
  ? _DeepRequiredArray<T[number]>
  : T extends object
  ? _DeepRequiredObject<T>
  : T;
/** @private */
// tslint:disable-next-line:class-name
export interface _DeepRequiredArray<T>
  extends Array<DeepRequired<NonUndefined<T>>> {}
/** @private */
export type _DeepRequiredObject<T> = {
  [P in keyof T]-?: DeepRequired<NonUndefined<T[P]>>
};

/**
 * DeepNonNullable
 * @desc NonNullable that works for deeply nested structure
 * @example
 *   // Expect: {
 *   //   first: {
 *   //     second: {
 *   //       name: string;
 *   //     };
 *   //   };
 *   // }
 *   type NestedProps = {
 *     first?: null | {
 *       second?: null | {
 *         name?: string | null |
 *         undefined;
 *       };
 *     };
 *   };
 *   type RequiredNestedProps = DeepNonNullable<NestedProps>;
 */
export type DeepNonNullable<T> = T extends (...args: any[]) => any
  ? T
  : T extends any[]
  ? _DeepNonNullableArray<T[number]>
  : T extends object
  ? _DeepNonNullableObject<T>
  : T;
/** @private */
// tslint:disable-next-line:class-name
export interface _DeepNonNullableArray<T>
  extends Array<DeepNonNullable<NonNullable<T>>> {}
/** @private */
export type _DeepNonNullableObject<T> = {
  [P in keyof T]-?: DeepNonNullable<NonNullable<T[P]>>
};

/**
 * DeepPartial
 * @desc Partial that works for deeply nested structure
 * @example
 *   // Expect: {
 *   //   first?: {
 *   //     second?: {
 *   //       name?: string;
 *   //     };
 *   //   };
 *   // }
 *   type NestedProps = {
 *     first: {
 *       second: {
 *         name: string;
 *       };
 *     };
 *   };
 *   type PartialNestedProps = DeepPartial<NestedProps>;
 */
export type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? _DeepPartialArray<U>
  : T extends object
  ? _DeepPartialObject<T>
  : T | undefined;
/** @private */
// tslint:disable-next-line:class-name
export interface _DeepPartialArray<T> extends Array<DeepPartial<T>> {}
/** @private */
export type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

/**
 * Brand
 * @desc Define nominal type of U based on type of T.
 * @example
 *   type USD = Brand<number, "USD">
 *   type EUR = Brand<number, "EUR">
 *
 *   const tax = 5 as USD;
 *   const usd = 10 as USD;
 *   const eur = 10 as EUR;
 *
 *   function gross(net: USD): USD {
 *     return (net + tax) as USD;
 *   }
 *
 *   // Expect: No compile error
 *   gross(usd);
 *   // Expect: Compile error (Type '"EUR"' is not assignable to type '"USD"'.)
 *   gross(eur);
 */
export type Brand<T, U> = T & { __brand: U };

/**
 * Optional
 * @desc From `T` make a set of properties by key `K` become optional
 * @example
 *    type Props = {
 *      name: string;
 *      age: number;
 *      visible: boolean;
 *    };
 *
 *    // Expect: { name?: string; age?: number; visible?: boolean; }
 *    type Props = Optional<Props>;
 *
 *    // Expect: { name: string; age?: number; visible?: boolean; }
 *    type Props = Optional<Props, 'age' | 'visible'>;
 */
export type Optional<T extends object, K extends keyof T = keyof T> = Omit<
  T,
  K
> &
  Partial<Pick<T, K>>;
