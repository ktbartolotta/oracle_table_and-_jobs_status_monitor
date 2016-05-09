tablefinder = {};

tablefinder.getUserID = function () {
    var oShell = new ActiveXObject("WScript.Shell");
    return oShell.ExpandEnvironmentStrings("%USERNAME%");
}

tablefinder.getTables = function () {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=host;"
            + "User id=user;Password=password"
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
            "Provider=msdaora;Data source=host;"
            + "User id=user;Password=password"
        );
    return cnn.Execute(
        "select distinct process_path, start_file, sql_file, "
        + "independant_table, dependant_table from padh_table_process_paths_vw "
        + "order by process_path"
    );
}

tablefinder.getFilePathToDepTableList = function () {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=host;"
            + "User id=user;Password=password"
        );
    return cnn.Execute(
        "select distinct process_path, start_file, sql_file, "
        + "dependant_table from padh_table_process_paths_vw "
        + "order by process_path"
    );
}

tablefinder.getIndepTableBySqlFileAndDepTable = function (sqlFile, depTable) {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=host;"
            + "User id=user;Password=password"
        );
    return cnn.Execute(
        "select distinct independant_table from padh_table_process_paths_vw "
        + "where sql_file = '" + sqlFile + "' and dependant_table = '"
        + depTable + "' order by independant_table"
    );
}

tablefinder.getFilePathToIndepTableList = function () {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=host;"
            + "User id=user;Password=password"
        );
    return cnn.Execute(
        "select distinct process_path, start_file, sql_file, "
        + "independant_table from padh_table_process_paths_vw "
        + "order by process_path"
    );
}

tablefinder.getDepTableBySqlFileAndIndepTable = function (sqlFile, indepTable) {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=host;"
            + "User id=user;Password=password"
        );
    return cnn.Execute(
        "select distinct dependant_table from padh_table_process_paths_vw "
        + "where sql_file = '" + sqlFile + "' and independant_table = '"
        + indepTable + "' order by dependant_table"
    );
}

tablefinder.getTableToReportList = function () {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=host;"
            + "User id=user;Password=password"
        );
    return cnn.Execute(
        "select * from padh_table_to_disc_report"
    );
}

tablefinder.getFileText = function (filePath) {
    if (filePath === 'schedule') {
        filePath = 'padhaud/' + filePath;
    }
    var oShell = new ActiveXObject("WScript.Shell");
    var shellStream = oShell.Exec(
        "app\\rsc\\plink.exe " + tablefinder.getUserID() + "@server: "
        + "\"cat /apps/ppl/adhoc/" + filePath + "\"");

    return shellStream.StdOut.ReadAll().split("\n");
}

tablefinder.launchDiscovererReport = function (reportPath) {
    var oShell = new ActiveXObject("WScript.Shell");
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var folder = fso.GetFolder(".\\");
    var files = new Enumerator(folder.Files);
    var shellStream = oShell.Exec(
        "C:\\oracle\\11.1.1\\bin\\dis51usr.exe \"" + reportPath + "\"");
    for(; !files.atEnd(); files.moveNext()) {
        if (/diagnostic/gi.test(files.item())) {
            files.item().Delete();
        }
    }
}
