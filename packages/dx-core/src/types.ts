// export type StateReducer<S, P, R = S> = (state: Readonly<S>, payload: Readonly<P>) => R;

// makes all types in tuple readonly except functions
// MakeReadonly<[object, Function, string[]]> = [Readonly<object>, Function, ReadonlyArray<string>]
type ReadonlyTuple<T> = { readonly [K in keyof T]: Immutable<T[K]> };

export interface Mutable<T> {};

type Immutable<T> =
  // T extends Mutable<T> ? T :
  T extends (infer P)[] ? ReadonlyArray<P> :
  T extends Map<infer TKey, infer TValue> ? ReadonlyMap<TKey, TValue> :
  // T extends Array<(infer S)> ? ReadonlyArray<S> :
  T extends Function ? T :
  T extends object ? ReadonlyObject<T> :
  Readonly<T>;

type ReadonlyObject<T> = { readonly [K in keyof T]: Immutable<T[K]>; };

type TupleHead<T> = T extends [infer U, ...any[]] ? U : never;

export type PureReducer<S, P, R = S> = (...args: ReadonlyTuple<[S, P]>) => Immutable<R>;

export type PureComputed<T extends any[], TReturn = TupleHead<T>> =
  (...args: ReadonlyTuple<T>) => Immutable<TReturn>;

type Person = { name: string };
type Group = { people?: Person[] };

const pr: PureReducer<Group, Person> = ({ people }, p) => {
  p.name = '';
  return ({ people })
}

const test: PureComputed<[string[], Person[], Person, () => number]> = (
  strings, aPerson, anyv, afun,
) => {
  const { a } = anyv;
  const c = a.b;

  const { d } = a;
  const { g } = d;
  g.push('');

  c.push(0);
  const b = afun();
  strings[0] = '';
};
type ReadonlyObj = Readonly<SomeObject>;

const foo1: ReadonlyObj = { a: { b: 0 } };
foo1.a = 0;

const ff = (obj: ReadonlyObj) => {
  obj.a.b = 0;
};

type Payload = { changes: string[] };

const red: PureReducer<Person[], Payload> = (s, p) => s;
