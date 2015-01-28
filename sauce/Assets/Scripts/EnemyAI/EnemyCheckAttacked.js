#pragma strict
private var ai : GameObject;
private var player : GameObject;

function Start () {
	ai = transform.parent.Find("Observer").gameObject;
	player = GameObject.Find("Spyro");
}

function OnTriggerEnter(hit: Collider)	{
	//Debug.Log("Enemy got hit by: " + hit.gameObject.tag);

	if (hit.gameObject.tag == "Fire") {
		//Debug.Log("Enemy has been hit by fire!");
		//if (ai.GetComponentInChildren(EnemyAI).state != ai.GetComponentInChildren(EnemyAI).blocking) {
		if (!ai.GetComponentInChildren(EnemyAI).isBlocking()) {
			Debug.Log("Enemy has been FRIED! :´<");
			//ai.GetComponentInChildren(EnemyAI).state = ai.GetComponentInChildren(EnemyAI).dying;
			ai.GetComponentInChildren(EnemyAI).killEnemy();
		}
	} else if (hit.gameObject.tag == "Player") {
		var playerScript = player.GetComponentInChildren(GoodCharacterControl);
	
		if (playerScript.characterState == playerScript.charging) {
			//if (ai.GetComponentInChildren(EnemyAI).state != ai.GetComponentInChildren(EnemyAI).blocking) {
			if (!ai.GetComponentInChildren(EnemyAI).isBlocking()) {
				Debug.Log("Spyro hit me while charging!! :@");
				//ai.GetComponentInChildren(EnemyAI).state = ai.GetComponentInChildren(EnemyAI).dying;
				ai.GetComponentInChildren(EnemyAI).killEnemy();
			}
		}
	}
}