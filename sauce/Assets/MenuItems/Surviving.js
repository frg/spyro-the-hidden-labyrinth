#pragma strict

public var soundOn : boolean;

function Start () {

	//DontDestroyOnLoad(gameObject);
}

function Update () {
	DontDestroyOnLoad(gameObject);
	
	Debug.Log("Updating survivor");
	GameObject.Find("Main Camera").GetComponent(AudioListener).enabled = soundOn;

}