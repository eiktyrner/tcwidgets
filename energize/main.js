var inputTable = null;
var submitButton = null;
var resultTable = null;
$(document).ready(function(){
	inputTable = $('#aspectInput');
	submitButton = $('#submit');
	resultTable = $('#results');
	
	addRow();//Add initial empty row
	submitButton.on('click', update);
});

function update(event){
	resultTable.empty();
	$('.error').remove();
	var rawAspects = {};
	for(asp in aspects.selected.primals) rawAspects[asp] = 0;
	inputTable.children('tbody').children('tr').each(function(index){
		var inputs = $(this).children('td').children('input');
		var aspectName = $(inputs.get(0)).val().toLowerCase();
		if(!aspectName) return;
		var aspectLabel = aspectName.slice(0, 1).toUpperCase() + aspectName.slice(1);
		if(aspects.selected[aspectName]){
			var aspectComponents = aspects.selected[aspectName].primalsObject();
			var aspectQuantity = Number($(inputs.get(1)).val());
			for(var asp in aspectComponents){
				rawAspects[asp] = Math.max(rawAspects[asp], aspectComponents[asp] * aspectQuantity);
			}
		}else{
			submitButton.after($("<p>Unknown aspect '" + aspectLabel + "'. That row will be ignored during calculation.</p>").addClass('error'));
		}
	});
	for(var aspect in rawAspects){
		var row = $('<tr></tr>');
		row.append($("<td><img src='" + aspects.selected[aspect].iconURL + "'/></td>"));
		row.append($('<td>' + aspect + '</td>'));
		row.append($('<td>' + Math.floor(Math.sqrt(rawAspects[aspect])) + '</td>'));
		resultTable.append(row);
	}
};

updateVersion = update;

function addRow(){
	var aspectName = $("<input type='text' class='w3-input w3-dark-grey'/>");
	aspectName.on('keydown', function(event){
		var row = $(this).parent().parent();
		if(row.index() == row.parent().children().length-1) addRow();
	});
	var aspectCount = $("<input type='number' class='w3-input w3-dark-grey'/>");
	inputTable.append(
		$('<tr></tr>').append(
			$('<td></td>').append(aspectName)
		).append(
			$('<td></td>').append(aspectCount)
		).append(
			$('<td></td>').append(removeButton(function(event){
				var row = $(this).parent().parent();
				if(row.parent().children().length > 1)
					row.remove();//Remove row only if it is not the last
				else{
					row.children('td').children('input').val('');//Clear all inputs
				}
			}))
		)
	);
}

function removeButton(handler){
	return $('<button></button>').addClass('w3-btn w3-red remove').append("<i class='material-icons'>delete</i>").on('click', handler);
}
