#!/usr/bin/env bash
#
# Taken from https://github.com/icefox/git-hooks/blob/master/git-hooks
#
# Copyright (c) 2010-2014, Benjamin C. Meyer <ben@meyerhome.net>
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
# 1. Redistributions of source code must retain the above copyright
#    notice, this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in the
#    documentation and/or other materials provided with the distribution.
# 3. Neither the name of the project nor the
#    names of its contributors may be used to endorse or promote products
#    derived from this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER ''AS IS'' AND ANY
# EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
# WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
# DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY
# DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
# (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
# LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
# ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
# SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#

function hook_dirs
{
    if [ ! -z "${1}" ] ; then
        hook="/${1}"
    else
        hook=""
    fi
    echo "${HOME}/.git_hooks${hook}"
    git rev-parse --git-dir &> /dev/null
    if [ $? -eq 0 ]; then
    if [ $(git rev-parse --is-bare-repository) = 'false' ]; then
        cd $(git rev-parse --show-toplevel)
        echo "${PWD}/git_hooks${hook}"
        echo "${PWD}/.githooks${hook}"
    fi
    fi
    eval echo "`git config hooks.global`"${hook}
}

function list_hooks_in_dir
{
    path="${1}"
    level="${2}"

    find --help 2>&1 | grep -- '-L' 2>/dev/null >/dev/null
    if [ $? -eq 1 ] ; then
	Lopt=
    else
	Lopt=-L
    fi

    find ${Lopt} "${path}/" \
	 -mindepth ${level} \
	 -maxdepth ${level} \
	 \( -perm -100 -o -perm -010 -o -perm -001 \) \
	 -type f 2>/dev/null \
	| grep -v "^.$" | sort
}

function list_hooks
{
    GITDIR=`git rev-parse --git-dir`
    cat "${GITDIR}/hooks/pre-commit" 2> /dev/null | grep 'git-hooks' > /dev/null 2> /dev/null

    local dir_names=(User Repository Global)
    local directories=$(hook_dirs)
    local index=0

    local hook_name=
    local last_dir=
    local current_dir=

    local space_size=35
    local about=

    echo 'Listing User, Project, and Global hooks:'
    echo ""

    for dir in $directories; do
        echo -e "\033[0;33m${dir_names[$index]}\033[0m - ${dir} "
        index=$(($index+1))
        for hook in `list_hooks_in_dir "${dir}" 2` ; do
            hook_name=$(basename "$hook")
            current_dir=$(dirname "$hook")
            if [ "$current_dir" != "$last_dir" ]; then
                echo $(basename "$current_dir")
                last_dir="$current_dir"
            fi
            about=$(${hook} "--about")
            echo "  "$(printf "%-${space_size}s%s" $(echo -e "\033[1;36m${hook_name}\033[0m___" | sed -e 's/-/_/g' )  | sed -e 's/ /-/g' -e 's/_/ /g' )"- $about"
        done
        echo ""
    done
}

function run_hooks
{
    dir="${1}"
    if [[ -z ${dir} || ! -d "${dir}" ]] ; then
        echo "run_hooks requires a directory name as an argument."
        return 1
    fi
    shift 1
    for hook in `list_hooks_in_dir "${dir}" 1`
    do
        export last_run_hook="${hook} $@"
        if [ ! -z ${GIT_HOOKS_VERBOSE} ] ; then
            echo -n "@@ Running hook: "
            echo -n `basename \`dirname "${hook}"\``
            echo "/`basename "${hook}"`"
        fi
        ${hook} "$@"
    done
}

function run_hook
{
    set -e
    hook=`basename "${1}"`
    if [ -z ${hook} ] ; then
        echo "run requires a hook argument"
        return 1
    fi
    shift 1
    for dir in `hook_dirs "${hook}"`; do
        if [ ! -d "${dir}" ] ; then
            continue
        fi
        run_hooks "${dir}" "$@"
    done
    set +e
}

function install_hooks_into
{
    DIR=$1
    cd "${DIR}"

    set -e
    mv hooks hooks.old
    set +e
    mkdir hooks
    cd hooks
    for file in applypatch-msg commit-msg post-applypatch post-checkout post-commit post-merge post-receive pre-applypatch pre-auto-gc pre-commit prepare-commit-msg pre-rebase pre-receive update pre-push
    do
        echo "${2}" > "${file}"
        chmod +x "${file}"
    done
}

function install_hooks
{
    GITDIR=`git rev-parse --git-dir`
    if [ ! $? -eq 0 ] ; then
        echo "$1 must be run inside a git repository"
        return 1
    fi
    cd "${GITDIR}"
    if [ "${1}" = "--install" ] ; then
        if [ -d hooks.old ] ; then
            echo "hooks.old already exists, perhaps you already installed?"
            return 1
        fi
    cmd='#!/usr/bin/env bash
scripts/dev/git-hooks.sh run "$0" "$@"';
    install_hooks_into "${PWD}" "${cmd}"
    else
        if [ ! -d hooks.old ] ; then
            echo "Error, hooks.old doesn't exists, aborting uninstall to not destroy something"
            return 1
        fi
        rm -rf hooks
        mv hooks.old hooks
    fi
}

function install_global
{
    TEMPLATE="$HOME/.git-template-with-git-hooks"
    if [ ! -d "${TEMPLATE}" ] ; then
        DEFAULT=/usr/share/git-core/templates
        if [ -d ${DEFAULT} ] ; then
            cp -rf /usr/share/git-core/templates "${TEMPLATE}"
        else
            mkdir -p "${TEMPLATE}/hooks"
        fi
        cmd="#!/usr/bin/env bash
echo \"git hooks not installed in this repository.  Run 'git hooks --install' to install it or 'git hooks -h' for more information.\"";
        install_hooks_into "${TEMPLATE}" "${cmd}"
        mv "${TEMPLATE}/hooks.old" "${TEMPLATE}/hooks.original"
    fi
    git config --global init.templatedir "${TEMPLATE}"
    echo "Git global config init.templatedir is now set to ${TEMPLATE}"
}

function uninstall_global
{
    git config --global --unset init.templatedir
}

function report_error
{
    echo "Hook failed: $last_run_hook"
    exit 1

}

case $1 in
    run )
        if [ ! -z "${GIT_DIR}" ] ; then
            unset GIT_DIR
        fi
        shift
        trap report_error ERR
        run_hook "$@"
        ;;
    --install|--uninstall )
        install_hooks "$1"
        ;;
    --install-global|--installglobal )
        install_global
        ;;
    --uninstall-global|--uninstallglobal )
        uninstall_global
        ;;
    -h|--help|-? )
        echo 'Git Hooks'
        echo '    A tool to manage project, user, and global Git hooks for multiple git repositories.'
        echo '    https://github.com/icefox/git-hooks'
        echo ''
        echo 'Options:'
        echo '    --install      Replace existing hooks in this repository with a call to'
        echo '                   git hooks run [hook].  Move old hooks directory to hooks.old'
        echo '    --uninstall    Remove existing hooks in this repository and rename hooks.old'
        echo '                   back to hooks'
        echo '    --install-global'
        echo '                   Create a template .git directory that that will be used whenever'
        echo '                   a git repository is created or cloned that will remind the user'
        echo '                   to install git-hooks.'
        echo '    --uninstall-global'
        echo '                   Turn off the global .git directory template that has the reminder.'
        echo "    run <cmd>      Run the hooks for <cmd> (such as pre-commit)"
        echo "    (no arguments) Show currently installed hooks"
        ;;
    * )
        list_hooks
        ;;
esac
