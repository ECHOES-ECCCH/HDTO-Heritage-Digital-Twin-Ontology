/*
CIDOC CRM XML/HTML JavaScript scripts

This JavaScript file contains all the scripts used in order to display the xml/html representation of each cidoc - crm version.
It contains an array of entities per version in order to create the links to other versions.

Created by FORTH - ICS  Tuesday, November 25, 2025
*/

var langCodes = {
    'en': 'English',
    'de': 'German',
    'el': 'Greek',
    'fr': 'French',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese'
};

var xmlFile;


function getSuperClassesOf(id) {

    return $(xmlFile).find("class[id='" + id + "']").find("subClassOf").map(function () { return $.trim($(this).attr("id")); }).get();
}


function getSubClassesOf(id) {
    return $(xmlFile).find("class").has("subClassOf[id='" + id + "']").map(function () { return $.trim($(this).attr("id")); })
        .get();
}


function getClassProperties(id) {
    return $(xmlFile).find("property").has("domain[id='" + id + "']").map(function () { return $.trim($(this).attr("id")); }).get();
}

function getClassInverseProperties(id) {
    return $(xmlFile).find("property").has(">range[id='" + id + "']").map(function () { return $.trim($(this).attr("id")); }).get();
}

function getSuperPropertiesOf(idWithInverse) {
    var id = idWithInverse.replace("i", "");
    /*var direct = $(xmlFile).find("property[id='" + id + "']").find("subPropertyOf").map(function () { return $.trim($(this).attr("id")).replace("i", ""); }).get();*/
    var direct = $(xmlFile).find("property[id='" + id + "']").find("subPropertyOf").map(function () { return $.trim($(this).attr("id")); }).get();

    id += "i";
    /*var inv = $(xmlFile).find("property[id='" + id + "']").find("subPropertyOf").map(function () { return $.trim($(this).attr("id")).replace("i", ""); }).get();*/
    var inv = $(xmlFile).find("property[id='" + id + "']").find("subPropertyOf").map(function () { return $.trim($(this).attr("id")) + "i"; }).get();


    if (Array.isArray(inv) && inv.length) {
        inv.filter(x => !direct.includes(x)).forEach(x => direct.push(x));
    }

    return direct;
}




function getSubPropertiesOf(idWithInverse) {
    /*return $(xmlFile).find("property").has("subPropertyOf[id='" + id + "']").map(function () { return $.trim($(this).attr("id")).replace("i", ""); })
        .get();*/


    var id = idWithInverse.replace("i", "");
    /*var direct = $(xmlFile).find("property").has("subPropertyOf[id='" + id + "']").map(function () { return $.trim($(this).attr("id")).replace("i", ""); }).get();*/
    var direct = $(xmlFile).find("property").has("subPropertyOf[id='" + id + "']").map(function () { return $.trim($(this).attr("id")); }).get();

    id += "i";
    /*var inv = $(xmlFile).find("property").has("subPropertyOf[id='" + id + "']").map(function () { return $.trim($(this).attr("id")).replace("i", ""); }).get();*/
    var inv = $(xmlFile).find("property").has("subPropertyOf[id='" + id + "']").map(function () { return $.trim($(this).attr("id")) + "i"; }).get();

    if (Array.isArray(inv) && inv.length) {

        inv.filter(x => !direct.includes(x)).forEach(x => direct.push(x));

    }

    return direct;
}




function getClassName(id) {
    var fns = $(xmlFile).find("class[id='" + id + "']").map(function () { return $.trim($(this).find("className").text()); }).get();

    if (Array.isArray(fns) && fns.length) {
        return fns[0];
    }
    return id;
}

function getClassNameWithLink(id) {
    var clsname = getClassName(id);
    if (clsname !== id) {
        return '<a href="#' + id + '">' + id + '</a> ' + clsname;
    }
    return id;
}

