/* WoW Classic Notes version 0.5 */
/*!
* Joana's Vanilla WoW Guide Library v8
* https://www.joanasworld.com/
* Authored by Ryan Allen
*
* Released under the MIT license
* https://opensource.org/licenses/MIT
*
* Updated: 2019-05-29
*/

$(function() {

	$(".alt-route").hide();
	var guideID = "checkbox-data-" + $("#content").attr("class");			// creates a brand new LS array based on the guide's name
	var altRoutesID = "alt-routes-" + $("#content").attr("class");			// creates a brand new LS array for alternate route based on the guide's name
	// serializes checkbox array data to localStorage
	if ( window.localStorage.getItem(guideID) == undefined)
	{
		if ( guideID !== undefined)
		{
			var d = [];
			window.localStorage.setItem(guideID, JSON.stringify(d));
		}
	}
	else // shows user selected checkboxes on page load
	{
		var d = [];
		d = JSON.parse(window.localStorage.getItem(guideID));
		for (var i = 0; i < d.length; i++)
		{
			$.each($("[type='checkbox']"), function() {
				var tmp = this;
				if ( $(this).attr("id") == d[i] )
				{
					$(this).prop("checked", true);
					$(this).parents("b").next().addClass("completed-step");
					CompletedStepHighlight($(this), false);
				}
			});
		}
	}

	// serializes alternate route data to localStorage
	if ( window.localStorage.getItem(altRoutesID) == undefined)
	{
		if ( altRoutesID !== undefined)
		{
			var d = [];
			window.localStorage.setItem(altRoutesID, JSON.stringify(d));
		}
	}
	else // shows saved selected alternate routes on page load
	{
		var d = JSON.parse(window.localStorage.getItem(altRoutesID));
		$.each($(".guide-container"), function() {

			var altRoute = $(this).find(".alt-route");
			var regRoute = $(this).find(".reg-route");

			$.each(altRoute, function() {
				if (d) { 
					$(this).show();
				} else {
					$(this).hide();
				}
			});

			$.each(regRoute, function() {
				if (d) {
					$(this).hide();
				} else {
					$(this).show();
				}
			});
		});

	}

	// handles the hiding and showing of selected wow classes, plus pre-selects the wow class radio button
	function SelectVanillaClass(selectedClass, selector) {

		var arrayClasses = ["default",
							"druid", 
							"hunter",
							"mage",
							"paladin",
							"priest",
							"rogue",
							"shaman",
							"warlock",
							"warrior"].map(String);							// let's define an array of legacy wow classes prior to TBC

		var classIndex;
		for (i = 0; i < arrayClasses.length; i++)
        {
            classIndex = arrayClasses.indexOf(selectedClass);				// next, let's loop through the array until we find the value from selectedClass
            break;															// we're done here so we can exit the loop
        }

		for (i = 0; i < arrayClasses.length; i++)
        {
        	var selectors = "." + arrayClasses[i] + "-display";				// reset the playing field by hiding all wow class-specific content
            $(selectors).hide();
        }
        var radioButton = '[data-class*="' + selectedClass + '"]';
        $(radioButton).prop("checked", true);								// pre-ticks the selected wow class radio button
		$(selector).show();													// shows the user the wow class-specific content
	}

	// step number highlighter
	function CompletedStepHighlight(selector, remove) {
		if (selector.next().text() !== "")
		{
			var cs = selector.next().text();
			if (remove)
			{
				selector.next().html("<span></span>" + cs);
			}
			else
			{
				selector.next().html("<span></span><b class='completed-index'>" + cs + "</b>");
			}
		}
		else
		{
			if (remove)
			{
				selector.parent().find(".highlight").removeClass("completed-index");
			}
			else
			{
				selector.parent().find(".highlight").addClass("completed-index");
			}
		}
	}

	$(document).on("click", ".toggle-link", function() {
		$(this).parent().find(".toggle-results").toggle();
	});

	// checks local storage for a selected class on page load
	if (window.localStorage.getItem("current-class") != undefined)
	{
		var selectedClass = window.localStorage.getItem("current-class");	// grabs the class name from the attribute data-class and assigns to a variable for later use
		var selector = "." + selectedClass + "-display";					// creates a dynamic wow class-based selector for later use
		SelectVanillaClass(selectedClass, selector);						// calls a method to process the hiding and showing of wow class text and radio buttons
	}
	else
	{
		var selectedClass = "default";										// default for no selected wow class
		var selector = ".default-display";									// default image for no selected wow class
		SelectVanillaClass(selectedClass, selector);						
	}

	// event after users click on the class radio button
	$(document).on("click", "#class-choice input", function() {
		var selectedClass = $(this).attr("data-class");						// defines selected wow class name
       	var selector = "." + selectedClass + "-display";					// defines selected class name
		window.localStorage.setItem("current-class", selectedClass);		// saves user's currently selected wow class to localstorage
		SelectVanillaClass(selectedClass, selector);						
	});

	// event after users click on the guide checkboxes
	$(document).on("click", "[type='checkbox']", function() {
		var cid = $(this).attr("id");										// current checkbox id
		var isTicked = $(this).prop("checked");								// logic to determine if current checkbox is selected or deselected

		var d = [];
		d = JSON.parse(window.localStorage.getItem(guideID));				// retrieve all values for checkbox data from local storage
		d.sort();															// sorts array

		if ( isTicked )
		{
			if ( !d.includes(cid) )											// only continue if the checkbox's id does not exist in the array
			{
				d.push(cid);												// pushes selected step to LS array
				d.sort();
				window.localStorage.setItem(guideID, JSON.stringify(d));	// updates LS array
				$(this).parents("b").next().addClass("completed-step");
				CompletedStepHighlight($(this), false);
			}
		}
		else
		{
			d.splice(d.findIndex(d => d === cid), 1);						// removes deselected step from LS array
			d.sort();
			window.localStorage.setItem(guideID, JSON.stringify(d));		// updates LS array
			$(this).parents("b").next().removeClass("completed-step");
			CompletedStepHighlight($(this), true);
		}	

	});

	// removes saved checkbox data from this guide
	$(".jQremoveThisGuidesSelectedCheckboxes").attr("style", "background-color: #7D0910; cursor: pointer;");
	$(document).on("click", ".jQremoveThisGuidesSelectedCheckboxes", function() {
		window.localStorage.removeItem(guideID);
		$("[type='checkbox']").prop("checked", false);
		location.reload();
	});

	// removes selected checkboxes from all guides
	$(".jQremoveAllGuidesSelectedCheckboxes").attr("style", "background-color: #7D0910; cursor: pointer;");
	$(document).on("click", ".jQremoveAllGuidesSelectedCheckboxes", function() {
		var values = [];
		var keys = Object.keys(window.localStorage);
		for (var i = 0; i < keys.length; i++)
		{
			if ( keys[i].includes("checkbox-data-") )
			{
				window.localStorage.removeItem(keys[i]);
			}
		}
		$("[type='checkbox']").prop("checked", false);
		location.reload();
	});

	// Alternate Step Button
	$(document).on("click", ".jQaltRoute", function() {

		var isAlternateRoute = false;

		$.each($(".guide-container"), function() {

			var altRoute = $(this).find(".alt-route");
			var regRoute = $(this).find(".reg-route");

			$.each(altRoute, function() {
				if ($(this).css("display") == 'none') {
					$(this).show();
					isAlternateRoute = true;
				} else {
					$(this).hide();
					isAlternateRoute = false;
				}
			});

			$.each(regRoute, function() {
				if ($(this).css("display") == 'inline' || $(this).css("display") == 'block' || $(this).css("display") == 'inline-block' ) {
					$(this).hide();
				} else {
					$(this).show();
				}
			});
		});

		window.localStorage.setItem(altRoutesID, isAlternateRoute)
	});

	// miscellaneous stuff
	if ( window.localStorage.getItem("joana-admin") == undefined || window.localStorage.getItem("joana-admin") == "false" )
	{
		$(".admin").attr("style", "display: hidden;");
	}
	else
	{
		$(".admin").attr("style", "display: inline-block");
	}

	$(document).on("click", ".jQviewAdminStuff", function() {
		if ( window.localStorage.getItem("joana-admin") == undefined || window.localStorage.getItem("joana-admin") == "false" )
		{
			window.localStorage.setItem("joana-admin", "true");
		}
		else
		{
			window.localStorage.setItem("joana-admin", "false");
		}
		location.reload();
	});
});

