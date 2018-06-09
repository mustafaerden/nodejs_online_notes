$("#addNote").click(function(){
	$(".hideCard").css("display", "none");
	$("#addNote").css("display", "none");
	$("#editNote").css("display", "none");
	$("#allNotes").css("display", "inline-block");
	$("#done").css("display", "inline-block");
	$("#notePad").css("display", "block");
});

$("#allNotes").click(function(){		
		$("#allNotes").css("display", "none");
		$("#done").css("display", "none");
		$("#addNote").css("display", "inline-block");
		$("#editNote").css("display", "inline-block");
		$("#notePad").css("display", "none");
		$(".hideCard").css("display", "block");		
	});