function getIdName(id) {
    if (id.includes("i")) {
        var retVal = id + " ";
        var invName = $(xmlFile).find("class, property").filter("[id='" + id.replace("i", "") + "']").map(function () { return $.trim($(this).find("inverseName").text()); }).get();
        var invNameFound = false;
        if (Array.isArray(invName) && invName.length) {
            invNameFound = true;
            retVal += invName[0];
        }

        var dName = $(xmlFile).find("class, property").filter("[id='" + id.replace("i", "") + "']").map(function () { return $.trim($(this).find("directName").text()); }).get();

        if (Array.isArray(dName) && dName.length) {
            if (invNameFound) {
                retVal += " ("
            }
            retVal += dName[0];
            if (invNameFound) {
                retVal += ")"
            }
        }
        return retVal;
    }
    else {
        var fns = $(xmlFile).find("class, property").filter("[id='" + id + "']").map(function () { return $.trim($(this).find("fullName").text()); }).get();

        if (Array.isArray(fns) && fns.length) {
            return fns[0];
        }
    }
    return id;
}

function getPropertyClassRepresentation(id, direct, allfields) {

    var prop = $(xmlFile).find("property[id='" + id + "']");
    var propDName = prop.map(function () { return $.trim($(this).find("directName").text()); }).get();
    var propIName = prop.map(function () { return $.trim($(this).find("inverseName").text()); }).get();
    var propDomain = prop.map(function () { return $.trim($(this).find("domain").attr("id")); }).get();
    var propRange = prop.map(function () { return $.trim($(this).find("range").attr("id")); }).get();

    var retHtml = '';

    if (!direct || allfields) {
        retHtml += '<a href="#' + propDomain + '" onclick="closeModals();">' + propDomain + '</a> ' + getClassName(propDomain) + '. ';
    }

    retHtml += '<a href="#' + id + '" onclick="closeModals();">' + id + '</a> ' + propDName;
    if (propIName != '') {
        retHtml += ' (' + propIName + ')';
    }

    if (direct || allfields) {
        retHtml += ': <a href="#' + propRange + '" onclick="closeModals();">' + propRange + '</a> ' + getClassName(propRange);
    }


    return retHtml;
}

function getDirectOrInversePropertiesText(id, direct) {

    //list of properties per level
    var level = 0;
    var allPropLevels = {};
    var allClassLevels = {};
    var allProps = [];

    if (direct) {
        allProps = getClassProperties(id);
    }
    else {
        allProps = getClassInverseProperties(id);
    }

    var allClasses = [];
    allClasses.push(id);//avoid cycles

    //add first level
    allPropLevels[level] = [];
    allProps.forEach(x => allPropLevels[level].push(x));
    allClassLevels[level] = [];
    allClassLevels[level].push(' ' + getClassNameWithLink(id));

    //check superClasses
    var superCls = getSuperClassesOf(id);

    while (Array.isArray(superCls) && superCls.length) {
        level += 1;
        allPropLevels[level] = [];
        allClassLevels[level] = [];
        var checkNew = [];

        for (let i = 0; i < superCls.length; i++) {
            if (!allClasses.includes(superCls[i])) {


                allClasses.push(superCls[i]);
                allClassLevels[level].push(' ' + getClassNameWithLink(superCls[i]));
                var newSupers = getSuperClassesOf(superCls[i]);
                var newProps = [];
                if (direct) {
                    newProps = getClassProperties(superCls[i]);
                }
                else {
                    newProps = getClassInverseProperties(superCls[i]);
                }

                for (let j = 0; j < newProps.length; j++) {
                    if (!allProps.includes(newProps[j])) {

                        allProps.push(newProps[j]);
                        if (!allPropLevels[level].includes(newProps[j])) {
                            allPropLevels[level].push(newProps[j]);
                        }
                    }
                }

                for (let j = 0; j < newSupers.length; j++) {
                    if (!allClasses.includes(newSupers[j])) {
                        checkNew.push(newSupers[j]);
                    }
                }
            }
        }
        superCls = [];
        checkNew.forEach(element => superCls.push(element));
    }

    var levels = Object.keys(allPropLevels);
    /*    levels.sort(function (first, second) {
            return second - first;
        });
    */
    var inheritedPropertiesText = '';
    var directPropertiesText = '';

    for (let j = 0; j < levels.length; j++) {

        var lineText = '';

        var props = allPropLevels[levels[j]];
        if (props.length == 0) {
            lineText += '<li>(None)</li>';
        }
        /* sort by property id
        props.sort(function (first, second) {
            return parseInt(first.replace("i", "").replace("P", "")) - parseInt(second.replace("i", "").replace("P", ""));
        });*/
        for (let k = 0; k < props.length; k++) {

            lineText += '<li>' + getPropertyClassRepresentation(props[k], direct, true) + '</li>';
        }
        if (levels[j] == 0) {
            if (directPropertiesText != '') {
                directPropertiesText += '<hr>'
            }
            directPropertiesText += "<ul>" + lineText + "</ul>";
        }
        else {
            if (inheritedPropertiesText != '') {
                inheritedPropertiesText += '<hr>'
            }
            var prefixLevelText = '';
            if (levels[j] == 1) {
                prefixLevelText = levels[j] + '<sup>st</sup> level of inheritance:'
            }
            else if (levels[j] == 2) {
                prefixLevelText = levels[j] + '<sup>nd</sup> level of inheritance:'
            }
            else if (levels[j] == 3) {
                prefixLevelText = levels[j] + '<sup>rd</sup> level of inheritance:'
            }
            else {
                prefixLevelText = levels[j] + '<sup>th</sup> level of inheritance:'
            }
            prefixLevelText += ' ' + allClassLevels[levels[j]];
            inheritedPropertiesText += prefixLevelText + "<br><ul>" + lineText + "</ul>";
        }
    }

    var retVal = '';

    retVal += '<button type="button" class="collapsible" title="Click in order to expand/collapse list" onClick="toggleSibling(this);">Direct</button>';
    retVal += '<div class="collapsible_content">';
    if (directPropertiesText == '') {
        retVal += '(None)';
    }
    else {
        retVal += directPropertiesText;
    }
    retVal += '</div>';

    retVal += '<button type="button" class="collapsible" title="Click in order to expand/collapse list" onClick="toggleSibling(this);">Inherited</button>';
    retVal += '<div class="collapsible_content">';
    if (inheritedPropertiesText == '') {
        retVal += '(None)';
    }
    else {
        retVal += inheritedPropertiesText;
    }
    retVal += '</div>';


    return retVal;
}

