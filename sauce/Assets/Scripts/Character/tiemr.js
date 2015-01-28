#pragma strict
var endTime : float;
var textMesh : TextMesh;
static var start = true;
 
function Start() {
    endTime = Time.time + 5;
}
 
function Update() {
	var timeLeft : int = endTime - Time.time;

	if (start) {    
	    if (timeLeft < 0) {
	    	timeLeft = 0;
	    }
	    	
	    Debug.Log(timeLeft.ToString());
	    
	    if (timeLeft == 0) {
	    	restart();
	    }
    }
}

function restart() {
	endTime = Time.time + 5;
}

function startTimer() {
	start = true;
}

function stop() {
	start = false;
}

