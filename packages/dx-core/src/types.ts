// export type StateReducer<S, P, R = S> = (state: Readonly<S>, payload: Readonly<P>) => R;

// makes all types in tuple readonly except functions
// MakeReadonly<[object, Function, string[]]> = [Readonly<object>, Function, ReadonlyArray<string>]
type MakeReadonly<T> = { [K in keyof T]:
  T[K] extends Function ? T[K] :
  T[K] extends [infer P] ? ReadonlyArray<P> :
  Readonly<T[K]>
};

type TupleHead<T> = T extends [infer U, ...any[]] ? U : never;

export type PureReducer<S, P, R = S> = (...args: MakeReadonly<[S, P]>) => R;

export type PureComputed<T extends any[], TReturn = TupleHead<T>> =
  (...args: MakeReadonly<T>) => TReturn;

type Person = { name: string }
type SomeObject = { a: number };

const test: PureComputed<[string[], Person, SomeObject, () => number]> = (
  strings, aPerson, anyvalue, afun,
) => {
  anyvalue.a = 1;
  const b = afun();
  strings[0] = '';
}

type Payload = { changes: string[] };

const red: PureReducer<Person, Payload> = (s, p) => s;