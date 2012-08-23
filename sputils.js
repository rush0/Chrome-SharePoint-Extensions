
var GetSettingsTable = function (classname) {

    if (classname === "") {
        throw "no classname specified";
    }

    var tables = document.getElementsByTagName("table");
    var table;
    for (var i = 0; i < tables.length; i++) {

        var tableclass = tables[i].getAttribute("class");

        if (tableclass == null) continue;

        if (tableclass.indexOf(classname) != -1) {
            table = tables[i];
        }
    }
    console.log(table);
    return table;
};

var GetFieldsFromLinkCollection = function (linkCollection) {

    if (linkCollection.length == 0) {
        throw "Invalid Link Collection."
    }

    var collection = [];
    for (var i = 0; i < linkCollection.length; i++) {

        var linkId = linkCollection[i].getAttribute("id");
        console.log(linkId);
        if (linkId.indexOf("LinkEditField") !== -1) {
            collection.push(linkCollection[i]);
        }
    }

    return collection;
};

var GetFieldNames = function (fields) {
    if (fields.length == 0) {
        throw "No valid fields found.";
    }

    var fieldnames = [];
    for (var i = 0; i < fields.length; i++) {
        var href = fields[i].getAttribute("href");
        if (href.indexOf("&Field=") != -1) {
            var startpos = href.indexOf("&Field=") + 7;
            fieldnames.push(decodeURI(href.substring(startpos, href.length)));
        }
    }
    console.log(fieldnames);
    return fieldnames;
};

var UpdateResults = function (resultSet) {
    if (resultSet.length == 0) {
        throw "No Results";
    }

    var markup = "";
    for (i = 0; i < resultSet.length; i++) {
        markup += resultSet[i] + "<br />";
    }

    PassMarkup(markup);

}

var PassMarkup = function (markup) {
    chrome.extension.sendRequest({ listMarkup: markup });
}

console.log("Starting");
var mainTable = GetSettingsTable("ms-settingsframe");
if (mainTable != null) {
    var links = mainTable.getElementsByTagName("a");
    var fields = GetFieldsFromLinkCollection(links);
    var fieldNames = GetFieldNames(fields);
    UpdateResults(fieldNames);
}
else {
    mainTable = GetSettingsTable("ms-listviewtable");
    var fieldDivs = mainTable.getElementsByClassName("ms-viewheadertr")[0].getElementsByClassName("ms-vh-div");
    var markup = "";
    for (var i = 0; i < fieldDivs.length; i++) {
        var name = fieldDivs[i].getAttribute("name");
        if (name == null) continue;
        markup += fieldDivs[i].getAttribute("name") + "<br />";
    }
    PassMarkup(markup);
}
