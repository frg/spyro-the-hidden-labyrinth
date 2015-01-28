#pragma strict
private var gemT : GameObject;

function Start () {
	gemT = GameObject.Find("/Gem/Trigger");
}

function OnTriggerEnter(hit: Collider)	{
	Debug.Log("Gem touched: " + hit.gameObject.tag);

	if (hit.gameObject.tag == "Player") {
//		gemT.GetComponentInChildren(SpyroMagneticGems).isEatable = true;
	}
}