function toggleSibling(whichElement) {
    whichElement.classList.toggle("active");
    var content = whichElement.nextElementSibling;
    if (content.style.display === "none") {
        content.style.display = "block";
    } else {
        content.style.display = "none";
    }
}

function showInheritedPropertiesOfClass(id) {
    $(".modal").show();
    var curVersion = document.getElementById('currentVersion').innerHTML;
    var directPropertiesText = getDirectOrInversePropertiesText(id, true);

    var inversePropertiesText = getDirectOrInversePropertiesText(id, false);

    var closeOption = '<a href="javascript:void(0)" onclick="closeModals();" style="float:right;">Close [x]</a>';
    var directPropsPrefix = '<span>All <strong>outgoing</strong> properties of: <strong>' + getIdName(id) + "</strong></span> <span class='versionDisplayPopUpInfo'> - version " + curVersion + "</span><hr>";

    var inversePropsPrefix = '<br/><br/><span>All <strong>incoming</strong> properties of: <strong>' + getIdName(id) + "</strong></span> <span class='versionDisplayPopUpInfo'> - version " + curVersion + "</span><hr>";

    $("#propertiesContainer").html(closeOption + directPropsPrefix + directPropertiesText + inversePropsPrefix + inversePropertiesText);
    $("#propertiesContainer").show();
}



function baseGraphClass(id) {

    var addedNew = 0;
    var allnodes = {};
    var rels = [];

    allnodes[id] = getIdName(id);

    var superCls = getSuperClassesOf(id);
    if (Array.isArray(superCls) && superCls.length) {

        superCls.forEach(x => rels.push({ 'data': { 'id': x + id, 'source': x, 'target': id } }));
        superCls.forEach(element => allnodes[element] = getIdName(element));
    }

    var subs = getSubClassesOf(id);
    if (Array.isArray(subs) && subs.length) {
        subs.forEach(x => rels.push({ 'data': { 'id': id + x, 'source': id, 'target': x } }));
        subs.forEach(element => allnodes[element] = getIdName(element));
        addedNew = subs.length;
    }


    while (addedNew) {
        addedNew = false;
        var checkNew = [];
        for (let i = 0; i < subs.length; i++) {
            var newSubs = getSubClassesOf(subs[i]);
            newSubs.forEach(x => rels.push({ 'data': { 'id': subs[i] + x, 'source': subs[i], 'target': x } }));
            for (let j = 0; j < newSubs.length; j++) {
                if (!(newSubs[j] in allnodes)) {
                    allnodes[newSubs[j]] = getIdName(newSubs[j]);
                    checkNew.push(newSubs[j]);
                    addedNew = true;
                }
            };
        }
        subs = [];
        checkNew.forEach(element => subs.push(element));
    }

    var cy = showGraph(allnodes, rels);

    cy.nodes('[id = "' + id + '"]').style('background-color', 'rgb(255,159,184)');
    cy.on('tap', 'node', function (evt) {
        var node = evt.target;
        searchXMLClass(node.id());
    });
    $(this).clearQueue();
}

