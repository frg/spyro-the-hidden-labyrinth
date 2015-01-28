#pragma strict
private var target : Transform;
var gem : GameObject;
private var init_Gem : GameObject;

private var parent : GameObject;
private var enemy : Transform;

// Speed at which the enemy is able to move
var moveSpeed = 0.8;
// Speed at which the enemy is able to turn
var turnSpeed = 1.0;
// Time between every attack
var attackSpeed = 2.0;
// Distance that the enemy isa able to attack from
var attackRange = 5.0;

// Is the enemy able to wander from spawn point?
var doesWander = true;
// Distance enemy is able to wander from spawn point
var wanderDistance = 20.0;
// Max amount of seconds until next wander
var wanderSpeed = 10.0;
// Distance that the target is able to get close until enemy looks at it
private var sightRange : float;
// The range of degrees which the enemy is able to scan for target
var fieldOfView = 5.0;


// Location of original spawn
private var spawnPoint : Vector3;
// Info from raycast hit
private var hit : RaycastHit;
private var targetInRange = false;
private var nextAttack : float;
private var nextWander : float;
private var wanderPos : Vector3;
private var hitCount : int = 0;

///// States /////
private var resetting = 0;
private var wandering = 1;
private var chasing = 2;
private var attacking = 3;
static var blocking = 4;
static var dying = 5;
private var dead = 6;
/////////////////
private var enemyState = wandering;

// Get height of enemy model from centre
private var enemyH: float;

//////////////////////////////////
////////// SMOOTH MOVER //////////
//////////////////////////////////
//private var Speed : float = 0;
////This is the maximum speed that the object will achieve
//var MaxSpeed : float = 10;
////How fast will object reach a maximum speed
//var Acceleration : float = 5;
////How fast will object reach a speed of 0
//var Deceleration : float = 5;

function Start () {
	sightRange = transform.parent.transform.Find("TargetTrigger").collider.bounds.size.z / 1.5;
	//Debug.Log("TriggerRange is: " + sightRange);
	
	parent = transform.parent.gameObject;
	spawnPoint = parent.transform.position;
	wanderPos = spawnPoint;
	
	enemy = transform.parent.Find("EnemyModel");
	target = GameObject.Find("Spyro").transform;
	//Debug.Log("Target is: " + target.name);
	
	enemyH = enemy.renderer.bounds.size.y / 2;
}

////////// MAIN /////////////
function Update () {
	switch (enemyState) {
		case resetting: ;
			Debug.Log("Enemy State: Resetting");
			break;
		case wandering: ;
			Debug.Log("Enemy State: Wandering");
			break;
		case chasing: ;
			Debug.Log("Enemy State: Chasing");
			break;
		case attacking: ;
			Debug.Log("Enemy State: Attacking");
			break;
		case blocking: ;
			Debug.Log("Enemy State: Blocking");
			break;
		case dying: ;
			Debug.Log("Enemy State: Dying");
			break;
		case dead: ;
			Debug.Log("Enemy State: Dead");
			break;
		default:
			Debug.Log("Enemy State unknown");
	}

	//if (enemyState != dying && enemyState != dead) {
	if (enemyState != dead) {
		// ANIMATIONS
		switch (enemyState) {
			case resetting: ;
			case wandering: ;
			case chasing: ;
				enemy.animation.CrossFade("KnightMove");
				break;
			case attacking: ;
				enemy.animation.CrossFade("KnightAttack");
				break;
			case blocking: ;
				// If block animation is not playing
				if (!enemy.animation["KnightBlock"].enabled) {
					//Debug.Log("Block animation is not playing");
					enemy.animation.CrossFade("KnightBlock");
				}
				break;
			default:
				Debug.Log("State unknown");
		}
	
		if (distanceFrom(spawnPoint) > wanderDistance) {
			GoHome();
		} else {
			if (targetInRange && (Vector3.Distance(target.transform.position, spawnPoint) < wanderDistance)) {
				if ((distanceFromTarget() > (attackRange * 1.5))) {
					// if target is in range block
					enemyState = blocking;
				} else {
					enemyState = chasing;
				}
				
				// If obbserver is in line of sight of target
				// And target is in range
				if (isTargetVisible()) {
					//Debug.Log("Target visible");
					// If target within attack range.. attack
					if (LookAtTarget(enemy.transform, false, 0)) {					
						// Moves within attack range
						if ((distanceFromTarget() > (attackRange / 1.5))) {
							MoveTowardsTarget();
						}
						
						// Attack if appropriate
						if ((distanceFromTarget() < attackRange)) {
							Attack();
						}
					}
				} else {
					// Observer looks at target..
					// Observer looks at enemy instantly
					LookAtTarget(transform, true, 999);
					//transform.LookAt(target);
				}
			// If target is not in range
			} else {
				Wander();
			}
		}
//	} else if (enemyState == dying){
//		//Kill enemy
//		Die();
	} else if (enemyState == dead){
		rotateGem();
		// Dispose of dead
		//Destroy(parent);
	}
}

