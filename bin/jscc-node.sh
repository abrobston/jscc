#!/bin/sh
nodeExe=$(which nodejs || which node)
if [ -x "${nodeExe}" ]
then
    "${nodeExe}" "$(dirname $0)/runner-node.js" "$@"
    exit $?
else
    echo "Could not find node executable in PATH"
    exit 1
fi
