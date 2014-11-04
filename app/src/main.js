$(function () {
    $("#tabs").tabs();
    var auditTimer = '';
    var template = _.template($("#paths-template").html());
    var errorTemplate = _.template($("#error-template").html());
    var fileTemplate = _.template($("#file-text-template").html());
    var auditTemplate = _.template($("#audit-template").html());
    var recs = tablefinder.getList();
    var tables = _.pluck(tablefinder.getTables(), "TARGET_TABLE")
    $("#table-input").autocomplete({
        source: tables,
        minLength: 4,
        select: function (event, ui) {
            var value = ui.item.value;
            var dep_matches = _.filter(recs, function (r) {
                return r.DEPENDANT_TABLE === value;
            });
            var indep_matches = _.filter(recs, function (r) {
                return r.INDEPENDANT_TABLE === value;
            });
            $("#path-div").html(
                template({
                    matches: dep_matches, 
                    title: value + " Dependant Process Paths"
                }));
            $("#path-div").append(
                template({
                    matches: indep_matches,
                    title: value + " Independant Process Paths"
                }));

            $("a.path-link").click(function () {
                $("#dialog").html(
                    fileTemplate({
                        fileText: tablefinder.getFileText($(this).text())
                }));
                $("#dialog").dialog("open");
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