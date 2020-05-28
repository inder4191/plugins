/**
 * This was the initial logic to calculate the MBR score.
 * But on 23 Jan 2020, this logic was revised to simple
 * weighted average calculation irrespective of the status.
 * As per mail communication received from Suresh's team.
 *  
 * This file is retained but is not being used, hence not
 * included in "manifest.json", instead "content_v2.js" is 
 * now used for the calculation of MBR Annual Score and "rating.js"
 * is used for Individual Goal Rating.
 */


var WEIGHTAGE_KEY = "Weightage";
var RATING_KEY = "Rating";
var SCORE_KEY = "Score";
var STATUS_KEY = "Status";

var STATUS_ACTIVE = "Active";
var STATUS_DROP = "Drop (Specify reason in 'Achievement so far' comment box)";
var STATUS_DROP_RTNG = "Drop but considered for rating";

var MBR_SCORE_ELEM = $("div h2[title='MBR Annual Score']").parent().siblings("div").find("div[class='HRContentCell'] input");
var CURRENT_STEP = "sfcurrentstep"; 

function getData() { 
    var dataArray = [];  
    var goals = $("div[class='tabDataBorder']");
    $.each(goals, function (index, goal) {
        var goalAttrList = $(goal).find("table[class='goalDetailsTable']");
        var data = { STATUS_KEY: '', WEIGHTAGE_KEY: 0.0, RATING_KEY: 0.0, SCORE_KEY: 0.0 };
        $.each(goalAttrList, function(index, goalDtls) {
            var body = $(goalDtls).find("tbody");
            $.each(body, function(index, bodyDtls) {
                var rows = $(bodyDtls).find("tr");
                $.each(rows, function(index, row) {
                    var label = $(row).find("td[class='lab']").html();
                    var value = $(row).find("td[class='val']").html();
                    switch(label) {
                        case STATUS_KEY:
                            data.STATUS_KEY = value;
                            break;
                        case WEIGHTAGE_KEY:
                            data.WEIGHTAGE_KEY = parseFloat(value.replace("%", ""));
                            break;
                        case RATING_KEY:
                            data.RATING_KEY = parseFloat(value);
                            break;
                        case SCORE_KEY:
                            data.SCORE_KEY = parseFloat(value);
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
    var adjustment = 0;
    var mbr_score = 0;
    var total_active_wght = 0;

    dataArray.forEach(element => {
        console.log(element);
        /* Calculation logic to be written */
        adjustment += (STATUS_DROP_RTNG === element.STATUS_KEY ? element.WEIGHTAGE_KEY : 0);
        mbr_score += (STATUS_ACTIVE === element.STATUS_KEY) ? (element.RATING_KEY * element.WEIGHTAGE_KEY)/100 : 0;
        total_active_wght += (STATUS_ACTIVE === element.STATUS_KEY) ? element.WEIGHTAGE_KEY : 0;
    });
    console.log("adjustment : ", adjustment);
    console.log("mbr_score : ", mbr_score);
    console.log("total_active_wght : ", total_active_wght);
    var weighted_avg_score = (0.0 === total_active_wght) ? 0 : mbr_score/total_active_wght ;
    console.log("weighted_avg_score : ", weighted_avg_score);
    var annual_mbr_score = weighted_avg_score * (total_active_wght + adjustment);
    console.log("annual_mbr_score : ", annual_mbr_score);
    
    /* MBR_SCORE_ELEM.prop("readonly", true); */
    MBR_SCORE_ELEM.val(annual_mbr_score.toFixed(2));
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