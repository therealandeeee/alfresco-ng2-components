import * as si from "../SourceInfoClasses";


export function processDocs(mdCache, aggData, errorMessages) {
    let stoplist = makeStoplist(aggData.config);

    let classNames = Object.keys(aggData.classInfo);
    
    classNames.forEach(className => {
        let classInfo: si.ComponentInfo = aggData.classInfo[className];
        
        if (className.match(/component|directive|model|pipe|service|widget$/i) && !mdCache[className]) {
            let docFileName = aggData.nameLookup.classToDocName(className);
            
            if (!rejectItemViaStoplist(stoplist, docFileName)) {
                errorMessages.push(`Warning: class ${className} has no corresponding Markdown file`);
            }
        }
    });
}

// Create a stoplist of regular expressions.
function makeStoplist(config) {
    var listExpressions = config.undocStoplist;
    var result = [];

    for (var i = 0; i < listExpressions.length; i++) {
        result.push(new RegExp(listExpressions[i]));
    }

    return result;
}

// Check if an item is covered by the stoplist and reject it if so.
function rejectItemViaStoplist(stoplist, itemName) {
    for (var i = 0; i < stoplist.length; i++) {
        if (stoplist[i].test(itemName)) {
            return true;
        }
    }

    return false;
}