// --------------------------------------------------- WoW Classic Notes Stuff ------------------------------------------

// color picker
$(function() {
  $.widget("custom.selectmenu", $.ui.selectmenu, {
    _renderItem: function(ul, item) {

      console.log(item);
      var li = $("<li>"),
        wrapper = $("<div>");

      if (item.disabled) {
        li.addClass("ui-state-disabled");
      }

      $("<span>", {
          style: "background-color: #" + item.value,
          "class": "ui-color-chip"
        })
        .appendTo(wrapper);
      wrapper.append(item.label);

      return li.append(wrapper).appendTo(ul);
    }
  });

  $("#DropDownID")
    .selectmenu()
    .selectmenu("menuWidget")
    .addClass("ui-menu-icons customicons");

  var Color = {
    Data: [

      {
      	RgbValue: 'c9c9c9',
      	ColorName: 'none'
      }, {
        RgbValue: '80FFFF',
        ColorName: 'accept'
      }, {
        RgbValue: '8080FF',
        ColorName: 'do'
      }, {
         RgbValue: '00C000',
         ColorName: 'turnin'
      }, {
         RgbValue: 'FF40FF',
         ColorName: 'general'
      }, {
        RgbValue: 'FF0000',
        ColorName: 'skipped'
      }, {
        RgbValue: 'FF7D0A',
        ColorName: 'druid'
      }, {
        RgbValue: 'E63131',
        ColorName: 'hunter'
      }, {
        RgbValue: '69CCF0',
        ColorName: 'mage'
      }, {
        RgbValue: 'F58CBA',
        ColorName: 'paladin'
      }, {
        RgbValue: 'FFFFFF',
        ColorName: 'priest'
      }, {
        RgbValue: 'FFF569',
        ColorName: 'rogue'
      }, {
        RgbValue: '0070DE',
        ColorName: 'shaman'
      }, {
        RgbValue: '9482C9',
        ColorName: 'warlock'
      }, {
        RgbValue: 'C79C6E',
        ColorName: 'warrior'
      },
    ]
  };

  for (var i = 0; i < Color.Data.length; i++) 
  {
    $("#DropDownID").append($("<option></option>").val(Color.Data[i].RgbValue).html(Color.Data[i].ColorName)		);
  }
});

