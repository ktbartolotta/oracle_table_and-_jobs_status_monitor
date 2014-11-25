$(function () {
    $("#tabs").tabs();

    var auditTimer = '';
    var indepTemplate = _.template($("#indep-paths-template").html());
    var depTemplate = _.template($("#dep-paths-template").html());
    var errorTemplate = _.template($("#error-template").html());
    var fileTemplate = _.template($("#file-text-template").html());
    var auditTemplate = _.template($("#audit-template").html());
    var tableListTemplate = _.template($("#indep-table-list-template").html());
    var tableFinderTabTemplate = _.template($("#table-finder-tabs-template").html());
    var tableFinderReportTemplate = _.template($("#table-finder-reports-template").html());
    var recs = tablefinder.getFilePathToIndepTableList();
    var pathRoleUpList = tablefinder.getFilePathToDepTableList();
    var reportToTableList = tablefinder.getTableToReportList();
    var tables = _.pluck(tablefinder.getTables(), "TARGET_TABLE");

    $("#table-input").autocomplete({
        source: tables,
        minLength: 4,
        select: function (event, ui) {
            var value = ui.item.value;
            var depMatches = _.filter(pathRoleUpList, function (r) {
                return r.DEPENDANT_TABLE === value;
            });

            var indepMatches = _.filter(recs, function (r) {
                return r.INDEPENDANT_TABLE === value;
            });

            var reportMatches = _.filter(reportToTableList, function (r) {
                return r.TABLE_NAME === value;
            });

            var tabs = [];

            if (depMatches.length > 0) {
                tabs.push({
                    name: "Dependent",
                    content: depTemplate({
                        matches: depMatches, 
                        title: value + " Dependent Process Paths"
                    })
                });
            }
            if (indepMatches.length > 0) {
                tabs.push({
                    name: "Independent",
                    content: indepTemplate({
                        matches: indepMatches,
                        title: value + " Independent Process Paths"
                    })
                });
            }
            if (reportMatches.length > 0) {
                tabs.push({
                    name: "Reports",
                    content: tableFinderReportTemplate({
                        reports: reportMatches,
                        title: value + " Report Paths"
                    })
                })
            }

            $("#table-finder-tabs").html(
                tableFinderTabTemplate({
                    tabs: tabs
            }));

            try {
                $("#table-finder-tabs").tabs("destroy").tabs();
            }
            catch (e) {}
            $("#table-finder-tabs").tabs();

            $("a.report-path-link").click(function () {
                tablefinder.launchDiscovererReport($(this).text());
            });

            $("a.path-link").click(function () {
                $("#dialog").html(
                    fileTemplate({
                        fileText: tablefinder.getFileText($(this).text())
                }));
                $("#dialog").dialog("open");
            });

            $(".btn.btn-default.indep-open").click(function () {
                $(this).siblings().toggle();
            });
        }
    });

    

    $("#dialog").dialog({
        autoOpen: false,
        resizable: true,
        width: 1000,
        height: 800,
        modal: true,
        position: {
            my: "center top", 
            at: "center top"
        }
    })

    $("#table-finder-tab").click(function () {
        clearInterval(auditTimer);
    })

    $("#error-tab").click(function () {
        clearInterval(auditTimer);
        $("#error-div").html(
            errorTemplate({
                errorObjects: errorReader.getErrorObjects()
        }));

        $("a.error-path-link").click(function () {
            $("#dialog").html(
                fileTemplate({
                    fileText: errorReader.getFileText($(this).text())
            }));
            $("#dialog").dialog("open");
        });
    });

    $("#table-audit-tab").click(function () {
        clearInterval(auditTimer);
        $("#audit-div").html(
            auditTemplate({
                auditObjects: tableAuditor.getTableList()
        }));
        auditTimer = setInterval(function () {
            $("#audit-div").html(
                auditTemplate({
                    auditObjects: tableAuditor.getTableList()
            }));
        }, 300000);
    });
});