var input1, input2, button, configInput, configEnable, configDisable, results;

var validity = {aspect1: false, aspect2: false};//Stores whether the users's aspect names are valid or not

$(initLib);

$(function(){//When the page is loaded, do the following.
	//These lines locate and save the page elements that are important for the script:
	input1 = $('#aspect1');//The starting aspect textbox,
	input2 = $('#aspect2');//the ending aspect textbox,
	button = $('#connect');//the "Connect" button,
	configInput = $('#config-input'); configEnable = $('#config-enable'); configDisable = $('#config-disable');//the configuration section's fields,
	results = $('#results');//and the column where the connection is displayed.
	
	input1.add(input2).on('propertychange change keyup input paste', {showErrors: false}, validate)
	.on('focusout', {showErrors: true}, validate)
	.each(function(index){
		if(aspects.selected[this.value]){
			$(this).prev().addClass('w3-text-green');
			validity[this.id] = true;
		}else button.addClass('w3-disabled');
	});
	if(validity.aspect1 && validity.aspect2) makeConnection();
	
	configInput.on('propertychange change keyup input paste', function(){
		var node = nodes[this.value.toLowerCase()];
		configEnable.toggleClass('w3-disabled', !node || node.active);
		configDisable.toggleClass('w3-disabled', !node || !node.active);
	});
	configEnable.on('click', function(){
		if(!$(this).hasClass('w3-disabled')) nodes[configInput.val().toLowerCase()].active = true;
		configEnable.addClass('w3-disabled');
		configDisable.removeClass('w3-disabled');
		$('#disabled-list > li[data-aspect=' + configInput.val().toLowerCase() + ']').remove();
	});
	configDisable.on('click', function(){
		if(!$(this).hasClass('w3-disabled')) nodes[configInput.val().toLowerCase()].active = false;
		configEnable.removeClass('w3-disabled');
		configDisable.addClass('w3-disabled');
		var aspect = aspects.selected[configInput.val().toLowerCase()];
		$('<li></li>').attr('data-aspect', aspect.name).append("<img src='" + aspect.iconURL + "'/>").append(aspect.displayName).appendTo('#disabled-list');
	});
	
	button.on('click', function(){//When the "Connect" button is clicked,
		if(!button.hasClass('w3-disabled')) makeConnection();//If the button is active (two valid aspects have been inputted), make and display the connection.
	});
	
	$('#results-header').append(removeButton(function(){
		results.empty();
	}));
});

function validate(event){
	var asp = (this.value || '').toLowerCase();
	validity[this.id] = aspects.selected[asp] ? true : false;//If an aspect exists with the name inputted into this field, mark this field valid.
	$(this).prev().toggleClass('w3-text-green', validity[this.id]);//If the aspect is valid, make the label text green;
	$(this).prev().toggleClass('w3-text-red', !validity[this.id]);//otherwise, make it red.
	button.toggleClass('w3-disabled', !validity.aspect1 || !validity.aspect2);//If either aspect is invalid, disable the "Connect" button.
	
	if(event.data.showErrors){
		var errorBox = $('#error' + this.id.slice(-1));
		if(validity[this.id]) errorBox.empty();
		else errorBox.text("Unknown aspect '" + asp.slice(0, 1).toUpperCase() + asp.slice(1) + "'.");
	}
}

function makeConnection(){
	var asp1 = input1.val().toLowerCase(), asp2 = input2.val().toLowerCase();//Get aspect names from the two input fields.
	
	var row = $('<div></div>').addClass('chain');
	
	var chain = nodes.connect(asp1, asp2);//Find the connection between the two aspects (returns an array of aspect names from start to end).
	
	for(var i=0; i<chain.length; i++){//For each aspect in the chain,
		var container = $('<div></div>').addClass('chain-element w3-tooltip');
		$('<img/>').attr('src', chain[i].aspect.iconURL).appendTo(container);
		
		var tooltip = $('<span></span>').addClass('w3-text w3-tag w3-round-large').css('padding-bottom', '8px').appendTo(container);
		tooltip.append("<span class='aspect-name'>" + chain[i].aspect.displayName + "</span>")
				.append("<span class='aspect-description'>" + chain[i].aspect.displayDescription+ "</span>");
		if(!chain[i].aspect.isPrimal()){
			tooltip.append('<br/>');
			var comps = chain[i].aspect.components;
			for(var j=0; j<comps.length; j++){
				tooltip.append("<img src='" + comps[j].iconURL + "'/>");
				if(j+1 < comps.length) tooltip.append("<i class='material-icons'>add</i>");
			}
		}
		container.appendTo(row);
		if(i+1 < chain.length) row.append("<i class='material-icons'>keyboard_arrow_right</i>");
	}
	row.append(removeButton(function(event){
		$(this).parent().remove();
	}))
	results.append(row);
}

function removeButton(handler){
	return $('<button></button>').addClass('w3-btn w3-red remove').append("<i class='material-icons'>delete</i>").on('click', handler);
}

function updateVersion(){
	for(var name in nodes) delete nodes[name];
	initLib();
	results.empty();
}