function searchXMLClass(id) {
    var curVersion = document.getElementById('currentVersion').innerHTML;
    $(".modal").show();
    $("#graphcontainer").hide();
    $("#graphlegend").hide();
    $("#graph").hide();

    $("#goToCurrent").attr("href", "#" + id);

    $("#currentGraphNode").text("'" + getIdName(id) + "'");
    $(this).delay(50).queue(function () {
        baseGraphClass(id);
    });
}



function baseGraphProperty(idWithInverse) {
    var id = idWithInverse.replace("i", "");

    var addedNew = 0;
    var allnodes = {};
    var rels = [];

    allnodes[id] = getIdName(id);

    var superProps = getSuperPropertiesOf(id);
    if (Array.isArray(superProps) && superProps.length) {

        superProps.forEach(x => rels.push({ 'data': { 'id': x + id, 'source': x, 'target': id } }));
        superProps.forEach(element => allnodes[element] = getIdName(element));
    }

    var subs = getSubPropertiesOf(id);
    if (Array.isArray(subs) && subs.length) {
        subs.forEach(x => rels.push({ 'data': { 'id': id + x, 'source': id, 'target': x } }));
        subs.forEach(element => allnodes[element] = getIdName(element));
        addedNew = subs.length;
    }

    while (addedNew) {
        addedNew = false;
        var checkNew = [];
        for (let i = 0; i < subs.length; i++) {
            var newSubs = getSubPropertiesOf(subs[i]);
            newSubs.forEach(x => rels.push({ 'data': { 'id': subs[i] + x, 'source': subs[i], 'target': x } }));
            for (let j = 0; j < newSubs.length; j++) {
                if (!(newSubs[j] in allnodes)) {
                    allnodes[newSubs[j]] = getIdName(newSubs[j]);
                    checkNew.push(newSubs[j]);
                    addedNew = true;
                }
            };
        }
        //prepare next loop input step
        subs = [];
        checkNew.forEach(element => subs.push(element));
    }

    var cy = showGraph(allnodes, rels);


    cy.nodes('[id = "' + id + '"]').style('background-color', 'rgb(255,159,184)');

    cy.on('tap', 'node', function (evt) {
        var node = evt.target;
        searchXMLProperty(node.id());
    });

    $(this).clearQueue();
}

function searchXMLProperty(idWithInverse) {
    var curVersion = document.getElementById('currentVersion').innerHTML;
    $(".modal").show();

    $("#graphcontainer").hide();
    $("#graphlegend").hide();
    $("#graph").hide();

    $("#goToCurrent").attr("href", "#" + idWithInverse.replace("i", ""));
    $("#currentGraphNode").text("'" + getIdName(idWithInverse.replace("i", "")) + "'");
    $(this).delay(50).queue(function () {
        baseGraphProperty(idWithInverse);
    });
}


function showGraph(allnodes, rels) {

    var cels = [];
    $("#graphcontainer").show();
    $("#graphlegend").show();
    $("#graph").show();


    for (const [key, value] of Object.entries(allnodes)) {
        cels.push({ 'data': { 'id': key, 'name': value } });
    }

    rels.forEach(x => cels.push(x));

    var cy = cytoscape({


        container: document.getElementById('graph'), // container to render in

        elements: cels,

        style: [ // the stylesheet for the graph  'type': 'round-rectangle',
            {
                selector: 'node',

                style: {


                    'background-color': 'rgb(188,210,238)',
                    'label': 'data(name)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'width': 5,
                    'line-color': 'rgb(144,238,144)',
                    'source-arrow-color': 'rgb(144,238,144)',
                    'source-arrow-shape': 'triangle',
                    'curve-style': 'bezier'
                }
            }
        ],


        layout: {
            /*depthfirst*/
            /*breadthfirst*/
            name: 'breadthfirst',
            directed: true,
            padding: 10

        }

    });

    cy.on('cxttap', "node", function (evt) {
        var node = evt.target;
        evt.stopPropagation();

        /*cxttap cxttapend closeModals();*/
        /*$('html, body').animate({ scrollTop: $("#"+node.id()).offset().top }, 'slow');*/
        $(this).delay(200).queue(function () {
            closeModals();
            window.location = getLocationWithNewHash(node.id());
        });
        return false;

    });


    return cy;
}

