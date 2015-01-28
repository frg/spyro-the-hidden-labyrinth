// Require a character controller to be attached to the same game object
@script RequireComponent(CharacterController)
var stunStars : GameObject;
private var initStunStars : GameObject;

public var walkMaxAnimationSpeed : float = 20;
public var trotMaxAnimationSpeed : float = 1.0;
public var chargeMaxAnimationSpeed : float = 1.0;
public var jumpAnimationSpeed : float = 1.15;
public var fallAnimationSpeed : float = 1.0;
public var attackAnimationSpeed : float = 1.0;

//// States ////
private	var idle = 0;
private	var walking = 1;
private	var trotting = 2;
static var charging = 3;
private	var jumping = 4;
private	var gliding = 5;
static var stunned = 6;
static var firing = 7;

static var characterState : int;
static var isStunned = false;

// The speed when walking
var walkSpeed = 2.0;
// after trotAfterSeconds of walking we trot with trotSpeed
var trotSpeed = 4.0;
// when pressing "Fire3" button (cmd) we start charging
var chargeSpeed = 6.0;

private var walkSpeedCopy : float;
private var trotSpeedCopy : float;
private var chargeSpeedCopy : float;

var inAirControlAcceleration = 3.0;

// How high do we jump when pressing jump and letting go immediately
var jumpHeight = 0.5;
private var jumpHeightCopy : float;

//Speed when gliding
var glideSpeed = 10.0;

// The gravity for the character
var normalGravity = 20.0;
var glideGravity = 5.0;

// The gravity in controlled descent mode
var speedSmoothing = 10.0;
var rotateSpeed = 500.0;
var trotAfterSeconds = 3.0;

var canJump = true;

private var jumpRepeatTime = 0.05;
private var jumpTimeout = 0.15;
private var groundedTimeout = 0.25;

var stunDuration = 2.0;
var stunFactor = 5;
private var stunFinish = 0.0;

// The camera doesnt start following the target immediately but waits for a split second to avoid too much waving around.
private var lockCameraTimer = 0.0;

// The current move direction in x-z
private var moveDirection = Vector3.zero;
private var targetDirection : Vector3;

// The current vertical speed
private var verticalSpeed = 0.0;
// The current x-z move speed
private var moveSpeed = 0.0;
private var targetSpeed : float;

// The last collision flags returned from controller.Move
private var collisionFlags : CollisionFlags; 

// Are we jumping? (Initiated with jump button and not grounded yet)
private var isJumping = false;
private var jumpingReachedApex = false;

// Are we moving backwards (This locks the camera to not do a 180 degree spin)
private var movingBack = false;
// Is the user pressing any keys?
private var isMoving = false;
// When did the user start walking (Used for going into trot after a while)
private var walkTimeStart = 0.0;
// Last time the jump button was clicked down
private var lastJumpButtonTime = -10.0;
// Last time we performed a jump
private var lastJumpTime = -1.0;
//last time the user fired
private var lastFired = -1.0;

// the height we jumped from (Used to determine for how long to apply extra jump power after jumping.)
private var lastJumpStartHeight = 0.0;

private var inAirVelocity = Vector3.zero;
private var lastGroundedTime = 0.0;
private var gravity = normalGravity;
static var isControllable = true;

var isPlayerSFXaudible = true;
// SOUND!
var fireSFX: AudioClip;
var stunSFX: AudioClip;
var chargeSFX: AudioClip;
var jumpSFX: AudioClip;
var bumpSFX: AudioClip;
// Walk on terrain
var grassWalk1SFX: AudioClip;
var grassWalk2SFX: AudioClip;
var grassWalk3SFX: AudioClip;
// Walk on other
var otherWalk1SFX: AudioClip;
var otherWalk2SFX: AudioClip;
var otherWalk3SFX: AudioClip;

private var soundObject : GameObject;

function Start() {
	// Resetting static vars on load
	setControllable(true);
	characterState = idle;
	isStunned = false;
}

function Awake (){
	moveDirection = transform.TransformDirection(Vector3.forward);
}