// Check is enemy is able to see target
function isTargetVisible() {
	return DrawRays(transform, fieldOfView, 5.0, 0, 0, Color.red, sightRange);
}

function DrawRays(drawOn : Transform, fov : float, interval : float, height : float, elevation : float, colour : Color, length : float) {
	// Modifiable length of ray
	if (length <= 0) {
		length = sightRange;
	} 
	
	// Create fov rays
	for (var i = -fov; i <= fov; i += interval) {
		//var direction = Quaternion.Euler(elevation, i, 0) * drawOn.transform.TransformDirection(Vector3.forward);
		var direction = Quaternion.Euler(i, 0, 0) * drawOn.transform.TransformDirection(Vector3.forward);
		var position = drawOn.transform.position + Vector3(0, height, 0);
		
		// Draw ray
		Debug.DrawRay(position, direction * length, colour);
		// If something is hit with ray
		if (Physics.Raycast(position, direction, hit, length)) { // returns true if something is hit
			// If object hit with ray is target
			if (hit.collider.gameObject.name == target.name) {
			//if (hit.collider.gameObject.name == "Spyro")
         		//Debug.Log("Target hit: " + hit.collider.gameObject.name);
         		return true;
			} else {
				Debug.Log("Enemy sees: " + hit.collider.gameObject.name);
			}
		}
	}
	
	return false;
}

// Turn towards target
function LookAtTarget(whatObject : Transform, rotateUpDn : boolean, modSpeed : float) {
	if (whatObject == parent) {
		if (enemyState != blocking) {
			enemyState = chasing;
		}
	}

	// Rotates enemy towards target at the designated speed
	 return LookAt(whatObject, target.position, rotateUpDn, modSpeed);
}

// Move towards target
function MoveTowardsTarget() {
	if (enemyState != blocking) {
		enemyState = chasing;
	}
	
	// Moves enemy towards target at the designated speed
	moveTowards(target.position);
}

// Wander in the designated range
function Wander() {
	enemyState = wandering;
	
	if (doesWander) {
			//distanceFrom(wanderPos);
			
			// If in range of wander distance
			//if (distanceFrom(spawnPoint) < wanderDistance) {
				if (distanceFrom(wanderPos) < 1) {
					if (Time.time > nextWander) {
						// Adds some randomness to wandering
						var wanderDelay = Random.Range(wanderSpeed / 1.25, wanderSpeed);
						nextWander = Time.time + wanderDelay;
						
						//Debug.Log("Wandering");
						
						var posTry = 0;
						// Checks if wanderPos is out of range of wander distance
						do {
							posTry += 1;
							
							var randX = Random.Range(-10, 10);
							var randZ = Random.Range(-10, 10);
							//Debug.Log("TryNum: " + posTry + " X:" + randX + " Z:" + randZ);
						
							//moveTowards(Vector3(randX, 1, randZ));
							wanderPos = Vector3(parent.transform.position.x + randX, parent.transform.position.y, parent.transform.position.z + randZ);
						} while (Vector3.Distance(spawnPoint, wanderPos) > wanderDistance);
					}
				} else {
					//Debug.Log("Enemy(Wander) Turing");
					// If is looking at wanderPos
					if (LookAt(parent.transform, wanderPos, false, 0)) {
						//Debug.Log("Enemy(Wander) Moving");
						// Start moving
						moveTowards(wanderPos);
					}
				}
			//}
	}
}

