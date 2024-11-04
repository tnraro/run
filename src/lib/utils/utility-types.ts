type ToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
	? I
	: never;

type LastInUnion<T> =
	ToIntersection<T extends unknown ? () => T : never> extends () => infer R ? R : never;

export type UnionToTuple<T, Last = LastInUnion<T>> = [T] extends [never]
	? []
	: [...UnionToTuple<Exclude<T, Last>>, Last];
