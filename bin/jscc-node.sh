#!/bin/sh
nodeExe=$(which nodejs || which node)
if [ -x "${nodeExe}" ]
then
    "${nodeExe}" $_/runner-node.js "$@"
else
    echo "Could not find node executable in PATH"
    exit 1
fi