// save button logic
function saveButton()
{
	var r = confirm("Save changes?");
	if (r)
	{
		var title = document.getElementById("title").textContent;	// store the string contained in the title
		localStorage.setItem('titleKey', title);					// set local storage to whatever the title contains
		if (localStorage.getItem("titleKey") == null || isNullOrWhiteSpace(localStorage.getItem("titleKey")))
		{
			document.getElementById("title").innerHTML = "Untitled Notes";
		}

		var notes1 = document.getElementById("n1").textContent;
		var notes2 = document.getElementById("n2").textContent;
		var notes3 = document.getElementById("n3").textContent;
		var notes4 = document.getElementById("n4").textContent;
		var notes5 = document.getElementById("n5").textContent;
		var notes6 = document.getElementById("n6").textContent;
		localStorage.setItem('n1Key', notes1);
		localStorage.setItem('n2Key', notes2);
		localStorage.setItem('n3Key', notes3);
		localStorage.setItem('n4Key', notes4);
		localStorage.setItem('n5Key', notes5);
		localStorage.setItem('n6Key', notes6);
	}
	if (localStorage.getItem("titleKey") == null || isNullOrWhiteSpace(localStorage.getItem("titleKey")))
	{
		document.getElementById("title").innerHTML = "Untitled Notes";
	}
}