function getLocationWithNewHash(newhash) {
    var loc = window.location.href;
    if (loc.includes('#')) {
        loc = loc.substr(0, loc.indexOf('#'));
    }

    return loc + "#" + newhash;

}

function showHideTranslations(selectedTr) {

    if (selectedTr === 'en') {
        $(".col3").hide();
        $(".TranslationStats").hide();
    }
    else {
        var which_lang = selectedTr.replace("en | ", "");

        $("div[class^='translation_to_']").hide();
        $("div[class^='translation_to_" + which_lang + "_tr_text']").show();
        $(".initTableTranslationLanguage").text(langCodes[which_lang]);
        $(".col3").show();


        var exactUniqueMatches = $("tr.uniqueCount").has("span.matchingInfo:visible:contains('Exact Match')");

        var exactUniqueMatchesDistinctList = exactUniqueMatches
            .find("td.col2>p")
            .map(function () { return $.trim($(this).text()); })
            .get()
            .filter((x, i, a) => x != '' && a.indexOf(x) == i)
            .sort();

        /*$("#exactMatchesNum").text($("tr:not('.uniqueCount') span.matchingInfo:visible:contains('Exact Match')").length + (exactUniqueMatchesDistinctList.length > 0 ? (' (+ ' + exactUniqueMatchesDistinctList.length + ' / ' + exactUniqueMatches.length + ')') : ' (-)'));*/
        $("#exactMatchesNum").text($("span.matchingInfo:visible:contains('Exact Match')").length);

        var closeUniqueMatches = $("tr.uniqueCount")
            .has("span.matchingInfo:visible:contains('Close Match')");

        var closeUniqueMatchesDistinct = closeUniqueMatches
            .find("td.col2>p")
            .map(function () { return $.trim($(this).text()); })
            .get()
            .filter((x, i, a) => x != '' && a.indexOf(x) == i)
            .sort();

        /*$("#closeMatchesNum").text($("tr:not('.uniqueCount') span.matchingInfo:visible:contains('Close Match')").length + (closeUniqueMatchesDistinct.length > 0 ? (' (+ ' + closeUniqueMatchesDistinct.length + ' / ' + closeUniqueMatches.length + ')') : ' (-)'));*/
        $("#closeMatchesNum").text($("span.matchingInfo:visible:contains('Close Match')").length);

        var changedUniqueMatches = $("tr.uniqueCount")
            .has("span.matchingInfo:visible:contains('English text changed')");

        var changedUniqueMatchesDistinct = changedUniqueMatches
            .find("td.col2>p")
            .map(function () { return $.trim($(this).text()); })
            .get()
            .filter((x, i, a) => x != '' && a.indexOf(x) == i)
            .sort();

        /*$("#changedNum").text($("tr:not('.uniqueCount') span.matchingInfo:visible:contains('English text changed')").length + (changedUniqueMatchesDistinct.length > 0 ? (' (+ ' + changedUniqueMatchesDistinct.length + ' / ' + changedUniqueMatches.length + ')') : ' (-)'));*/
        $("#changedNum").text($("span.matchingInfo:visible:contains('English text changed')").length);


        var missingUniqueMatches = $("tr.uniqueCount")
            .has("div.missingTranslation:visible:contains('Missing translation')");

        var missingUniqueMatchesDistincList = missingUniqueMatches
            .find("td.col2>p")
            .map(function () { return $.trim($(this).text()); })
            .get()
            .filter((x, i, a) => x != '' && a.indexOf(x) == i)
            .sort();

        /*$("#missingNum").text($("tr:not('.uniqueCount') div.missingTranslation:visible:contains('Missing translation')").length + (missingUniqueMatchesDistincList.length > 0 ? (' (+ ' + missingUniqueMatchesDistincList.length + ' / ' + missingUniqueMatches.length + ')') : ' (-)'));*/
        $("#missingNum").text($("div.missingTranslation:visible:contains('Missing translation')").length);

        /* not so interesting $(".TranslationStats").show();*/
    }

    closeModals();
    $("#translationsDiv button").clearQueue();
}