// Attack target
function Attack() {
	enemyState = attacking;
	
	DrawRays(enemy.transform, 15.0, 15, 0, 0, Color.blue, attackRange);

	if (Time.time > nextAttack) {
		// Adds some randomness to attacking
		var attackDelay = Random.Range(attackSpeed / 1.25, attackSpeed);
		nextAttack = Time.time + attackDelay;
		
		//Debug.Log("Attacking!");
		
		if (DrawRays(enemy.transform, 15.0, 15, 0, 0, Color.blue, attackRange)) {
			//Debug.Log("SpyroHit!");
			target.GetComponentInChildren(GoodCharacterControl).Stun();
		}
	}
}

function killEnemy() {
	//enemyState == dying;
	
	// Kill enemy
	Die();
}

function hitEnemy() {
	hitCount += 1;
	
	switch (hitCount) {
		case 1:
			popHat();
			break;
		case 2:
			popLHand();
			break;
		case 3:
			Die();
			break;
	}
}

function popLHand() {
	var enemyGO = enemy.gameObject;
	
	var armLeft : GameObject = transform.parent.Find("EnemyModel/ArmLeft").gameObject;
	
	// Change parent of parts
	//armLeft.transform.parent = Space.World;
	
	// Add rigidbody to parts
	var rbArmL : Rigidbody = armLeft.AddComponent(Rigidbody);
	
	rbArmL.mass = 1;
	
	Destroy(armLeft, 10);
}

function popHat() {
	var enemyGO = enemy.gameObject;
	var hat : GameObject = transform.parent.Find("EnemyModel/Body/Hat").gameObject;
	//hat.transform.parent = Space.World;
	
	var rbHat : Rigidbody  = hat.AddComponent(Rigidbody);
	
	rbHat.AddForce(parent.transform.position.up * 300.0);
	rbHat.AddForce(parent.transform.position.back * 300.0);
	
	rbHat.mass = 2;
	
	Destroy(hat, 10);
}

function Die() {
	enemyState = dead;
	//var enemyGO = transform.parent.gameObject.Find("EnemyModel");
	var enemyGO = enemy.gameObject;

	//Disable Model collider
	enemyGO.GetComponent(Collider).collider.enabled = false;
	enemyGO.animation.enabled = false;

	// Find model parts
//	var armLeft : GameObject = enemyGO.gameObject.Find("ArmLeft");
//	var armRight : GameObject = enemyGO.gameObject.Find("ArmRight");
//	var hat : GameObject = enemyGO.gameObject.Find("Body/Hat");
//	var body : GameObject = enemyGO.gameObject.Find("Body");
	
	var armLeft : GameObject = transform.parent.Find("EnemyModel/ArmLeft").gameObject;
	var armRight : GameObject = transform.parent.Find("EnemyModel/ArmRight").gameObject;
	var hat : GameObject = transform.parent.Find("EnemyModel/Body/Hat").gameObject;
	var body : GameObject = transform.parent.Find("EnemyModel/Body").gameObject;
	
	// Add collider to parts	
//	armLeft.AddComponent(CapsuleCollider);
//	armRight.AddComponent(CapsuleCollider);
//	hat.AddComponent(CapsuleCollider);
//	body.AddComponent(CapsuleCollider);
	
	// Change parent of parts
	armLeft.transform.parent = enemy.transform;
	armRight.transform.parent = enemy.transform;
	hat.transform.parent = enemy.transform;
	body.transform.parent = enemy.transform;
	
	// Add rigidbody to parts
	var rbArmL : Rigidbody = armLeft.AddComponent(Rigidbody);
	var rbArmR : Rigidbody  = armRight.AddComponent(Rigidbody);
	var rbHat : Rigidbody  = hat.AddComponent(Rigidbody);
	var rbBody : Rigidbody  = body.AddComponent(Rigidbody);
	
	rbHat.AddForce(parent.transform.position.up * 300.0);
	rbHat.AddForce(parent.transform.position.back * 300.0);
	
	rbArmL.mass = 1;
	rbArmR.mass = 1;
	rbHat.mass = 2;
	rbBody.mass = 3;
	
//	rbArmL.drag = 1;
//	rbArmR.drag = 1;
//	rbHat.drag = 1;
//	rbBody.drag = 1;
	
	//Spawn gem
	initGem();
	
	Destroy(parent, 5);
}

