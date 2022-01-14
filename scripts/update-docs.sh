# temporary script before we move to CI

# head
MK_DOCS_SITE_URL="https://head.coda.io/packs/build/latest/" make build-mkdocs
make publish-docs-head FLAGS=--forceUpload
echo "\nFinishing building and pushing to head!\n"

# staging
MK_DOCS_SITE_URL="https://staging.coda.io/packs/build/latest/" make build-mkdocs
make publish-docs-staging FLAGS=--forceUpload
echo "\nFinishing building and pushing to staging!\n"

# prod
MK_DOCS_SITE_URL="https://coda.io/packs/build/latest/" make build-mkdocs
make publish-docs-prod FLAGS=--forceUpload
echo "\nFinishing building and pushing to prod!\n"
echo "Run `make npm-publish` to publish to npm"
