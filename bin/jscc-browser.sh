#!/bin/sh

# Use PhantomJS from npm (the phantomjs-prebuilt package), but use the standalone
# (non-Node) executable
nodeExe=$(which nodejs || which node)
searchDir=$_/../node_modules/phantomjs-prebuilt
${nodeExe} ${searchDir}/install.js
phantomPath=${searchDir}/lib/$(grep "module.exports.location" ${searchDir}/lib/location.js | sed -re 's/^.*=\s*"(.*)"\s*$/\1/')
if [ -x "${phantomPath}" ]
then
    "${phantomPath}" $_/runner-browser.js "$@"
else
   echo "The phantomjs executable was not found (or was not executable) at '${phantomPath}'"
   exit 1
fi