// click edit button -> ENABLE save button, text editing, and color picker - DISABLE +/- buttons -> click again to do the opposite
var t = true;
function editButton(buttons)
{
	if(t)
	{
		document.getElementById(save.id).disabled = false;
		document.getElementById(save.id).className = "btnEnabled";
		document.getElementById(subtract1.id).hidden = false;
		document.getElementById(add1.id).hidden = false;
		document.getElementById(subtract2.id).hidden = false;
		document.getElementById(add2.id).hidden = false;
		document.getElementById(subtract3.id).hidden = false;
		document.getElementById(add3.id).hidden = false;
		document.getElementById(subtract4.id).hidden = false;
		document.getElementById(add4.id).hidden = false;
		document.getElementById(subtract5.id).hidden = false;
		document.getElementById(add5.id).hidden = false;
		document.getElementById(subtract6.id).hidden = false;
		document.getElementById(add6.id).hidden = false;
		t = false;
		document.getElementById(title.id).contentEditable = true;
		document.getElementById(edit.id).className = "editOn";
		document.getElementById(edit.id).innerHTML = "Edit: On";
		document.getElementById(n1.id).contentEditable = true;
		document.getElementById(n2.id).contentEditable = true;
		document.getElementById(n3.id).contentEditable = true;
		document.getElementById(n4.id).contentEditable = true;
		document.getElementById(n5.id).contentEditable = true;
		document.getElementById(n6.id).contentEditable = true;
	}

	else
	{
		document.getElementById(save.id).disabled = true;
		document.getElementById(save.id).className = "btnDisabled";
		document.getElementById(subtract1.id).hidden = true;
		document.getElementById(add1.id).hidden = true;
		document.getElementById(subtract2.id).hidden = true;
		document.getElementById(add2.id).hidden = true;
		document.getElementById(subtract3.id).hidden = true;
		document.getElementById(add3.id).hidden = true;
		document.getElementById(subtract4.id).hidden = true;
		document.getElementById(add4.id).hidden = true;
		document.getElementById(subtract5.id).hidden = true;
		document.getElementById(add5.id).hidden = true;
		document.getElementById(subtract6.id).hidden = true;
		document.getElementById(add6.id).hidden = true;
		t = true;
		document.getElementById(title.id).contentEditable = false;
		document.getElementById(edit.id).className = "editOff";
		document.getElementById(edit.id).innerHTML = "Edit: Off";
		document.getElementById(n1.id).contentEditable = false;
		document.getElementById(n2.id).contentEditable = false;
		document.getElementById(n3.id).contentEditable = false;
		document.getElementById(n4.id).contentEditable = false;
		document.getElementById(n5.id).contentEditable = false;
		document.getElementById(n6.id).contentEditable = false;
	}

	var str = document.getElementById("title").innerHTML;
	if (isNullOrWhiteSpace(str))
	{
		document.getElementById("title").innerHTML = "Untitled Notes"; // if user clicks edit button and has no title it is replaced with "Untitled Notes"
	}
}

// checks to see if string is null or has whitespace - if it has whitespace it gets rid of all of it before making the final check
function isNullOrWhiteSpace(str) 
{
	if (str.includes("&nbsp;"))
	{
		var exists = true;
		do
		{
			str = str.replace('&nbsp;', '');
			if (!str.includes("&nbsp;"))
			{
				exists = false;
			}
		}while(exists);
	}
	if (!str || str.length === 0 || /^\s*$/.test(str)) return true;
}

// disables enter key on everything
$(document).keypress(
  function(event){
    if (event.which == '13')
    {
      event.preventDefault();
    }
});

