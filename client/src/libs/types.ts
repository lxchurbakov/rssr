export type Predicate<A extends any[], R> = (...args: A) => R;
export type ArgumentsOf<T> = T extends Predicate<infer A, any> ? A : never;
