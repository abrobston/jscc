#!/bin/sh
jarDir=$_/../jar
javaPath=${JAVA_HOME}/bin/java
if [ ! -x "${javaPath}" ]
then
    echo "Java executable not found.  Ensure that JAVA_HOME is set correctly."
    exit 1
fi

rhinoPath=$(find ${jarDir} -iname 'rhino*.jar' | head -n 1)

if [ -r "${rhinoPath}" ]
then
    "${javaPath}" -server -XX:+TieredCompilation -classpath "${rhinoPath}" org.mozilla.javascript.tools.shell.Main -opt -1 $_/runner-java.js $_ rhino "$@"
else
    echo "Rhino jar file not found in '${jarDir}' or its subdirectories."
    exit 1
fi
