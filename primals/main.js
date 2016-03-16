var input = null;
var result = null;
var table = null;
$(document).ready(function(){
	input = $('#aspect');
	result = $('#result');
	table = $('#results');
	
	input.on('keydown', function(event){
		if(event.keyCode == 13) update();
	});
});
function update(){
	result.attr('class', '').empty();//Clear everything
	table.empty();
	var asp = input.val().toLowerCase();
	var aspect = aspects.selected[asp];
	var label = asp.slice(0, 1).toUpperCase() + asp.slice(1);
	if(aspect){
		result.text('Showing primal components of ');
		result.append($("<img src='" + aspect.iconURL + "'/>"));
		result.append($('<b>' + label + '</b>'));
		var primals = aspect.primalsObject();
		for(var prim in aspects.selected.primals){
			if(!primals[prim]) continue;
			var row = $('<tr></tr>');
			row.append($("<td><img src='" + aspects.selected[prim].iconURL + "'/></td>"));
			row.append($('<td>' + aspects.selected[prim].displayName + '<span>' + aspects.selected[prim].displayDescription + '</span></td>'));
			row.append($('<td>' + primals[prim] + '</td>'));
			table.append(row);
		}
	}else{
		result.addClass('error').text("Unknown aspect '" + label + "'");
	}
}
updateVersion = update;
