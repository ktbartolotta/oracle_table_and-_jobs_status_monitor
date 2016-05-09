errorReader = {};

errorReader.getUserID = function () {
    var oShell = new ActiveXObject("WScript.Shell");
    return oShell.ExpandEnvironmentStrings("%USERNAME%");
}

errorReader.getErrorObjects = function () {
    var oShell = new ActiveXObject("WScript.Shell");
    var shellStream = oShell.Exec(
        "app\\rsc\\plink.exe " + errorReader.getUserID()
        + "@lnx-efh-1: \"cd /apps/ppl/adhoc/padhaud/parse_logs;"
        + "sh p_logs.sh\"");
    var output = shellStream.StdOut.ReadAll().split("\n");
    var errorList = []
    for (var i = 0; i < output.length; i++) {
        error = output[i].split("|");
        errorList.push({
            dateTime: error[0],
            file: error[1],
            error: error[2]
        })
    }
    return errorList;
}

errorReader.getFileText = function (filePath) {
    var oShell = new ActiveXObject("WScript.Shell");
    var shellStream = oShell.Exec(
        "app\\rsc\\plink.exe " + tablefinder.getUserID() + "@server: "
        + "\"cat " + filePath + "\"");

    return shellStream.StdOut.ReadAll().split("\n");
}