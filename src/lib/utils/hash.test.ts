import { describe, it, expect } from 'vitest';
import { hash } from './hash';

describe('hash', () => {
	it('idempotency', () => {
		expect(hash('')).toBe(hash(''));
		expect(hash('foo')).toBe(hash('foo'));
		expect(
			hash(
				'Idempotence (UK: /ˌɪdɛmˈpoʊtəns/,[1] US: /ˈaɪdəm-/)[2] is the property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result beyond the initial application. The concept of idempotence arises in a number of places in abstract algebra (in particular, in the theory of projectors and closure operators) and functional programming (in which it is connected to the property of referential transparency).'
			)
		).toBe(
			hash(
				'Idempotence (UK: /ˌɪdɛmˈpoʊtəns/,[1] US: /ˈaɪdəm-/)[2] is the property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result beyond the initial application. The concept of idempotence arises in a number of places in abstract algebra (in particular, in the theory of projectors and closure operators) and functional programming (in which it is connected to the property of referential transparency).'
			)
		);
	});
});
