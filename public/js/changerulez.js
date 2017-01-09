var rules;

$(document).ready(function() {
    $.get("http://webkingz.herokuapp.com/rules.json", function(data){
        rules = data;
        for(var i = 0; i < rules.length; i++) {
            var content = "<button onclick='expandAccordion(\"" + i + "\")' class='w3-btn-block w3-left-align w3-red'>"
                        + rules[i].rule_name
                        + "</button>"
                        + "<div id='" + i + "' class='w3-accordion-content w3-container'>";
            for (var j = 2; j < 15; j++) {
                content += "<p>" + rules[i]["rule_" + j] + "</p>";
            }
            content += "<button class='w3-btn w3-red w3-margin' onclick='selectRuleSet(" + i + ")'>Select This Rule Zet!</button>" 
                    +  "</div>"
            $('#accordion').append(content);
        }
    });

});

function expandAccordion(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    } else { 
        x.className = x.className.replace(" w3-show", "");
    }
}

function selectRuleSet(i) {
        var ruleSet = [];
        for (var j = 2; j < 15; j++) {
                ruleSet.push(rules[i]["rule_" + j]);
        }
        console.log(ruleSet);
        $.ajax({
          type: "POST",
          url: "https://webkingz.herokuapp.com/selectrule.json",
          contentType: 'application/json',
          data: JSON.stringify(ruleSet)
        });
}