import {withQueryParams} from '../helpers/url';

describe('url helper', () => {
    describe('withQueryParams', () => {
        it('should generate a url with simple params', () => assert.equal(
                withQueryParams('https://example.org/', { key: 'simple', anotherKey: 'value2' }),
                'https://example.org/?key=simple&anotherKey=value2',
            ),
        );

        it('should generate a url with existing params', () => assert.equal(
            withQueryParams('https://example.org/?existing=1', { key: 'simple', anotherKey: 'value2' }),
            'https://example.org/?existing=1&key=simple&anotherKey=value2',
            ),
        );

        it('should generate a url with encoded params', () => assert.equal(
            withQueryParams('https://example.org/', { key: 'J._S._Fry_&_Sons' }),
            'https://example.org/?key=J._S._Fry_%26_Sons',
            ),
        );

        it('should handle params without an undefined query param', () => assert.equal(
            withQueryParams('https://example.org/', { key: undefined }),
            'https://example.org/',
        ));
    });
});
