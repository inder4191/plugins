/**
 * This file is used to calculate the 
 * MBR Annual Score based on simple weighted
 * average calculation formula(refer README.md)
 */

var WEIGHTAGE_KEY = "Weightage";
var RATING_KEY = "Rating";

var MBR_SCORE_ELEM = $("div h2[title='MBR Annual Score']").parent().siblings("div").find("div[class='HRContentCell'] input");
var CURRENT_STEP = "sfcurrentstep"; 

function getData() { 
    var dataArray = [];  
    var goals = $("div[class='tabDataBorder']");
    $.each(goals, function (index, goal) {
        var goalAttrList = $(goal).find("table[class='goalDetailsTable']");
        var data = {WEIGHTAGE_KEY: 0.0, RATING_KEY: 0.0};
        $.each(goalAttrList, function(index, goalDtls) {
            var body = $(goalDtls).find("tbody");
            $.each(body, function(index, bodyDtls) {
                var rows = $(bodyDtls).find("tr");
                $.each(rows, function(index, row) {
                    var label = $(row).find("td[class='lab']").html();
                    var value = $(row).find("td[class='val']").html();
                    switch(label) {
                        case WEIGHTAGE_KEY:
                            data.WEIGHTAGE_KEY = parseFloat(value.replace("%", ""));
                            break;
                        case RATING_KEY:
                            data.RATING_KEY = parseFloat(value);
                            break;
                    } 
                });
            });  
        });
        /* console.log("Data : "+JSON.stringify(data)); */
        dataArray.push(data);   
    });
    return dataArray;    
}

function calculateScore(dataArray){
    var mbr_score = 0;
    /* console.log("Data : "+JSON.stringify(dataArray)); */
    dataArray.forEach(element => {
        /* console.log(element); */
        /* Calculation logic to be written */
        mbr_score += (element.RATING_KEY * element.WEIGHTAGE_KEY)/100 ;
        
    });
    MBR_SCORE_ELEM.prop("readonly", true);
    MBR_SCORE_ELEM.val(mbr_score.toFixed(2));
};

$(document).ready(function(){
    console.log("Already Saved MBR Score :: ",MBR_SCORE_ELEM.val());
    var routeMapDiv = $("div#routeMap");
    var mbrAnnualReviewStep =$(routeMapDiv).find("div[title='MBR Annual Review']");
    var mbrAnnualReviewClass = $(mbrAnnualReviewStep).attr("class");
    /* console.log("MBR Annual Review step class...", mbrAnnualReviewClass.toLowerCase()); */
    if(mbrAnnualReviewClass.toLowerCase().indexOf(CURRENT_STEP) != -1) {
        console.log("Form in MBR Annual Review step...");
        calculateScore(getData());
    } else {
        console.log("Form NOT in MBR Annual Review step...");
    }    
});