function initGem() {
	init_Gem = Instantiate(gem, parent.transform.position, Quaternion.Euler(0, 0, 0));
	//init_Gem.rigidbody.isKinematic = true;
	init_Gem.transform.animation.enabled = false;
	init_Gem.GetComponentInChildren(SpyroMagneticGems).gemValue = 50;
	
	// Fix position
	init_Gem.transform.parent = parent.transform;
	init_Gem.transform.localPosition = Vector3(0, 1.5, 0);
	init_Gem.transform.parent = null;
	
	// Twirl around target
	init_Gem.rigidbody.AddForce(Vector3.up * 50);
	init_Gem.rigidbody.AddForce(Vector3.left * 300);
	
	//init_Gem.rigidbody.isKinematic = true;
	
	init_Gem.transform.renderer.material.color = Color.blue;

	init_Gem.transform.localScale += Vector3(1.5, 0.5, 1.5);
	
	// Tilt for more attractive rotation
	init_Gem.transform.Rotate(Vector3.forward * 20, Space.World);
	//init_Gem.transform.Rotate(Vector3.right * 20, Space.World);
}

function rotateGem() {
	if (init_Gem != null) {
		Debug.Log("Rotating gem");
		
		// Slowly rotate the object around its X axis at 1 degree/second.
	    init_Gem.transform.Rotate((Vector3.up * 200) * Time.deltaTime, Space.World);
    }
}

// Return to spawn point
function GoHome() {	
	// If is not close to home
	if (distanceFrom(spawnPoint) > 1) {
		enemyState = resetting;
		
		Debug.Log("Going home!");
		// If is looking at spawn move
		if (LookAt(enemy.transform, spawnPoint, false, 0)) {
			moveTowards(spawnPoint);
		}
	// If close to home
	} else {
		Wander();
		//transform.rotation = Quaternion.Euler(0, 0, 0);
	}
}

// Return current distance from target
function distanceFromTarget() {
	return distanceFrom(target.transform.position);
}

// Returns the distance between enemy and a location
function distanceFrom(toHere  : Vector3) {
	return Vector3.Distance(parent.transform.position, toHere);
}

// Move somewhere
function moveTowards(moveHere : Vector3) {
	// Gets height of terrain at a certain point
	moveHere.y = Terrain.activeTerrain.SampleHeight(enemy.transform.position) + enemyH;
	parent.transform.position = Vector3.Lerp(parent.transform.position, moveHere, Time.deltaTime * moveSpeed);
}

// Look at something
function LookAt(whatObject : Transform, lookHere : Vector3, rotateUpDn : boolean, modSpeed : float) {
	var endRotation = Quaternion.LookRotation(lookHere - whatObject.position);
	
	//rotateUpDn = true;
	
	// Option to not look up or down
	if (!rotateUpDn){
		endRotation.x = 0;
		//endRotation.z = 0;
	}
	
	// Validation
	if (modSpeed < 1) {
		modSpeed = 1;
	}
	
	whatObject.rotation = Quaternion.Slerp(whatObject.rotation, endRotation, Time.deltaTime * (turnSpeed * modSpeed));
	
	// If looking at target within a [amount] degree radius
	if (Vector3.Angle(endRotation.eulerAngles, whatObject.rotation.eulerAngles) < 1) {
		//Debug.Log(whatObject.name + " is looking at " + lookHere);
		return true;
	} else {
		return false;
	}
}

// Turn a certain amount of degrees
function Turn(whatObject : Transform, degrees : Vector3, modSpeed : float) {
	// Validation
	if (modSpeed < 1) {
		modSpeed = 1;
	}

	var endRotation = whatObject.transform.rotation * Quaternion.Euler(degrees);
	whatObject.transform.rotation = Quaternion.Slerp(parent.transform.rotation, endRotation, Time.deltaTime * (turnSpeed * modSpeed));
	
	// If looking at target within a [amount] degree radius
	if (Vector3.Angle(endRotation.eulerAngles, whatObject.transform.rotation.eulerAngles) < 1) {
		return true;
	} else {
		return false;
	}
}

function isDying() {
	return enemyState == dying;
}

function isBlocking() {
	return enemyState == blocking;
}

function isAttacking() {
	return enemyState == attacking;
}

function changeState(state : int) {
	enemyState = state;
}

function setTargetIsInRange(inRange : boolean) {
	targetInRange = inRange;	
}