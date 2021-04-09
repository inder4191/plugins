/**
 * This file is used to calculate the "Calculated Rating" field
 * based on user input of "Achievement so far" and on rules as per scenarios of
 * Budget, Outstanding and Target for a Score
 * For calculation formula refer README.md
 */

var GOAL_BUDGET = "Budget";
var GOAL_OUTSTANDING = "Outstanding";
var GOAL_TARGET_FOR_SCORE = "Target for a Score";
var GOAL_ACHIEVEMENT = "Achievement so far";
var GOAL_RATING_KEY = "Calculated Rating";

function truncateToDecimals(num, dec = 2) {
	const calcDec = Math.pow(10, dec);
	return Math.trunc(num * calcDec) / calcDec;
  }

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
	console.log("rating:",rating)
	return truncateToDecimals(rating);
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
	console.log("rating:",rating)
	return truncateToDecimals(rating);
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
	console.log("rating:",rating)
	return truncateToDecimals(rating);
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
	console.log("rating:",rating)
	return truncateToDecimals(rating);
}

function calculateRating(data){
	if(null==data.GOAL_ACHIEVEMENT || isNaN(data.GOAL_ACHIEVEMENT)){  
		return "";
	}

	/* check if GOAL_TARGET_FOR_SCORE exist */
	var functionSelector = data.GOAL_OUTSTANDING - data.GOAL_BUDGET;
	if(data.hasOwnProperty('GOAL_TARGET_FOR_SCORE') && null!=data.GOAL_TARGET_FOR_SCORE
		 											&& !isNaN(data.GOAL_TARGET_FOR_SCORE)) {
		if(functionSelector > 0) {
			/* Target exists and its increasing */
			return calcltePostveRatngWithTarget(data);
		} else if(functionSelector < 0)  {
			/* Target exists and its decreasing */
			return calclteNegtveRatngWithTarget(data);
		}
	} else {
		if(functionSelector > 0) {
			/* Target does not exist and its increasing */
			return calcltePostveRatngWithoutTarget(data);
		} else if(functionSelector < 0)  {
			/* Target does not exist and its decreasing */
			return calclteNegtveRatngWithoutTarget(data);
		}
	}
};

$(document).ready(function(){
    var editForm = $("#formTB_edit0");
	var fieldRows = $(editForm).find("table").find("tr");
	var data = { 
		GOAL_BUDGET: 0.0, 
		GOAL_OUTSTANDING: 0.0,
		GOAL_ACHIEVEMENT: 0.0
	};
	
	$.each(fieldRows, function(index, row) {
		var label = $(row).find("th").find("label").text();
        var value = 0.0;
		if(-1 != label.indexOf(GOAL_BUDGET)){		
			value = $(row).find("td").find("label").html();
			data.GOAL_BUDGET = parseFloat(value.replace("%", ""));
		}
		else if(-1 != label.indexOf(GOAL_OUTSTANDING)){
			value = $(row).find("td").find("label").html();
			data.GOAL_OUTSTANDING = parseFloat(value);
		}
		else if(-1 != label.indexOf(GOAL_TARGET_FOR_SCORE)){
			value = $(row).find("td").find("label").html();
			data['GOAL_TARGET_FOR_SCORE'] = parseFloat(value);
		}
		else if(-1 != label.indexOf(GOAL_ACHIEVEMENT)){ 
			value = $(row).find("td").find("input").val();
			data.GOAL_ACHIEVEMENT = parseFloat(value);
			$(row).find("td").find("input").attr("data-type", "user-input");
		}
		else if(-1 != label.indexOf(GOAL_RATING_KEY)){ 
			$(row).find("td").find("input").attr("data-identifier", "goal-rating");
		}		
	});
	
	$("input[data-identifier='goal-rating']").attr("value", calculateRating(data));
	$("input[data-identifier='goal-rating']").attr("readonly", true);
	
	$("input[data-type='user-input']").keyup(function(){
		data.GOAL_ACHIEVEMENT = parseFloat($(this).val());
		$("input[data-identifier='goal-rating']").attr("value", calculateRating(data));
	});
});