function Update() {
	if (isStunned) {
		cureStun();
	}

	switch(characterState){
		// idle animation
		case 0: GameObject.Find("SpyroAllAnimations").animation.CrossFade("idleAnimation");
		break;
		
		// walking animation
		case 1: GameObject.Find("SpyroAllAnimations").animation.CrossFade("walkAnimation");
		break;
		
		//	trotting
		// uses walking animation
		case 2: GameObject.Find("SpyroAllAnimations").animation.CrossFade("walkAnimation");
		break;
		
		// charging animation
		case 3: GameObject.Find("SpyroAllAnimations").animation.CrossFade("runAnimation");
			PlaySound(chargeSFX.name, chargeSFX, transform);
		break;
		
		// jumping animation
		case 4: GameObject.Find("SpyroAllAnimations").animation.CrossFade("jumpPoseAnimation");
			characterState = gliding;  // Change state to avoid looping jumpPoseAnimation
			PlaySound(jumpSFX.name, jumpSFX, transform);
		break;
		
		//	gliding animation
		case 5: GameObject.Find("SpyroAllAnimations").animation.CrossFade("glideAnimation");
		break;
		
		//	stun animation
		case 6: GameObject.Find("SpyroAllAnimations").animation.CrossFade("stunAnimation");
			PlaySound(stunSFX.name, stunSFX, transform);
		break;
		
		// Attack animation
		case 7: GameObject.Find("SpyroAllAnimations").animation.CrossFade("fireAnimation");
			PlaySound(fireSFX.name, fireSFX, transform);
		break;
		
		// idle animation
		default: GameObject.Find("SpyroAllAnimations").animation.CrossFade("idleAnimation");
		break;
	}
	
	UpdateSmoothedMovementDirection();
	
	// Apply gravity
	// - extra power jump modifies gravity
	// - controlledDescent mode modifies gravity
	ApplyGravity ();
	
	// Apply jumping logic
	Applyjumping ();
	
	//Apply gliding Logic
	Applygliding();
	
	// Calculate actual motion
	var movement = moveDirection * moveSpeed + Vector3 (0, verticalSpeed, 0) + inAirVelocity;
	movement *= Time.deltaTime;
	
	// Move the controller
	var controller : CharacterController = GetComponent(CharacterController);
	collisionFlags = controller.Move(movement);
	
	
	// Set rotation to the move direction
	if (IsGrounded()){
		transform.rotation = Quaternion.LookRotation(moveDirection);
	}else{
		var xzMove = movement;
		xzMove.y = 0;
		
		if (xzMove.sqrMagnitude > 0.001){
			transform.rotation = Quaternion.LookRotation(xzMove);
		}
	}	
	
	// We are in jump mode but just became grounded
	if (IsGrounded()){
		lastGroundedTime = Time.time;
		inAirVelocity = Vector3.zero;
		
		if (isJumping){
			isJumping = false;
			SendMessage("DidLand", SendMessageOptions.DontRequireReceiver);
		}
	}

	if (!isControllable){
		// kill all inputs if not controllable.
		Input.ResetInputAxes();
	}
	
	if (Input.GetButtonDown ("Jump")){
		lastJumpButtonTime = Time.time;
	}
}

// If hit wall while charging
function OnTriggerEnter(hit: Collider)	{
	//Debug.Log("Hit tag: " + hit.gameObject.tag);
	if (characterState == charging) {
		if (hit.gameObject.tag == "Terrain" || hit.gameObject.tag == "Object") {
			Stun();
		}
	}
}

function Stun() {
	if (Time.time > stunFinish) {
		Debug.Log("Stun start");
		isStunned = true;
		stunFinish = Time.time + stunDuration;
		
		// Preserve speeds
		walkSpeedCopy = walkSpeed;
		trotSpeedCopy = trotSpeed;
		chargeSpeedCopy = chargeSpeed;
		jumpHeightCopy = jumpHeight;
		//characterStateCopy = characterState;
		
		walkSpeed = walkSpeed / stunFactor;
		trotSpeed = trotSpeed / stunFactor;
		chargeSpeed = chargeSpeed / stunFactor;
		jumpHeight = jumpHeight / (stunFactor * 2);
		
		initStunStars = Instantiate(stunStars, transform.position, transform.rotation);
		initStunStars.transform.parent = transform;
		initStunStars.transform.localPosition = Vector3(0, -2.75, 0);
		
		characterState = idle;
		
		PlaySound(stunSFX.name, stunSFX, transform);
	}
	
	//star = Instantiate(Stars, gameObject.transform.position, Quaternion.identity) ;
	//Destroy(star, 2);
}

