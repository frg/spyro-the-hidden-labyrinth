#pragma strict
private var ai : Transform;

function Start () {
	ai = transform.parent.transform.Find("Observer");
}

function Update () {

}

function OnTriggerEnter(collision : Collider) {
	if (collision.tag == "Player") {
		//ai.GetComponentInChildren(EnemyAI).targetInRange = true;
		ai.GetComponentInChildren(EnemyAI).setTargetIsInRange(true);
		Debug.Log("Player in range");
		
		//gameObject.Find("/Enemy/EnemyModel/Body/Hat").renderer.material.color = Color.red;
	}
}

function OnTriggerExit(collision : Collider) {
	if (collision.tag == "Player") {
		//ai.GetComponentInChildren(EnemyAI).targetInRange = false;
		ai.GetComponentInChildren(EnemyAI).setTargetIsInRange(false);
		Debug.Log("Player out of range");
		
		//gameObject.Find("/Enemy/EnemyModel/Body/Hat").renderer.material.color = Color.green;
	}
}