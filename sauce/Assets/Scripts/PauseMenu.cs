using UnityEngine;
using System.Collections;
 
public class PauseMenu : MonoBehaviour {
 
		
    private Rect windowRect;
	private Rect optionsRect;
    private bool pauseMenu = false;
 	private bool optionsMenu = false;
	public GUISkin pMenuSkin ;

	
	void Start(){
		
		windowRect = new Rect(Screen.width/2 - 200, Screen.height/2 - 200, 400, 400);
		optionsRect = new Rect(Screen.width/2 - 200, Screen.height/2 - 200, 400, 400);
		
	}
   
	void Update()
	{
    	if(Input.GetKey(KeyCode.Escape))
		{
        pauseMenu=true;
		}
		
			if(pauseMenu)		
				Time.timeScale = 0.0f;		
			else 		
				Time.timeScale = 1.0f;
			
		}
	
 
    void OnGUI()
	{
 	GUI.skin = pMenuSkin;
		
		
        if (pauseMenu){
			windowRect= GUI.Window(0,windowRect, winFunc, "");
		}
			
		if (optionsMenu){
			optionsRect= GUI.Window(0,optionsRect, optionsFunc, "");	
		} 
        	
   	
	}
	
	private void winFunc(int id)
	{
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
			Application.Quit();
			Application.LoadLevel(0);
		}
	}
	
	private void optionsFunc(int id)
	{

		if(GUILayout.Button("Back"))
		{
			optionsMenu = false;
		}
		if(GUILayout.Button ("Sound : On"))
		{
			// code to mute audio listener and change button text/state
		}
	}
	
}

