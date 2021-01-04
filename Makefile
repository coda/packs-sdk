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

.PHONY: docs
docs:
	${ROOTDIR}/node_modules/.bin/typedoc index.ts --excludeExternals --excludePrivate --excludeProtected

.PHONY: test
test:
	TS_NODE_TRANSPILE_ONLY=1 ${ROOTDIR}/node_modules/.bin/mocha test/*_test.ts

.PHONY: build
build: lint compile

.PHONY: validate-no-changes
validate-no-changes: compile
	$(eval UNTRACKED_FILES := $(shell git status --short))
	$(eval CHANGED_FILES := $(shell git diff --name-only))
	if [[ -n "${UNTRACKED_FILES}" || -n "${CHANGED_FILES}" ]]; then \
		echo "dist directory is not clean. run 'make build'"; \
		exit 1; \
	fi
