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
        
        dataArray.push(data);   
    });
    return dataArray;    
}

function actual_score_Calculation(dataArray) {
    var mbr_score = 0;
    dataArray.forEach(element => {
    mbr_score += ((element.RATING_KEY || element.GOAL_RATING_KEY || 0) * (element.WEIGHTAGE_KEY || element.GOAL_WEIGHTAGE_KEY || 0))/100 ;
     });
    return mbr_score.toFixed(2);
}

function calculateScore(dataArray){
    var mbr_score = actual_score_Calculation(dataArray)
    MBR_SCORE_ELEM.prop("readonly", true);
    MBR_SCORE_ELEM.val(mbr_score);
};

existingRating = [];
actual_rating = [];
Data_Arr = [];
mbr_status =[];
function placeRating() {
    var autoManualDeciderString = []
    for(var i=0;i<actual_rating.length;i++) {
        if(Number(actual_rating[i]) === existingRating[i]) {
            autoManualDeciderString.push("AUTOMATIC")
        } else {
            autoManualDeciderString.push("MANUAL")
        }
        
    }
    var valueToPlace = autoManualDeciderString.toString();
    $('input[type=text]#wf_sect_10_e_ele_30').val(actual_rating.toString()).attr("readonly", true);
    $('input[type=text]#wf_sect_10_e_ele_41').val(valueToPlace).attr("readonly", true);
    
    var actual_mbr_annual_score = actual_score_Calculation(Data_Arr);
    $('input[type=text]#wf_sect_10_e_2').val(actual_mbr_annual_score).attr("readonly", true);
    

    var annual_score_ref = $("div h2[title='MBR Annual Score']").parent().siblings("div").find("div[class='HRContentCell']")
    if (actual_mbr_annual_score === $(annual_score_ref).html()){
        mbr_status.push("AUTOMATIC");
    }
    else{
        mbr_status.push("MANUAL");
    }
    $('input[type=text]#wf_sect_10_e_ele_23').val(mbr_status.toString()).attr("readonly", true)
}



function calculatePositiveRatngWithTarget(data) {
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
    return rating.toFixed(2);
}

function calculateNegativeRatngWithTarget(data) {
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
    return rating.toFixed(2);
}
function calculatePositveRatingWithoutTarget(data) {
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
   return rating.toFixed(2);
}
function calculateNegativeRatingWithoutTarget(data) {
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
    return rating.toFixed(2);
}

function calculate_Rating(data){
	if(!data.GOAL_ACHIEVEMENT || isNaN(data.GOAL_ACHIEVEMENT)){
		return 0;
	}
    var functionSelector = data.GOAL_OUTSTANDING - data.GOAL_BUDGET;
	if(data.hasOwnProperty('GOAL_TARGET_FOR_SCORE') && null!=data.GOAL_TARGET_FOR_SCORE
		 											&& !isNaN(data.GOAL_TARGET_FOR_SCORE)) {
		console.log(GOAL_TARGET_FOR_SCORE + " : ", data.GOAL_TARGET_FOR_SCORE);
		if(functionSelector > 0) {
			/* Target exists and its increasing */
			return calculatePositiveRatngWithTarget(data);
		} else if(functionSelector < 0)  {
			/* Target exists and its decreasing */
			return calculateNegativeRatngWithTarget(data);
		}
	} else {
		console.log(GOAL_TARGET_FOR_SCORE + " does not exist or null or NaN : ", data);
		if(functionSelector > 0) {
			/* Target does not exist and its increasing */
			return calculatePositveRatingWithoutTarget(data);
		} else if(functionSelector < 0)  {
			/* Target does not exist and its decreasing */
			return calculateNegativeRatingWithoutTarget(data);
		}
	}
};
$(document).ready(function(){
    console.log("Already Saved MBR Score :: ",MBR_SCORE_ELEM.val());
    var routeMapDiv = $("div#routeMap");
    //var mbrAnnualReviewStep =$(routeMapDiv).find("div[title='MBR Annual Review']");
    //var mbrAnnualReviewClass = $(mbrAnnualReviewStep).attr("class");
    //if(mbrAnnualReviewClass.toLowerCase().indexOf(CURRENT_STEP) != -1) {
        //console.log("Form in MBR Annual Review step...");
        calculateScore(getData());
    // } else {
    //     console.log("Form NOT in MBR Annual Review step...");
    // }  
    
    Data_Arr = [];
    var goals=$('.tabbox')
    for (var k=0;k<goals.length; k++) {
        var vals = $(goals[k]).find('.propTable');
        data = {
            GOAL_BUDGET:"",
            GOAL_OUTSTANDING :"",
            GOAL_TARGET_FOR_SCORE:'',
            GOAL_ACHIEVEMENT:'',
            GOAL_RATING_KEY:'',
            GOAL_WEIGHTAGE_KEY:'',
        }
        for(var i=0;i<vals.length;i++) {
            item=vals[i];
            var key =$(item).find('.lab').html();
            var val = $(item).find('.val').html();
            console.log(key, val)

            if(key === "Budget") {
                data.GOAL_BUDGET = Number(val) || 0;
            }
            else if(key === 'Outstanding'){
                data.GOAL_OUTSTANDING = Number(val) || 0;
            }
            else if(key === 'Target for a Score of 4(if applicable)'){
                data.GOAL_TARGET_FOR_SCORE = Number(val) || 0;
            }
            else if(key === 'Achievement so far'){
                data.GOAL_ACHIEVEMENT = Number(val) || 0;
            }
            else if(key === 'Rating'){
                data.GOAL_RATING_KEY = Number(val) || 0;
            }else if(key === "Calculated Rating") {
                existingRating.push(Number(val) || 0)
            }else if(key === "Weightage") {
                var splitArr = val.split("%");
                data.GOAL_WEIGHTAGE_KEY = Number(splitArr[0]) || 0;
            }
        }
        Data_Arr.push(data);
        var result = calculate_Rating(data);
        actual_rating.push(result);
        }
    placeRating();
});
