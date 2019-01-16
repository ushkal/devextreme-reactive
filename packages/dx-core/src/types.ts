export type StateReducer<S, P, R = S> = (state: Readonly<S>, payload: Readonly<P>) => R;
// export type Computed<T> = (getter: T) => T;
export type Computed<
  T, P0 = any, P1 = any, P2 = any, P3 = any, P4 = any, P5 = any
> = (
  getter: T,
  arg0: P0,
  arg1: P1,
  arg2: P2,
  arg3: P3,
  arg4: P4,
  arg5: P5,
) => T;
