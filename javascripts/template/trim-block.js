define(function() {
    return function(input) {
        var lines = input.split(/\r?\n/g), currentMin, index, match;
        
        // Remove leading and trailing blank lines
        while (lines.length > 0 && /^\s*$/.test(lines[0])) {
            lines.shift();
        }
        while (lines.length > 0 && /^\s*$/.test(lines[lines.length - 1])) {
            lines.pop();
        }

        // Find a number of leading spaces to remove.
        currentMin = Number.POSITIVE_INFINITY;
        for (index = 0; index < lines.length && currentMin > 0; index++) {
            match = /^\s*\S/.exec(lines[index]);
            if (match) {
                currentMin = Math.min(currentMin, match[0].length - 1);
            }
        }

        // Remove the spaces.
        if (currentMin > 0) {
            for (index = 0; index < lines.length; index++) {
                if (/^\s*$/.test(lines[index])) {
                    lines[index] = "";
                } else {
                    lines[index] = lines[index].substring(currentMin);
                }
            }
        }
        
        return "\n" + lines.join("\n") + "\n";
    };
});