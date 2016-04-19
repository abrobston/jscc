#!/bin/sh
jjs=${JAVA_HOME}/bin/jjs
if [ -x "$jjs" ]
then
    "${jjs}" -doe --debug-locals=true --debug-lines=true $_/runner-java.js -- $_ nashorn "$@"
else
    echo "Nashorn executable not found at '${jjs}' or is not executable.  Ensure that the JAVA_HOME environment variable points to the root of a Java 8 or later installation."
    exit 1
fi