function copyURIToClipboard(prefixText, uriToCopy, targetId){

    el = document.createElement('textarea');
    el.value = uriToCopy;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
	
    $("#refURITooltipTxtFor" + escapeHashCharsForJQuerySelector(targetId)).html(prefixText+': <strong>' + uriToCopy + '</strong> <br>copied to clipboard');
    $("#refURITooltipLinkFor" + escapeHashCharsForJQuerySelector(targetId)).show().delay(2000).fadeOut();
}

function copyToClipboard(targetId) {
    el = document.createElement('textarea');
	let targetName = "";
	let linkBase = $(xmlFile).find("root").attr("namespace");
	let modelVersion = $(xmlFile).find("root").attr("version");
	
	if (window.location.href.indexOf("echoes-eccch.github.io")  !== -1){
		let path = window.location.pathname;

		 // Remove trailing slash if present
		if (path.endsWith('/')) {
		  path = path.slice(0, -1);
		}
		linkBase = window.location.origin + path + '#';	
		targetName = targetId;
	}
	else if(window.location.href.indexOf("/echoes") !== -1  && window.location.href.indexOf("/html/") !== -1){
		let path = window.location.pathname;

		  // Remove trailing slash if present
		  if (path.endsWith('/')) {
			path = path.slice(0, -1);
		  }
		linkBase = window.location.origin + path.substring(0, path.lastIndexOf('/')) + '#';		
	}
	
	if (!targetName){
		var fns = $(xmlFile).find("class, property").filter("[id='" + targetId + "']").map(function () { return $.trim($(this).find("fullName").text()); }).get();
		if (Array.isArray(fns) && fns.length) {
			targetName = fns[0];
		}
		if( targetName.indexOf('(')>0){
		  targetName = targetName.slice(0, targetName.indexOf('(')).trim();
		}
		if (targetName !== '')
		{
			targetName = targetName.trim().replaceAll(' ', '_');
		}
	}
    let linkVal = linkBase + targetName; //getRefLink(false, targetId);/*getLinkBase(false) + '.html#' + targetId;*/
    el.value = linkVal;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    $("#refIdTooltipTxtFor" + escapeHashCharsForJQuerySelector(targetId)).html('Link: <strong>' + linkVal + '</strong> <br>copied to clipboard');
    $("#refIdTooltipLinkFor" + escapeHashCharsForJQuerySelector(targetId)).show().delay(2000).fadeOut();




    /*
    var tt = $("#"+refLink);
        tt.show().delay(2000).hide();
      
      */

    //alert ('Copied: ' + txtToCopy +" to clipboard");

}

function escapeHashCharsForJQuerySelector(rawHashString) {

    let idSelector = rawHashString.replace('.', '\\_');
    idSelector = idSelector.replace('.', '\\_');
    idSelector = idSelector.replace('.', '\\_');
    idSelector = idSelector.replace('.', '\\_');
    idSelector = idSelector.replace('.', '\\_');
    idSelector = idSelector.replace('_', '.');
    idSelector = idSelector.replace('_', '.');
    idSelector = idSelector.replace('_', '.');
    idSelector = idSelector.replace('_', '.');
    return idSelector;

}

function closeModals() {
    $("#graphlegend").hide();
    $("#graph").hide();
    $("#graphcontainer").hide();
    $("#propertiesContainer").hide();
    $(".modal").hide();
}

function getRefLink(ignoreIfCurrentPageIsTranslationsLink, targetId) {
    var linkBase = '';
    var rdfName = getIdName(targetId);
    if (targetId.startsWith('P') && rdfName.includes("(")) {
        rdfName = rdfName.split("(")[0].trim();
    }
    rdfName = rdfName.replaceAll(' ', '_');
    curVersion = document.getElementById('currentVersion').innerHTML;
    if (window.location.href.includes('.xml')) {
        linkBase = 'http://cidoc-crm.org/cidoc-crm/' + curVersion + '/' + rdfName;
    }
    else if (window.location.href.includes('.html') && (!ignoreIfCurrentPageIsTranslationsLink || !window.location.href.includes('with_translations.html'))) {

        if (window.location.href.includes('with_translations.html')) {
            linkBase = window.location.href.substring(0, window.location.href.lastIndexOf('.html')) + '.html#' + targetId;
        }
        else if (targetId.startsWith('tableOf')) {
            linkBase = window.location.href.substring(0, window.location.href.lastIndexOf('.html')) + '.html#' + targetId;
        }
        else {
            linkBase = 'http://cidoc-crm.org/cidoc-crm/' + curVersion + '/' + rdfName;
        }
    }
    //if (linkBase.startsWith("http://cidoc-crm.org/")){
    //    linkBase = linkBase.replace("http://cidoc-crm.org/", "https://cidoc-crm.org/");
    //}
    return linkBase;
}