function cureStun() {
	if (Time.time > stunFinish) {
		Debug.Log("Stun end");
		isStunned = false;
			
		walkSpeed = walkSpeedCopy;
		trotSpeed = trotSpeedCopy;
		chargeSpeed = chargeSpeedCopy;
		jumpHeight = jumpHeightCopy;
		
		Destroy(initStunStars);
		
		//characterState = characterStateCopy;
		characterState = idle;
	}
}

// Turning right/left
function UpdateSmoothedMovementDirection(){
	var cameraTransform = Camera.main.transform;
	var grounded = IsGrounded();
	
	// Forward vector relative to the camera along the x-z plane	
	var forward = cameraTransform.TransformDirection(Vector3(0,0,1));
	forward.y = 0;
	forward = forward.normalized;

	// Right vector relative to the camera
	// Always orthogonal to the forward vector
	var right = Vector3(forward.z, 0, -forward.x);

	var v = Input.GetAxisRaw("Vertical");
	var h = Input.GetAxisRaw("Horizontal");

	// Are we moving backwards or looking backwards
	if (v < -0.2) {
		movingBack = true;
	} else {
		movingBack = false;
	}
	
	var wasMoving = isMoving;
	isMoving = Mathf.Abs (h) > 0.1 || Mathf.Abs (v) > 0.1;
		
	// Target direction relative to the camera
	targetDirection = h * right + v * forward;
	
	// Grounded controls
	if (grounded)
	{
		// Lock camera for short period when transitioning moving & standing still
		lockCameraTimer += Time.deltaTime;
		if (isMoving != wasMoving)
			lockCameraTimer = 0.0;

		// We store speed and direction seperately,
		// so that when the character stands still we still have a valid forward direction
		// moveDirection is always normalized, and we only update it if there is user input.
		if (targetDirection != Vector3.zero)
		{	
			// if is moving backwards.. SNAP!
			if (movingBack) {
				moveDirection = targetDirection.normalized;
			} else 
			// If we are really slow, rotation is more precise (slower)
			if (moveSpeed < walkSpeed * 0.9 && grounded)
			{
				//moveDirection = targetDirection.normalized;
				moveDirection = Vector3.RotateTowards(moveDirection, targetDirection, rotateSpeed / 2 * Mathf.Deg2Rad * Time.deltaTime, 1000);
				moveDirection = moveDirection.normalized;
			}
			// Otherwise smoothly turn towards it
			else
			{
				moveDirection = Vector3.RotateTowards(moveDirection, targetDirection, rotateSpeed * Mathf.Deg2Rad * Time.deltaTime, 1000);
				moveDirection = moveDirection.normalized;
			}
		}
		
		// Smooth the speed based on the current target direction
		var curSmooth = speedSmoothing * Time.deltaTime;
		
		// Choose target speed
		//* We want to support analog input but make sure you cant walk faster diagonally than just forward or sideways
		targetSpeed = Mathf.Min(targetDirection.magnitude, 1.0);
	
		characterState = idle;
		
		// Pick speed modifier
		// if left mouse click
		if (Input.GetMouseButton(1) && !isStunned && IsMoving())
		{
			targetSpeed *= chargeSpeed;
			characterState = charging;
		}
		else if (Time.time - trotAfterSeconds > walkTimeStart)
		{
			targetSpeed *= trotSpeed;
			characterState = trotting;
		}
		else if (Input.GetKey("w") || Input.GetKey("s") || Input.GetKey(KeyCode.UpArrow) || Input.GetKey(KeyCode.DownArrow))
		{
			targetSpeed *= walkSpeed;
			characterState = walking;
		} else {
			
		}
		
		moveSpeed = Mathf.Lerp(moveSpeed, targetSpeed, curSmooth);
		
		// Reset walk time start when we slow down
		if (moveSpeed < walkSpeed * 0.3)
			walkTimeStart = Time.time;
	// In air controls
	} else {
		// Lock camera while in air
		if (isJumping)
			lockCameraTimer = 0.0;

		if (isMoving)
			inAirVelocity += targetDirection.normalized * Time.deltaTime * inAirControlAcceleration;
	}
}

