tableAuditor = {};

tableAuditor.getTableList = function () {
    var cnn = ADODB.connection(
            "Provider=msdaora;Data source=padh;"
            + "User id=ppl;Password=energy"
        );

    return cnn.Execute(
        "select * from PADHAUD_VW"
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