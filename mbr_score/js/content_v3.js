/**
 * This file is used to calculate the 
 * MBR Annual Score based on simple weighted
 * average calculation formula(refer README.md)
 */

var WEIGHTAGE_KEY = "Weightage";
var RATING_KEY = "Rating";
var RATING_KEY_1 = "rating1";
var annualScoreTitleArray = ['MBR Annual Score','Annual Score', 'Annual Goal Review Instructions'];

var MBR_SCORE_ELEM = $("div h2[title='MBR Annual Score']").parent().siblings("div").find("div[class='HRContentCell'] input");
var TIMELINE_ELEM = $("div h2[title='Timelines']").parent().siblings("div");
var annual_score_ref = $("div h2[title='MBR Annual Score']").parent().siblings("div").find("div[class='HRContentCell']");
var CURRENT_STEP = "sfcurrentstep"; 

function getData() { 
    var dataArray = [];  
    /* var goals = $("div[class='tabDataBorder']"); */
    var goals = $("div[role='region']");
    //console.log(goals.length);
    var goalObj = {};
    $.each(goals, function (index, goal) {
        var title = $(goal).find("h2").text();
        //console.log($(title));
        if(title.indexOf("Goal")>=0){
            var goalAttrList = $(goal).find("div[role='tabpanel']");
            
            $.each(goalAttrList, function(index, goalDtls) {
                var body = $(goalDtls).find("tbody");
                var data = {WEIGHTAGE_KEY: 0.0, RATING_KEY: 0.0};
                //console.log("tbody", body.length);
                $.each(body, function(index, bodyDtls) {
                    //var data = {WEIGHTAGE_KEY: 0.0, RATING_KEY: 0.0};
                    var rows = $(bodyDtls).find("tr");
                    $.each(rows, function(index, row) {
                        var label = $(row).find("td[class='lab']").html();
                        var value = $(row).find("td[class='val']").html();
                        //var label = $(row).text();
                        //var value = $(row).text();
                        switch(label) {
                            case WEIGHTAGE_KEY:
                                data.WEIGHTAGE_KEY = parseFloat(value.replace("%", ""));
                                break;
                            case RATING_KEY:
                                data.RATING_KEY = parseFloat(value);
                                break;
                            case RATING_KEY_1:
                                data.RATING_KEY = parseFloat(value);
                                break;
                        } 
                    });
                    //dataArray.push(data); 
                });  
                dataArray.push(data); 
            });
            goalObj[title]=dataArray; 
            dataArray = [];
        }
        

    });
    //console.log('data array obj - ',goalObj);
    //return dataArray; 
    return goalObj;   
}

function getDuration(totalScoreObj) {
    var rows = $(TIMELINE_ELEM).find("tr");
    $.each(rows, function(index, row){
        var label = $(row).find("div[class='HRLabelCell']").html();
        var value = $(row).find("div[class='HRContentCell']").html();
        if(label.indexOf("Timeline")>=0) {
            var durationTxt = value.substring(0, value.indexOf("Months"));
            totalScoreObj.duration.push(parseInt(durationTxt));

        }
    });
}

function actual_score_Calculation(dataArray) {
    var mbr_score = 0;
    dataArray.forEach(element => {
        mbr_score += ((element.RATING_KEY || element.GOAL_RATING_KEY || 0) * (element.WEIGHTAGE_KEY || element.GOAL_WEIGHTAGE_KEY || 0))/100 ;
    });
    
    return mbr_score.toFixed(2);
}

function calculateScore(/* dataArray */ goalObj){
    var mbr_score = 0.00, index = 0;
    var totalScoreObj = {indvMbrScore: [], duration: []};
    $.each(goalObj, function(key, value){
        mbr_score = actual_score_Calculation(value);
        totalScoreObj.indvMbrScore.push(mbr_score);
        $(MBR_SCORE_ELEM[index]).prop("readonly", true);
        $(MBR_SCORE_ELEM[index]).val(mbr_score);
        index++; 
    });
    console.log(index);
    getDuration(totalScoreObj);
    var totalDuration = 0, totalMbrScore = 0.0;
    $.each(totalScoreObj.duration, function(index, value) {
        totalDuration += value;
    });
    $.each(totalScoreObj.indvMbrScore, function(index, value) {
        //console.log('value : ', value);
        //console.log('duration : ', totalScoreObj.duration[index]);
        totalMbrScore += (value* totalScoreObj.duration[index])/totalDuration;
    });
    $(MBR_SCORE_ELEM[index]).prop("readonly", true);
    $(MBR_SCORE_ELEM[index]).val(totalMbrScore.toFixed(2));
    /*
    MBR_SCORE_ELEM.prop("readonly", true);
    MBR_SCORE_ELEM.val(mbr_score);
    */
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
		if(functionSelector > 0) {
			/* Target exists and its increasing */
			return calculatePositiveRatngWithTarget(data);
		} else if(functionSelector < 0)  {
			/* Target exists and its decreasing */
			return calculateNegativeRatngWithTarget(data);
		}
	} else {
		if(functionSelector > 0) {
			/* Target does not exist and its increasing */
			return calculatePositveRatingWithoutTarget(data);
		} else if(functionSelector < 0)  {
			/* Target does not exist and its decreasing */
			return calculateNegativeRatingWithoutTarget(data);
		}
	}
};
function setAnnualAttributeRef(){
    var ele = $("div h2");
    for(var i=0;i<ele.length ; i++) {
        if(annualScoreTitleArray.indexOf($(ele[i]).attr('title')) >= 0) {
            MBR_SCORE_ELEM = $(ele[i]).parent().siblings("div").find("div[class='HRContentCell'] input");
            annual_score_ref = $(ele[i]).parent().siblings("div").find("div[class='HRContentCell']");
        }
    }
}
$(document).ready(function(){
    var routeMapDiv = $("div#routeMap");
    setAnnualAttributeRef();
    calculateScore(getData());
    
    Data_Arr = [];
    var goals=$('.tabbox');
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
