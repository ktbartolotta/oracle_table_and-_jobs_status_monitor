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
    var recs = tablefinder.getFilePathToIndepTableList();
    var pathRoleUpList = tablefinder.getFilePathToDepTableList();
    var tables = _.pluck(tablefinder.getTables(), "TARGET_TABLE")

    $("#table-input").autocomplete({
        source: tables,
        minLength: 4,
        select: function (event, ui) {
            var value = ui.item.value;
            var dep_matches = _.filter(pathRoleUpList, function (r) {
                return r.DEPENDANT_TABLE === value;
            });

            var indep_matches = _.filter(recs, function (r) {
                return r.INDEPENDANT_TABLE === value;
            });

            var tabs = [];

            if (dep_matches.length > 0) {
                tabs.push({
                    name: "Dependant",
                    content: depTemplate({
                        matches: dep_matches, 
                        title: value + " Dependant Process Paths"
                    })
                });
            }
            if (indep_matches.length > 0) {
                tabs.push({
                    name: "Independant",
                    content: indepTemplate({
                        matches: indep_matches,
                        title: value + " Independant Process Paths"
                    })
                });
            }

            $("#table-finder-tabs").html(
                tableFinderTabTemplate({
                    tabs: tabs
            }));

            $("#table-finder-tabs").tabs();

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