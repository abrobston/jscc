#!/bin/bash

# Use PhantomJS from npm (the phantomjs-prebuilt package), but use the standalone
# (non-Node) executable
nodeExe=$(which nodejs || which node)
searchDir=$(dirname $0)/../node_modules/phantomjs-prebuilt
env=$(which env)
if [ -r "${searchDir}/lib/location.js" ]
then
    phantomPath=$(grep "module.exports.location" "${searchDir}/lib/location.js" | sed -re 's/^.*=\s*"(.*)"\s*$/\1/')
    if [[ "${phantomPath}" =~ ^[^/] ]]
    then
        phantomPath=${searchDir}/lib/${phantomPath}
    fi
else
    if [ "${npm_config_tmp}x" = "x" ]
    then
        npm_config_tmp=$(dirname $0)/../tmp
    fi
    ${env} npm_config_tmp=${npm_config_tmp} ${nodeExe} ${searchDir}/install.js
    phantomPath=${searchDir}/lib/$(grep "module.exports.location" ${searchDir}/lib/location.js | sed -re 's/^.*=\s*"(.*)"\s*$/\1/')
fi

if [ -x "${phantomPath}" ]
then
    "${phantomPath}" "$(dirname $0)/runner-browser.js" "$@"
    exit $?
else
   echo "The phantomjs executable was not found (or was not executable) at '${phantomPath}'"
   exit 1
fi