var stepNum1 = 1; // start at 1 since the first step is created by default
var stepNum2 = 1;
var stepNum3 = 1;
var stepNum4 = 1;
var stepNum5 = 1;
var stepNum6 = 1;
function addStep(row)
{
	if (row == 1)
	{
		stepNum1++;
		var html = '<input type="checkbox" id="'+stepNum1+'a'+'">'+'<label for="'+stepNum1+'a'+'">'+'<span></span>'+'</label>'+'<span class="highlight">'+'<label for="'+stepNum1+'a'+'">'+stepNum1+')</label>'+'</span>'+'<label for="'+stepNum1+'a'+'"></label>'+'<br>';
		addElement('1a', 'b', stepNum1+'a', html);
	}
	if (row == 2)
	{
		stepNum2++;
		var html = '<input type="checkbox" id="'+stepNum2+'b'+'">'+'<label for="'+stepNum2+'b'+'">'+'<span></span>'+'</label>'+'<span class="highlight">'+'<label for="'+stepNum2+'b'+'">'+stepNum2+')</label>'+'</span>'+'<label for="'+stepNum2+'b'+'"></label>'+'<br>';
		addElement('1b', 'b', stepNum2+'b', html);
	}
	if (row == 3)
	{
		stepNum3++;
		var html = '<input type="checkbox" id="'+stepNum3+'c'+'">'+'<label for="'+stepNum3+'c'+'">'+'<span></span>'+'</label>'+'<span class="highlight">'+'<label for="'+stepNum3+'c'+'">'+stepNum3+')</label>'+'</span>'+'<label for="'+stepNum3+'c'+'"></label>'+'<br>';
		addElement('1c', 'b', stepNum3+'c', html);
	}
	if (row == 4)
	{
		stepNum4++;
		var html = '<input type="checkbox" id="'+stepNum4+'d'+'">'+'<label for="'+stepNum4+'d'+'">'+'<span></span>'+'</label>'+'<span class="highlight">'+'<label for="'+stepNum4+'d'+'">'+stepNum4+')</label>'+'</span>'+'<label for="'+stepNum4+'d'+'"></label>'+'<br>';
		addElement('1d', 'b', stepNum4+'d', html);
	}
	if (row == 5)
	{
		stepNum5++;
		var html = '<input type="checkbox" id="'+stepNum5+'e'+'">'+'<label for="'+stepNum5+'e'+'">'+'<span></span>'+'</label>'+'<span class="highlight">'+'<label for="'+stepNum5+'e'+'">'+stepNum5+')</label>'+'</span>'+'<label for="'+stepNum5+'e'+'"></label>'+'<br>';
		addElement('1e', 'b', stepNum5+'e', html);
	}
	if (row == 6)
	{
		stepNum6++;
		var html = '<input type="checkbox" id="'+stepNum6+'f'+'">'+'<label for="'+stepNum6+'f'+'">'+'<span></span>'+'</label>'+'<span class="highlight">'+'<label for="'+stepNum6+'f'+'">'+stepNum6+')</label>'+'</span>'+'<label for="'+stepNum6+'f'+'"></label>'+'<br>';
		addElement('1f', 'b', stepNum6+'f', html);
	}
}

function addElement(parentId, elementTag, elementId, html)
{
    var p = document.getElementById(parentId);
    var newElement = document.createElement(elementTag);
    newElement.setAttribute('id', elementId);
    newElement.innerHTML = html;
    p.appendChild(newElement);
}

function removeStep(row)
{
	if (row == 1 && stepNum1 > 1)
	{
		var element = document.getElementById(stepNum1+'a');
    	element.parentNode.removeChild(element);
		stepNum1--;
	}
	if (row == 2 && stepNum2 > 1)
	{
		var element = document.getElementById(stepNum2+'b');
    	element.parentNode.removeChild(element);
		stepNum2--;
	}
	if (row == 3 && stepNum3 > 1)
	{
		var element = document.getElementById(stepNum3+'c');
    	element.parentNode.removeChild(element);
		stepNum3--;
	}
	if (row == 4 && stepNum4 > 1)
	{
		var element = document.getElementById(stepNum4+'d');
    	element.parentNode.removeChild(element);
		stepNum4--;
	}
	if (row == 5 && stepNum5 > 1)
	{
		var element = document.getElementById(stepNum5+'e');
    	element.parentNode.removeChild(element);
		stepNum5--;
	}
	if (row == 6 && stepNum6 > 1)
	{
		var element = document.getElementById(stepNum6+'f');
    	element.parentNode.removeChild(element);
		stepNum6--;
	}
	else
	{

	}
}