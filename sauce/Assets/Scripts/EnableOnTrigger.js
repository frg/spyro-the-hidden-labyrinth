#pragma strict
private var sector : GameObject;
private var sectorColliders : Component[];

public var disableColliders : boolean = false;
public var disableObjects : boolean = true;

function Start () {
	sector = transform.Find("sectorGroup").gameObject;
	ObjectControl(false);
	
	var sC = transform.Find("sectorColliders");
	if (sC && sC.GetChildCount() > 0) {
		Debug.Log("GameObject: sectorColliders; found.");
		sectorColliders = sC.GetComponentsInChildren(Collider);
	}
	// Disable Colliders
	ColliderControl(false);
}

function Update () {

}

function OnTriggerEnter(hit: Collider)	{
	if (hit.gameObject.tag == "Player") {
		ObjectControl(true);
		// Enable Colliders
		ColliderControl(true);
	}
}

function OnTriggerExit(hit: Collider)	{
	if (hit.gameObject.tag == "Player") {
		ObjectControl(false);
		// Disable Colliders
		ColliderControl(false);
	}
}

function ObjectControl(cEnable : boolean) {
	if (disableObjects) {
		Debug.Log("Setting " + gameObject.name + " active = " + cEnable);
		sector.SetActive(cEnable);
	}
}

function ColliderControl(cEnable : boolean) {
	if (sectorColliders && disableColliders) {
		for (var i = 0; i < sectorColliders.Length; i++) {
			sectorColliders[i].collider.enabled = cEnable;
		}
	}
}