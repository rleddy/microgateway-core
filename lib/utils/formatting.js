


// code for use in formatting messages used throughout and especially logging

const DEFAULT_ERROR_SEP = ";;;  "



// oneLineErrorCallStack
//
// Sometimes there is a requirement to put the call stack on a single line.
// This method splits the multiline call stack and rejoins it into a single string with the user chosen separator or the default separator.

module.export.oneLineErrorCallStack = (eObj,separator) => {
    if ( typeof eObj === 'object' ) {
        if ( eObj.constructor !== undefined ) {
            if ( eObj.constructor.name === 'TypeError' ) {
                var b = eObj.stack.split('\n').map(line => line.trim())
                if ( separator === undefined ) {
                    separator = DEFAULT_ERROR_SEP
                }
                return b.join(separator)
            }
        }
    } 
    return(false)
}