function getLinkBase(ignoreIfCurrentPageIsTranslationsLink) {
    var linkBase = '';
    if (window.location.href.includes('.xml')) {
        linkBase = window.location.href.substring(0, window.location.href.lastIndexOf('.xml'));
    }
    else if (window.location.href.includes('.html') && (!ignoreIfCurrentPageIsTranslationsLink || !window.location.href.includes('with_translations.html'))) {

        linkBase = window.location.href.substring(0, window.location.href.lastIndexOf('.html'));
    }
    return linkBase;
}

function hideNavigationControl() {
    $("#translationsDiv").hide();
}

$(document).ready(function () {


    var hash = window.location.hash;
    var curVersion = document.getElementById('currentVersion').innerHTML;

    var linkBase = getLinkBase(true);

    if (linkBase != '') {

        $(".langLink").each(function () {
            var currentLik = $(this).attr('href');

            $(this).attr('href', linkBase + currentLik);

        });

        $(".langLink").show();

    }



    $("#translationsDiv button").click(function () {
        $("#translationsDiv button").removeClass("currentLang");
        $(".modal").show();
        $(this).delay(50).queue(function () {
            showHideTranslations($(this).text());
        });
        $(this).addClass("currentLang");
    });

    $(".expandIcon").click(function() {
        $("#translationsDiv").toggleClass("expanded collapsed");
    });

    if (window.innerWidth<600) {
        $("#translationsDiv").toggleClass("expanded collapsed");
    }


    $("#selectEntity").select2({
        placeholder: 'Navigate to a section'
    });

    $('#selectEntity').on('select2:select', function (e) {

        var data = e.params.data;

        if ('id' in data) {
            let idSelector = escapeHashCharsForJQuerySelector(data['id']);
            if ($('#' + idSelector).offset() !== undefined) {
                if (window.innerWidth<600) {
                    $("#translationsDiv").removeClass("expanded");
                    $("#translationsDiv").addClass("collapsed");
                }
                $('html, body').animate({ scrollTop: $('#' + idSelector).offset().top }, 'slow');
            }
            else {
                alert('Did not find ' + hash + ' in this version');
            }
        }

    });

    $(document).on('select2:open', () => {

        if (window.innerWidth<600) {
            $("#translationsDiv").removeClass("collapsed");
            $("#translationsDiv").addClass("expanded");
        }
        document.querySelector('.select2-search__field').focus();
    });

    /*var xmlUrl = window.location.href.replace(".html", ".xml").replace(window.location.hash, "");
    var xmlUrl = "https://cidoc-crm.org/versions/cidoc_crm_v" + $("#currentVersion").text() + ".xml";*/
    var xmlUrl = window.location.href;
	if( xmlUrl.indexOf('.html')>0){
	  xmlUrl = xmlUrl.slice(0, xmlUrl.indexOf('.html')).trim()+'.xml?v=20240213_122815';
	}

    $.ajax({
        type: "GET",
        url: xmlUrl,
        dataType: "xml",
        error: function (e) {
            /*alert("An error occurred while processing XML file");*/
            console.log("XML reading Failed: ", e);

        },
        success: function (xml) {
            xmlFile = xml;
        },
        complete: function (data) {
            closeModals();
        }


    });



    $(".modal").click(function (e) {
        if (e.target.id == "modalbackground") {
            closeModals();
        }
        if (e.target.id == "graphlegend") {
            closeModals();
        }
    });


    if (hash !== '') {
        if ($(escapeHashCharsForJQuerySelector(hash)).offset() !== undefined) {
            $('html, body').delay(200).animate({ scrollTop: $(escapeHashCharsForJQuerySelector(hash)).offset().top }, '{duration:300}');
        }
        else {
            alert('Not found ' + hash + ' in this version');
        }
    }
});


$(document).keyup(function (e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        closeModals();
    }
});