// export type StateReducer<S, P, R = S> = (state: Readonly<S>, payload: Readonly<P>) => R;

// makes all types in tuple readonly except functions
// MakeReadonly<[object, Function, string[]]> = [Readonly<object>, Function, ReadonlyArray<string>]
type MakeReadonly<T> = { readonly [K in keyof T]:
  T[K] extends (infer P)[] ? ReadonlyArray<P> :
  // T[K] extends [infer P1] ? ReadonlyArray<P1> :
  T[K] extends Function ? T[K] :
  T[K] extends object ? ReadonlyObject<T[K]> :
  Readonly<T[K]>
};

type ReadonlyObject<T> = { readonly [K in keyof T]: MakeReadonly<T[K]>; };

type TupleHead<T> = T extends [infer U, ...any[]] ? U : never;

export type PureReducer<S, P, R = S> = (...args: MakeReadonly<[S, P]>) => R;

export type PureComputed<T extends any[], TReturn = TupleHead<T>> =
  (...args: MakeReadonly<T>) => TReturn;

type Person = { name: string };
type SomeObject = { a: { b: any[]} };

const test: PureComputed<[string[], Person[], SomeObject, () => number]> = (
  strings, aPerson, anyv, afun,
) => {
  const { a } = anyv;
  const c = a.b;
  a.b.push(0);
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
