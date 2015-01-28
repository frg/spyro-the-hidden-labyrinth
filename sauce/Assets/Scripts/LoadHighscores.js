#pragma strict

public var playerNameLength : int = 5;
public var HighscoreSkin : GUISkin;
//private var myStyle : GUIStyle;

private var windowRect : Rect;
// Player name input
private var playerName : String = "";
// Final highscores string
private var finalScoreTxt : String = "";

private var hasPressedOk : boolean = false;

function Start () {
	windowRect = Rect(Screen.width/2 - 250, Screen.height/2 - 100, 510, 280);
}

function Update () {
}

function OnGUI() {
	GUI.skin = HighscoreSkin;
	windowRect= GUI.Window(0, windowRect, winFunc, "");
}

function enterName() {
	if (!hasPressedOk) {
		GUI.Label(Rect(10,240,100,25), "Enter Name :");
		
		var tempName = GUI.TextField(Rect (120, 240, 130, 25), playerName, 10);
		if (playerName.Length <= playerNameLength) {
			// Remove whitespace
			playerName = Regex.Replace(playerName, "( )+", "");
			//Change to whatever variable storing the names 		
			playerName = tempName;
		}
		
		// Okay button + validation
		if (GUI.Button(Rect(260,240,50,25), "OK")) {
			if (playerName.Trim() != "") {
				// Add current score/name
				AddScore(playerName, PlayerPrefs.GetInt("CScore"));
				// Disable player name input
				hasPressedOk = true;
			}
		}
	}
}

function winFunc (windowID : int) {
	GUILayout.BeginArea(Rect(40, 20, 508, 220));
		loadScores();
	GUILayout.EndArea();
	
	// Enter player name
	enterName();
}

function loadScores() {
	Debug.Log("Loading Scores.");

	//transform.guiText.text = GetHScores();
	GUILayout.TextArea(GetHScores());
}

function AddScore(name : String, score : int){
	var newScore : int = score;
	var newName : String = name;
	
	Debug.Log("Ranking/Adding score.");
	
	// Use for ranking
	var oldScore : int;
	var oldName : String;
	
	// Loop through scores
	for(var i = 0; i < 10; i++){
		if(PlayerPrefs.HasKey(i + "HScore")){
			// Check ranking
			if(PlayerPrefs.GetInt(i + "HScore") < newScore){ 
				// new score is higher than the stored score
				oldScore = PlayerPrefs.GetInt( i + "HScore");
				oldName = PlayerPrefs.GetString( i + "HScoreName");
				
				// Write scores
				PlayerPrefs.SetInt(i + "HScore", newScore);
				PlayerPrefs.SetString(i + "HScoreName", newName);
				
				newScore = oldScore;
				newName = oldName;
			}
		// If no score exists
		} else {
			PlayerPrefs.SetInt(i + "HScore", newScore);
			PlayerPrefs.SetString(i + "HScoreName", newName);
			
			newScore = 0;
			newName = "";
		}
	}
}

function GetHScores(){
	finalScoreTxt = "";

	var score : int;
	var name : String;
	
	// Loop through scores
	for(var i = 0; i < 10; i++){
		if(PlayerPrefs.GetInt(i + "HScore") > 0){
			name = PlayerPrefs.GetString(i + "HScoreName");
			score = PlayerPrefs.GetInt(i + "HScore");
		
			// Don't add new line if there are no scores yet.
			if (finalScoreTxt != "") {
				finalScoreTxt += "\n";
			}
			
			finalScoreTxt += name;
			finalScoreTxt += "\t\t\t\t" + score;
		}
	}
	
	return finalScoreTxt;
}

function ClearScores() {
	PlayerPrefs.DeleteAll();
}