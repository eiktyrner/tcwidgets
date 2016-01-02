var input = null;
var result = null;
$(document).ready(function(){
	input = $("#aspect");
	result = $("#result");
	
	input.on("keydown", function(event){
		if(event.keyCode == 13) show($(this).val().toLowerCase());
	});
});
function show(asp){
	result.attr("class", "").empty();//Clear everything
	$("table > tbody > tr:not(#input-row)").remove();
	var label = asp.slice(0, 1).toUpperCase() + asp.slice(1);
	var aspect = aspects[asp];
	if(aspect){
		result.text("Showing component and user trees of ");
		result.append($("<img src='" + aspect.iconURL + "'/>").css("vertical-align", "middle"));
		result.append($("<b>" + label + "</b>"));
		
		$("#components-wrapper > ul, #users-wrapper > ul").empty();
		
		render(aspect, $("#components-wrapper > ul"), "components");
		render(aspect, $("#users-wrapper > ul"), "users");
	}else{
		result.addClass("error").text("Unknown aspect '" + label + "'");
	}
}
function render(aspect, parent, fn){
	var li = $("<li></li>").appendTo(parent);
	var text = $("<p></p>").appendTo(li);
	text.css("background-image", "url(" + aspect.iconURL + ")");
	text.append("<span class='aspect-name'>" + aspect.displayName + "</span>").append("<span class='aspect-description'>" + aspect.displayDescription+ "</span>");
	var ul = $("<ul></ul>").appendTo(li);
	var array = aspect[fn];
	for(var asp in array) render(array[asp], ul, fn);
}
