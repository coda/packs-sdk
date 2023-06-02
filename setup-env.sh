# Run `source setup-env.sh` as a convenience to add node_modules/.bin to your path,
# which allows you to run binaries from npm packages unqualified, e.g. just
# `ts-node cli/coda.ts` instead of `node_modules/.bin/ts-node cli/coda.ts`

BASEDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

if [[ "$(uname -s)" == "Darwin" ]] && [[ "$(arch)" == "arm64" ]]; then
  export PATH="/opt/homebrew/bin:${PATH}"
fi

export PATH=${BASEDIR}/build/node/bin:${BASEDIR}/node_modules/.bin:${BASEDIR}/.pnpm_install/bin:${PATH}
