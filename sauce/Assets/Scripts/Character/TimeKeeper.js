#pragma strict
////////////////////////////////
//////////Dependencies//////////

// > Needs 2 seperate colliders
// > 1 collider tagged "Start"
// > 1 collider tagged "Finish"
var exitOutOfStart : boolean = true;

static var increment = false;
private var guiTxt : GUIText;
private var spyro : GameObject;

private var fontS : int;

//Font expansion start time
private var startTime :float;
private var minI : float = 0;
private var timeDiff : float = 0.5;

// Sound FX
var startSFX: AudioClip;
var finishSFX: AudioClip;

function Start() {
	guiTxt = GameObject.Find("DisplayLayout/TimeKeeper").guiText;
	fontS = guiTxt.fontSize;
	
	//Fing spyro score script
	spyro = GameObject.Find("Spyro");
	
	increment = false;
}

function Update () {
	var spyroScoreKeeper = spyro.GetComponentInChildren(ScoreKeeper);

	// GUI Text
	guiTxt.text = formatTime();
	//Debug.Log("Time: " + formatTime());

	// Do every minuteS
	if(minI < ((spyroScoreKeeper.time / 60) - 1)) {
		startTime = Time.time;
		guiTxt.fontSize = fontS * 1.8;
		minI = spyroScoreKeeper.time / 60;
		//Debug.Log(minI);
	}
	
	if (Time.time > startTime + timeDiff) {
		guiTxt.fontSize = fontS;
	}
	
	//Debug.Log("Increment?: " + increment);
	// Increment timer
	if (increment) {
		spyroScoreKeeper.incrementTime();
	}
	
	//Debug.Log("Final Score: " + spyroScoreKeeper.calculateEndScore());
}

function OnTriggerEnter(col : Collider){
	var spyroScoreKeeper = spyro.GetComponentInChildren(ScoreKeeper);

	// If collision is with player
	if (col.gameObject.tag == "Player") {
		Debug.Log("Is tagged: " + gameObject.tag);
		// If this is Start
		if (!exitOutOfStart && gameObject.tag == "Start" && spyroScoreKeeper.time == 0.0) {
			increment = true;
			
			PlaySound(startSFX.name, startSFX);
			//Debug.Log("Timer started");
		// If this is finish
		} else if (gameObject.tag == "Finish" && increment) {
			increment = false;
			
			PlaySound(finishSFX.name, finishSFX);
			// ADD FINAL SCORE TO LEADERBOARD!!!!!!!!!!
			//spyroScoreKeeper.AddScore("Wook", spyroScoreKeeper.calculateEndScore());
			Debug.Log("Final Score: " + spyroScoreKeeper.calculateEndScore());
			
			// Save current score
			PlayerPrefs.SetInt("CScore", spyroScoreKeeper.calculateEndScore());
			// Disable control over spyro
			spyro.GetComponent(GoodCharacterControl).setControllable(false);
			// Delay before highscores load
			yield WaitForSeconds(2);
			Application.LoadLevel("Highscores");
		}
	}
}

function OnTriggerExit(col : Collider){
	var spyroScoreKeeper = spyro.GetComponentInChildren(ScoreKeeper);

	// If collision is with player
	if (col.gameObject.tag == "Player") {
		Debug.Log("Is tagged: " + gameObject.tag);
		// If this is Start
		if (exitOutOfStart && gameObject.tag == "Start" && spyroScoreKeeper.time == 0.0) {
			increment = true;
			
			PlaySound(startSFX.name, startSFX);
			//Debug.Log("Timer started");
		}
	}
}


// Display temp GUI
//function OnGUI(){
//	// If game object is start draw gui
//	if (gameObject.tag == "Start") { 
//       GUI.Label (Rect (10, 10, 140, 40), formatTime());
//    }
//}

function formatTime() {
	var spyroScoreKeeperTime = spyro.GetComponentInChildren(ScoreKeeper).time;

	var minutes : int = spyroScoreKeeperTime / 60;
	var seconds : int = spyroScoreKeeperTime % 60;
	var fraction : int = (spyroScoreKeeperTime * 100) % 100;
	
	return String.Format ("{0:00}:{1:00}:{2:00}", minutes, seconds, fraction);
}

function PlaySound(soundName : String, sound : AudioClip) {
	var soundObject : GameObject = new GameObject(soundName);
	var soundSource = soundObject.AddComponent(AudioSource); 
    soundSource.clip = sound; 
    soundSource.volume = 1.5; 
    soundSource.pitch = 1.0;
    soundObject.transform.parent = transform.parent;
    soundObject.transform.position = transform.parent.position;
    soundSource.Play();
    Destroy(soundObject, sound.length + 0.1);
}