//Allows the player to glide
function Applygliding() {
	if (isJumping && Input.GetButton("Jump") && jumpingReachedApex && !isStunned){
		gravity = glideGravity;
		moveSpeed = glideSpeed;
	}else{
		gravity = normalGravity;
	}
}

// Check if player is able to jump after last jump
function Applyjumping (){
	// Prevent jumping too fast after each other
	if (lastJumpTime + jumpRepeatTime > Time.time)
		return;

	//if (IsGrounded()) {
	if (!isJumping) {
		// Jump
		// - Only when pressing the button down
		// - With a timeout so you can press the button slightly before landing		
		if (canJump && Time.time < lastJumpButtonTime + jumpTimeout) {
			verticalSpeed = CalculateJumpVerticalSpeed (jumpHeight);
			SendMessage("DidJump", SendMessageOptions.DontRequireReceiver);
		}
	}
}

// If not grounded player falls
function ApplyGravity (){
	if (isControllable){	// don't move player at all if not controllable.
		// Apply gravity
		var jumpButton = Input.GetButton("Jump");
		
		
		// When we reach the apex of the jump we send out a message
		if (isJumping && !jumpingReachedApex && verticalSpeed <= 0.0)
		{
			jumpingReachedApex = true;
			SendMessage("DidJumpReachApex", SendMessageOptions.DontRequireReceiver);
		}
	
		if (IsGrounded ())
			verticalSpeed = 0.0;
		else
			verticalSpeed -= gravity * Time.deltaTime;
	}
}

function CalculateJumpVerticalSpeed (targetJumpHeight : float){
	// From the jump height and gravity we deduce the upwards speed 
	// for the character to reach at the apex.
	return Mathf.Sqrt(2 * targetJumpHeight * gravity);
}

// If is jumping and reached apex
function DidJump (){
	isJumping = true;
	jumpingReachedApex = false;
	lastJumpTime = Time.time;
	lastJumpStartHeight = transform.position.y;
	lastJumpButtonTime = -10;
	
	characterState = jumping;
}

function GetSpeed () {
	return moveSpeed;
}

function IsGrounded () {
	return (collisionFlags & CollisionFlags.CollidedBelow) > 0.1;
}

function GetDirection () {
	return moveDirection;
}

function IsMovingBackwards () {
	return movingBack;
}

function GetLockCameraTimer () {
	return lockCameraTimer;
}

function IsTurning() {
	return (targetDirection != Vector3.zero);
}

// Checks if Moving ..and if turning
function IsMoving () {
	// Value was: > 0.5
	return (Mathf.Abs(Input.GetAxisRaw("Vertical")) + Mathf.Abs(Input.GetAxisRaw("Horizontal")) > 0.5);
}

function HasJumpReachedApex (){
	return jumpingReachedApex;
}

function IsGroundedWithTimeout (){
	return lastGroundedTime + groundedTimeout > Time.time;
}

function setControllable(controllable : boolean) {
	isControllable = controllable;
}

function PlaySound(soundName : String, sound : AudioClip, parent : Transform) {
	if (isPlayerSFXaudible) {
		var sfxGO : GameObject = gameObject.Find("/Spyro/" + soundName);
		if (sfxGO) {
			//Destroy(sfxGO);
	    } else {
	 //		var soundGO = GameObject.Find("Temporary GameObject (Sound)");
	//		Destroy(soundGO);
	
			//soundObject = new GameObject("Temporary GameObject (Sound)");
			soundObject = new GameObject(soundName);
			
			var soundSource = soundObject.AddComponent(AudioSource); 
		    soundSource.clip = sound; 
		    soundSource.volume = 1.5; 
		    soundSource.pitch = 1.0;
		    soundObject.transform.parent = parent;
		    soundObject.transform.position = parent.position;
		    soundSource.Play();
		    Destroy(soundObject, sound.length + 0.0);
	    }
    }
}