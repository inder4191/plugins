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

function calcltePostveRatngWithTarget(data) {
	var rating;
	if(data.GOAL_ACHIEVEMENT < data.GOAL_BUDGET) {
		rating = 0;
	} else if(data.GOAL_ACHIEVEMENT === data.GOAL_BUDGET) {
		rating = 1;
	} else if(data.GOAL_ACHIEVEMENT === data.GOAL_OUTSTANDING) {
		rating = 3;
	} else if(data.GOAL_ACHIEVEMENT >= data.GOAL_TARGET_FOR_SCORE) {
		rating = 4;
	} else if((data.GOAL_ACHIEVEMENT>data.GOAL_BUDGET) 
				&& (data.GOAL_ACHIEVEMENT<data.GOAL_OUTSTANDING)) {
		rating =  1 + (2 * ((data.GOAL_ACHIEVEMENT-data.GOAL_BUDGET)/(data.GOAL_OUTSTANDING-data.GOAL_BUDGET)));
	} else if((data.GOAL_ACHIEVEMENT>data.GOAL_OUTSTANDING) 
		&& (data.GOAL_ACHIEVEMENT<data.GOAL_TARGET_FOR_SCORE)) {
		rating =  3 + ((data.GOAL_ACHIEVEMENT-data.GOAL_OUTSTANDING)/(data.GOAL_TARGET_FOR_SCORE-data.GOAL_OUTSTANDING));
	} 
    /*console.log("Calculated Rating ::", rating.toFixed(2));*/
	return rating.toFixed(2);
}

function calclteNegtveRatngWithTarget(data) {
	var rating;
	if(data.GOAL_ACHIEVEMENT > data.GOAL_BUDGET) {
		rating = 0;
	} else if(data.GOAL_ACHIEVEMENT === data.GOAL_BUDGET) {
		rating = 1;
	} else if(data.GOAL_ACHIEVEMENT === data.GOAL_OUTSTANDING) {
		rating = 3;
	} else if(data.GOAL_ACHIEVEMENT <= data.GOAL_TARGET_FOR_SCORE) {
		rating = 4;
	} else if((data.GOAL_ACHIEVEMENT<data.GOAL_BUDGET) 
				&& (data.GOAL_ACHIEVEMENT>data.GOAL_OUTSTANDING)) {
		rating =  1 + (2 * ((data.GOAL_ACHIEVEMENT-data.GOAL_BUDGET)/(data.GOAL_OUTSTANDING-data.GOAL_BUDGET)));
	} else if((data.GOAL_ACHIEVEMENT<data.GOAL_OUTSTANDING) 
		&& (data.GOAL_ACHIEVEMENT>data.GOAL_TARGET_FOR_SCORE)) {
		rating =  3 + ((data.GOAL_ACHIEVEMENT-data.GOAL_OUTSTANDING)/(data.GOAL_TARGET_FOR_SCORE-data.GOAL_OUTSTANDING));
	} 
    /*console.log("Calculated Rating ::", rating.toFixed(2));*/
	return rating.toFixed(2);
}
function calcltePostveRatngWithoutTarget(data) {
	var rating;
	if(data.GOAL_ACHIEVEMENT < data.GOAL_BUDGET) {
		rating = 0;
	} else if(data.GOAL_ACHIEVEMENT === data.GOAL_BUDGET) {
		rating = 1;
	} else if(data.GOAL_ACHIEVEMENT === data.GOAL_OUTSTANDING) {
		rating = 3;
	} else if(data.GOAL_ACHIEVEMENT > data.GOAL_OUTSTANDING) {
		rating = 4;
	} else if((data.GOAL_ACHIEVEMENT>data.GOAL_BUDGET) 
				&& (data.GOAL_ACHIEVEMENT<data.GOAL_OUTSTANDING)) {
		rating =  1 + (2 * ((data.GOAL_ACHIEVEMENT-data.GOAL_BUDGET)/(data.GOAL_OUTSTANDING-data.GOAL_BUDGET)));
	} 
    /*console.log("Calculated Rating ::", rating.toFixed(2));*/
	return rating.toFixed(2);
}
function calclteNegtveRatngWithoutTarget(data) {
	var rating;
	if(data.GOAL_ACHIEVEMENT > data.GOAL_BUDGET) {
		rating = 0;
	} else if(data.GOAL_ACHIEVEMENT === data.GOAL_BUDGET) {
		rating = 1;
	} else if(data.GOAL_ACHIEVEMENT === data.GOAL_OUTSTANDING) {
		rating = 3;
	} else if(data.GOAL_ACHIEVEMENT < data.GOAL_OUTSTANDING) {
		rating = 4;
	} else if((data.GOAL_ACHIEVEMENT>data.GOAL_OUTSTANDING) 
				&& (data.GOAL_ACHIEVEMENT<data.GOAL_BUDGET)) {
		rating =  1 + (2 * ((data.GOAL_ACHIEVEMENT-data.GOAL_BUDGET)/(data.GOAL_OUTSTANDING-data.GOAL_BUDGET)));
	} 
    /*console.log("Calculated Rating ::", rating.toFixed(2));*/
	return rating.toFixed(2);
}

function calculateRating(data){
	if(null==data.GOAL_ACHIEVEMENT || isNaN(data.GOAL_ACHIEVEMENT)){
		return "";
	}

	/*console.log("User input :", data.GOAL_ACHIEVEMENT);*/

	/* check if GOAL_TARGET_FOR_SCORE exist */
	var functionSelector = data.GOAL_OUTSTANDING - data.GOAL_BUDGET;
	if(data.hasOwnProperty('GOAL_TARGET_FOR_SCORE') && null!=data.GOAL_TARGET_FOR_SCORE
		 											&& !isNaN(data.GOAL_TARGET_FOR_SCORE)) {
		console.log(GOAL_TARGET_FOR_SCORE + " : ", data.GOAL_TARGET_FOR_SCORE);
		if(functionSelector > 0) {
			/* Target exists and its increasing */
			return calcltePostveRatngWithTarget(data);
		} else if(functionSelector < 0)  {
			/* Target exists and its decreasing */
			return calclteNegtveRatngWithTarget(data);
		}
	} else {
		console.log(GOAL_TARGET_FOR_SCORE + " does not exist or null or NaN : ", data);
		if(functionSelector > 0) {
			/* Target does not exist and its increasing */
			return calcltePostveRatngWithoutTarget(data);
		} else if(functionSelector < 0)  {
			/* Target does not exist and its decreasing */
			return calclteNegtveRatngWithoutTarget(data);
		}
	}
};