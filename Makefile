install:
	npm install
lint:
	npx eslint .
publish:
	npm publish --dry-run
test: 
	npm run test
test-coverage:
	npm run test -- --coverage
