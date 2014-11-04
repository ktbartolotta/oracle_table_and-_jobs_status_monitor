tablefinder = {};

tablefinder.getUserID = function () {
    var oShell = new ActiveXObject("WScript.Shell");
    return oShell.ExpandEnvironmentStrings("%USERNAME%");
}

tablefinder.getTables = function () {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=padh;"
            + "User id=ppl;Password=energy"
        );

    return cnn.Execute(
        "select distinct target_table "
        + "from ("
        + "select INDEPENDANT_TABLE target_table from padh_table_process_paths_vw "
        + "union "
        + "select DEPENDANT_TABLE target_table from padh_table_process_paths_vw)"
    );
}

tablefinder.getList = function () {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=padh;"
            + "User id=ppl;Password=energy"
        );
        return cnn.Execute(
            "select distinct process_path, start_file, sql_file, "
            + "independant_table, dependant_table from padh_table_process_paths_vw "
            + "order by process_path"
        );
}

tablefinder.getFileText = function (filePath) {
    if (filePath === 'schedule') {
        filePath = 'padhaud/' + filePath;
    }
    var oShell = new ActiveXObject("WScript.Shell");
    var shellStream = oShell.Exec(
        "app\\rsc\\plink.exe " + tablefinder.getUserID() + "@lnx-efh-1: "
        + "\"cat /apps/ppl/adhoc/" + filePath + "\"");

    return shellStream.StdOut.ReadAll().split("\n");
}