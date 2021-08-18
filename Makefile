MAKEFLAGS = -s ${MAX_PARALLEL_MAKEFLAG}
SHELL = /bin/bash
ROOTDIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

### YARN
# CircleCI yarn cache directory may also need to be updated in sync with this
YARN_CACHE_DIR=~/.yarncache

ISOLATED_VM_VERSION_COMMAND="require('./node_modules/isolated-vm/package.json').version"
ISOLATED_VM_VERSION=$(shell node -p -e $(ISOLATED_VM_VERSION_COMMAND))

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

.PHONY: do-compile-isolated-vm
do-compile-isolated-vm:
	rm -rf build-isolated-vm

	mkdir build-isolated-vm && \
		cd build-isolated-vm && \
		npm init -y && \
		docker run --rm -v `pwd`:/var/task amazon/aws-sam-cli-build-image-nodejs14.x:latest npm install isolated-vm@${ISOLATED_VM_VERSION}
	cp build-isolated-vm/node_modules/isolated-vm/package.json runtime/isolated-vm/
	cp build-isolated-vm/node_modules/isolated-vm/isolated-vm.js runtime/isolated-vm/
	cp build-isolated-vm/node_modules/isolated-vm/out/isolated_vm.node runtime/isolated-vm/out/

	rm -rf build-isolated-vm

.PHONY: compile-isolated-vm
compile-isolated-vm:
	if [ `node -p -e "require('./runtime/isolated-vm/package.json').version"` != $(ISOLATED_VM_VERSION) ]; \
		then $(MAKE) do-compile-isolated-vm; \
		else echo "isolated-vm version matches, skipping."; \
	fi

.PHONY: compile
compile:
	${ROOTDIR}/node_modules/.bin/tsc
	${ROOTDIR}/node_modules/.bin/esbuild ${ROOTDIR}/runtime/thunk/thunk.ts \
		--bundle \
		--outfile=${ROOTDIR}/bundles/thunk_bundle.js \
		--inject:${ROOTDIR}/testing/injections/buffer_shim.js \
		--format=cjs \
		--banner:js="'use strict';"
	# copy it to dist/ to make it available after packaging.
	mkdir -p ${ROOTDIR}/dist/bundles/ && cp ${ROOTDIR}/bundles/thunk_bundle.js ${ROOTDIR}/dist/bundles/thunk_bundle.js
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
	# Generate isolated-vm binaries that's compatible to Amazon Linux 2.
	$(MAKE) compile-isolated-vm
	# copy these esm format js files to dist directly.
	cp -r ${ROOTDIR}/testing/injections ${ROOTDIR}/dist/testing/

.PHONY: generated-documentation
generated-documentation:
	node -r ts-node/register documentation/documentation_compiler.ts

.PHONY: typedoc
typedoc:
	if [ "${shell git config --get remote.origin.url}" != "git@github.com:coda/packs-sdk.git" ]; then \
		echo "Please config your git origin to git@github.com:coda/packs-sdk.git"; \
		exit 1; \
	fi
	${ROOTDIR}/node_modules/.bin/typedoc index.ts --out ${ROOTDIR}/docs --excludeExternals --excludePrivate --excludeProtected --gitRevision main

.PHONY: docs
docs: generated-documentation typedoc

.PHONY: view-docs
view-docs: typedoc
	open ${ROOTDIR}/docs/index.html

.PHONY: test
test:
	TS_NODE_TRANSPILE_ONLY=1 ${ROOTDIR}/node_modules/.bin/mocha test/*_test.ts

.PHONY: test-file
test-file:
	TS_NODE_TRANSPILE_ONLY=1 ${ROOTDIR}/node_modules/.bin/mocha ${FILE}

.PHONY: clean
clean:
	rm -rf ${ROOTDIR}/dist

.PHONY: build
build: clean lint compile docs

# allow debugging packs sdk with local packs repo.
.PHONY: publish-local
publish-local: build
	cp -r dist/* ../packs/node_modules/@codahq/packs-sdk/dist/

.PHONY: validate-no-changes
validate-no-changes: compile
	$(eval UNTRACKED_FILES := $(shell git status --short))
	$(eval CHANGED_FILES := $(shell git diff --name-only))
	if [[ -n "${UNTRACKED_FILES}" || -n "${CHANGED_FILES}" ]]; then \
		echo "dist directory is not clean. run 'make build'"; \
		exit 1; \
	fi

.PHONY: npm-publish
npm-publish:
	npm publish --tag alpha --tag latest --access public
