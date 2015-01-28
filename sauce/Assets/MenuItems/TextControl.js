#pragma strict
var isQuit = false;
var isOption = false;
var isPlay = false;
var isBack = false;
var isSound = false;
var isReplay = false;
var  soundOn : boolean = true;

var optionSound : AudioClip;
var tempColor : Color;
var optionFollower : GameObject;
var aPositions : Array = [new Vector3(0,0,0),
                       	  new Vector3(1,2,1),
                          new Vector3(2,1,1)];
						  

function OnMouseEnter () {
	// Storing the selected  font color upon text creation
	tempColor = (renderer.material.GetColor("_Color"));
	//setting text color to magenta
	renderer.material.color = Color.magenta ;
	//rotating text effect
	renderer.transform.Rotate(Vector3(0,0,6));
	//play sound effects 
	audio.Play();
	
	if (isPlay)	{
	
	} else if (isOption) {
	
	} else if (isQuit) {
	
	}
}

function OnMouseExit () {
	// back to default
	renderer.material.color = tempColor  ;
	renderer.transform.Rotate(Vector3(0,0,-6));
}

function OnMouseUp() {
 	if (isQuit) {
 	 	Application.Quit();
		Debug.Log("Quiting Game. (This function only works on built projects)");
 	} else if (isOption) {
 		Application.LoadLevel(1);
 	} else if (isBack) {
 		Application.LoadLevel(0);
 	} else if (isReplay) {
 		Application.LoadLevel(2);
 	} else if (isSound) {
 		if (soundOn) {
 			renderer.GetComponent(TextMesh).text = "Music : Off";
			soundOn = false;
		} else { 
 			renderer.GetComponent(TextMesh).text = "Music : On";
 			soundOn = true;
 		}
		//GameObject.Find("Main Camera").GetComponent(AudioListener).enabled = soundOn;
 	} else {
 		// To pass level number or scene name 
 		Application.LoadLevel(2);
 	}
}

function Update() {
	//GameObject.Find("Surviving").GetComponent.<Surviving>().soundOn = this.soundOn;
}

