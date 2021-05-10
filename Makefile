MAKEFLAGS = -s ${MAX_PARALLEL_MAKEFLAG}
SHELL = /bin/bash
ROOTDIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

### YARN
# CircleCI yarn cache directory may also need to be updated in sync with this
YARN_CACHE_DIR=~/.yarncache

# Aliases
bs: bootstrap

###############################################################################
# Bootstrapping - get the local machine ready

.PHONY: _bootstrap-node
_bootstrap-node:
	mkdir -p ${YARN_CACHE_DIR}
	yarn config set cache-folder ${YARN_CACHE_DIR}
	yarn install

.PHONY: bootstrap
bootstrap:
	$(MAKE) MAKEFLAGS= _bootstrap-node
	echo
	echo '  make bootstrap complete!'
	echo

###############################################################################
# Lint / tests

.PHONY: lint
lint:
	find . -name "*.ts" | grep -v /dist/ | grep -v /node_modules/ | grep -v .d.ts | xargs ${ROOTDIR}/node_modules/.bin/eslint

.PHONY: lint-fix
lint-fix:
	find . -name "*.ts" | grep -v /dist/ | grep -v /node_modules/ | grep -v .d.ts | xargs ${ROOTDIR}/node_modules/.bin/eslint --fix

.PHONY: compile
compile:
	${ROOTDIR}/node_modules/.bin/tsc
	${ROOTDIR}/node_modules/.bin/esbuild ${ROOTDIR}/testing/execution_helper.ts \
		--bundle \
		--outfile=${ROOTDIR}/dist/testing/execution_helper_bundle.js \
		--format=cjs \
		--banner:js="'use strict';"
	${ROOTDIR}/node_modules/.bin/esbuild ${ROOTDIR}/index.ts \
		--bundle \
		--outfile=${ROOTDIR}/dist/bundle.js \
		--format=cjs \
		--minify \
		--banner:js="'use strict';"
	# Generate a typescript file for use in /experimental so the web editor
	# can resolve packs-sdk imports
	${ROOTDIR}/node_modules/.bin/dts-bundle-generator ${ROOTDIR}/index.ts \
  	-o ${ROOTDIR}/dist/bundle.d.ts \
		--no-banner

.PHONY: docs
docs:
	${ROOTDIR}/node_modules/.bin/typedoc index.ts --out ${ROOTDIR}/local-docs --excludeExternals --excludePrivate --excludeProtected

.PHONY: view-docs
view-docs: docs
	open ${ROOTDIR}/local-docs/index.html

.PHONY: test
test:
	TS_NODE_TRANSPILE_ONLY=1 ${ROOTDIR}/node_modules/.bin/mocha test/*_test.ts

.PHONY: clean
clean:
	rm -rf ${ROOTDIR}/dist

.PHONY: build
build: clean lint compile

# allow debugging packs sdk with local packs repo.
.PHONY: publish-local
publish-local: build
	cp -r dist/* ../packs/node_modules/coda-packs-sdk/dist/

.PHONY: validate-no-changes
validate-no-changes: compile
	$(eval UNTRACKED_FILES := $(shell git status --short))
	$(eval CHANGED_FILES := $(shell git diff --name-only))
	if [[ -n "${UNTRACKED_FILES}" || -n "${CHANGED_FILES}" ]]; then \
		echo "dist directory is not clean. run 'make build'"; \
		exit 1; \
	fi
