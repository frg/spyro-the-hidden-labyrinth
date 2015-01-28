var target : Transform;
var damping = 6.0;
var smooth = true;

private var spyro : GameObject;

function LateUpdate () {
	if (target) {
		var rotation = Quaternion.LookRotation(target.position - transform.position);
		rotation.z = 0;
	
		if (smooth) {
			// Look at and dampen the rotation
			// Removes horizontal rotation
			transform.rotation = Quaternion.Slerp(transform.rotation, rotation, Time.deltaTime * damping);
		} else {
			// Just lookat
			// Removes horizontal rotation
			transform.rotation = rotation;
		}
	}
}

function Start () {
	// Find Spyro
	spyro = GameObject.Find("Spyro");

	// Make the rigid body not change rotation
   	if (rigidbody)
		rigidbody.freezeRotation = true;
}