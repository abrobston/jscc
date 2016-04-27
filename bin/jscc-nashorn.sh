#!/bin/sh
jjs=${JAVA_HOME}/bin/jjs
dirname=$(dirname $0)
if [ -x "$jjs" ]
then
    "${jjs}" -doe --debug-locals=true --debug-lines=true "${dirname}/runner-java.js" -- "${dirname}" nashorn "$@"
    exit $?
else
    echo "Nashorn executable not found at '${jjs}' or is not executable.  Ensure that the JAVA_HOME environment variable points to the root of a Java 8 or later installation."
    exit 1
fi
