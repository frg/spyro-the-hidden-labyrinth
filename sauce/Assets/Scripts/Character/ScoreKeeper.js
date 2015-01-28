#pragma strict
static var gemScore = 0;
static var time = 0.0;

private var guiTxt : GUIText;
private var guiTxtFSize : float;
private var txtBumpEnd : float;
private var txtBumpDuration = 0.1;

function Awake () {
	// In order to let script be accessable for other scenes
	//DontDestroyOnLoad(transform.root.transform.gameObject);
}

function Start () {
	guiTxt = GameObject.Find("GemScore").guiText;
	guiTxtFSize = guiTxt.fontSize;
	
	// Resetting static vars on load
	gemScore = 0;
	time = 0.0;

	//ClearScores();

	//AddScore("John", 213);
	//AddScore("Jean", 9999);
	//AddScore("Clive", 5678);
	//AddScore("Chris", 342);
	//AddScore("Jack", 8932);
	
	//UpdateHScore();
}

function Update () {
	if(Time.time > txtBumpEnd){
		guiTxt.fontSize = guiTxtFSize;
	}
}

function calculateEndScore() {
	var tempScore : int = Mathf.CeilToInt((gemScore - (time / 5)) * 100);
	
	if (tempScore < 0) {
		return 0;
	}
	
	return tempScore;
}

function incrementTime() {
	// no idea why time has to be divided by 2.. :s
	time += Time.deltaTime / 2;
}

function addGemScore(score : int) {
	gemScore += score;
	//Debug.Log("Gem Score: " + gemScore);
	
	txtBumpEnd = Time.time + txtBumpDuration;
	
	guiTxt.text = "" + gemScore;
	// Increase font size (the bump)
	guiTxt.fontSize = guiTxt.fontSize * 2;
}