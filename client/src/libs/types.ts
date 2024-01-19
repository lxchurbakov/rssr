export type Predicate<A extends any[], R> = (...args: A) => R;
export type ArgumentsOf<T> = T extends Predicate<infer A, any> ? A : never;

export type Entity<T> = T & { _id: string };
export type Tag = Entity<{ name: string }>;

export type Option = { value: string, label: string };

export type Input<T> = { value: T, onChange: ($: T) => void };

export type Post = Entity<{
    title: string;
    preview: string;
    pubDate: Date;
    link: string;
    views: number;
    tags: string[];
}>;
