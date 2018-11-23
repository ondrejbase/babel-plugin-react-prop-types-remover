import { transform } from 'babel-core';
import plugin, { remover } from '../main';

describe('main', () => {
	const ORIGINAL_ENV = process.env;
	const TRANSFORM_OPTIONS = { plugins: [plugin] };

	function setNodeEnv(env) {
		process.env = Object.assign({}, process.env, { NODE_ENV: env });
	}

	beforeEach(() => {
		setNodeEnv('prod');
		spyOn(remover, '_error');
	});

	afterEach(() => {
		process.env = ORIGINAL_ENV;
	});

	describe('transform()', () => {
		it('should remove static propTypes() getter', () => {
			const { code } = transform(
				`class Foo {
					static get baz() {}

					static get propTypes() {}

					get myFo() {}

					bar() {}
				}`,
				TRANSFORM_OPTIONS
			);
			expect(code).toMatchSnapshot();
		});

		it(`should not remove propTypes() getter because it isn't static`, () => {
			const { code } = transform(
				`class Foo {
					static get baz() {}

					get propTypes() {}

					get myFo() {}

					bar() {}
				}`,
				TRANSFORM_OPTIONS
			);
			expect(code).toMatchSnapshot();
		});

		it(`should not remove static propTypes() because it isn't a getter`, () => {
			const { code } = transform(
				`class Foo {
					static get baz() {}

					static propTypes() {}

					get myFo() {}

					bar() {}
				}`,
				TRANSFORM_OPTIONS
			);
			expect(code).toMatchSnapshot();
		});

		it(`should not remove propTypes() getter because NODE_ENV = 'dev'`, () => {
			setNodeEnv('dev');
			const { code } = transform(
				`class Foo {
					static get baz() {}

					static get propTypes() {}

					get myFo() {}

					bar() {}
				}`,
				TRANSFORM_OPTIONS
			);
			expect(code).toMatchSnapshot();
		});
	});

	describe('_shouldRemoveProptypes', () => {
		it(`should return true, because argument environment = process.env.NODE_ENV = 'prod'`, () => {
			const should = remover._shouldRemoveProptypes();
			expect(should).toBeTruthy();
			expect(remover._error).not.toHaveBeenCalled();
		});

		it(`should return true, because argument environment = 'prod'`, () => {
			const should = remover._shouldRemoveProptypes('prod');
			expect(should).toBeTruthy();
			expect(remover._error).not.toHaveBeenCalled();
		});

		it(`should return false, because argument environment = 'dev' or 'test'`, () => {
			const should = remover._shouldRemoveProptypes('dev');
			expect(should).toBeFalsy();
			const should2 = remover._shouldRemoveProptypes('test');
			expect(should2).toBeFalsy();
			expect(remover._error).not.toHaveBeenCalled();
		});

		it('should log a type error and return false, because argument environment is invalid', () => {
			const should = remover._shouldRemoveProptypes({});
			expect(remover._error).toHaveBeenCalledWith(expect.any(TypeError));
			expect(should).toBeFalsy();
		});
	});
});
