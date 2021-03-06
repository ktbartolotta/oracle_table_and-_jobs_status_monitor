tableAuditor = {};

tableAuditor.getTableList = function () {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=host;"
            + "User id=user;Password=password"
        );

    return cnn.Execute(
        "select * from PADHAUD_ROW_COUNT_COMP_VW"
    );
}

tableAuditor.getRowClass = function (percentDiff) {
    if (percentDiff >= .25 && percentDiff < .5) {
        return "runCountWarning";
    }
    else if (percentDiff >= .5) {
        return "runCountCritical";
    }
    else {
        return "safeCount";
    }
}