#pragma strict

private var windowRect : Rect;
private var optionsRect : Rect;
private var pauseMenu = false;
private var optionsMenu = false;
public var pMenuSkin : GUISkin;

// Use this for initialization
function Start () {
	//Debug.Log("pause menu started");

	windowRect = new Rect(Screen.width/2 - 200, Screen.height/2 - 200, 400, 400);
	optionsRect = new Rect(Screen.width/2 - 200, Screen.height/2 - 200, 400, 400);
	
}

// Update is called once per frame
function Update () {

	if(Input.GetKey(KeyCode.Escape))
	{
        pauseMenu=true;
	}
		
	if(pauseMenu)	{	
		Time.timeScale = 0.0f;	
		Application.runInBackground = false;
}
	else 		
		Time.timeScale = 1.0f;
		
		
}

function OnGui(){
	Debug.Log("on gui");

		GUI.skin = pMenuSkin;
		
        if (pauseMenu){
			windowRect= GUI.Window(0,windowRect, winFunc, "");
		}
			
		if (optionsMenu){
			optionsRect= GUI.Window(0,optionsRect, optionsFunc, "");	
		} 

}

function winFunc(){

	if(GUILayout.Button("Resume"))
		{
			pauseMenu = false; 
		
		}
		if(GUILayout.Button("Options"))
		{
			optionsMenu= true;
			
		}
		if(GUILayout.Button("Quit"))
		{
			Application.LoadLevel(0);
		}

}

function optionsFunc(){

	if(GUILayout.Button("Back"))
		{
			optionsMenu = false;
		}
		if(GUILayout.Button ("Sound : On"))
		{
			// code to mute audio listener and change button text/state
		}

}


