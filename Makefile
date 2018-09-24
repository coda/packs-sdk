MAKEFLAGS = -s ${MAX_PARALLEL_MAKEFLAG}
SHELL = /bin/bash
ROOTDIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

# Aliases
bs: bootstrap

###############################################################################
# Bootstrapping - get the local machine ready

.PHONY: _bootstrap-node
_bootstrap-node:
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
	${ROOTDIR}/node_modules/.bin/tslint --project tsconfig.json

.PHONY: compile
compile:
	${ROOTDIR}/node_modules/.bin/tsc

.PHONY: test
test:
	TS_NODE_TRANSPILE_ONLY=1 ${ROOTDIR}/node_modules/.bin/mocha --opts test/mocha.opts test/*_test.ts

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
