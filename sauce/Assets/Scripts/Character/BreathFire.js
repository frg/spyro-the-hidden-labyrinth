#pragma strict
//var player : GameObject;
var fireBreath : GameObject;
var fire_duration = 1.0;
var fadeOut_step = 0.06;
var fadeOut_delay = 0.6;
var height = 1.0;
var distance = 1.0;

private var init_fireBreath : GameObject;
private var startFadeOut = false;
private var timer = 0.0;
private var timer_isActive = false;

function Start () {
	//init_fireBreath = Instantiate(fireBreath, transform.position, transform.rotation);
	//player = GameObject.Find("Spyro");
}

function Update () {
	var playerScript = transform.root.GetComponentInChildren(GoodCharacterControl);

	if (playerScript.isControllable) {
		// If left mouse click and not charging
		if (Input.GetMouseButtonDown(0) && !Input.GetMouseButton(1)){
			//Debug.Log("Mouse Down");
			// Wait until animation has stopped && character is not stunned
			if (init_fireBreath == null && !playerScript.isStunned) {
				breathFire();
				//GameObject.Find("SpyroAllAnimations").animation.Play("fireAnimation",PlayMode.StopAll);
				
				playerScript.characterState = playerScript.firing;
			}
			
		}
	}
	
	if (fadeOut_delay < fire_duration) {
		if (init_fireBreath != null) {
			if (startFadeOut) {
				incrementTimer();
				//Debug.Log("Timer: " + timer);
				
				if (timer >= fadeOut_delay) {
					pauseTimer();
					fadeOut();
				}
			}
		} else {
			startFadeOut = false;
			stopTimer();
		}
	} else {
		Debug.Log("##ERROR: fadeOut_delay > fire_duration");
	}
}

function breathFire() {
	//Debug.Log("Breathing Fire!!");
	initFire();
	Destroy(init_fireBreath, fire_duration);
	startFadeOut = true;
	startTimer();
}

function initFire(){
	init_fireBreath = Instantiate(fireBreath, transform.position, transform.rotation);
	//init_fireBreath.tag = "Fire";
	init_fireBreath.transform.parent = transform;
	init_fireBreath.transform.localRotation = Quaternion.Euler(0, 0, 0);
	init_fireBreath.transform.localPosition = Vector3(0, height, distance);
}

function fadeOut() {
	var fbTrans = init_fireBreath.transform;
	var fireArr = Array(fbTrans.Find("FireBall0").transform, fbTrans.Find("FireBall1").transform, fbTrans.Find("FireBall2").transform, fbTrans.Find("FireBall3").transform, fbTrans.Find("FireBall4").transform, fbTrans.Find("FireBall5").transform);

	for (var fb : Transform in fireArr) {
		fb.Find("InnerCore").particleEmitter.maxEnergy -= fadeOut_step;
		fb.Find("OuterCore").particleEmitter.maxEnergy -= fadeOut_step;
		fb.Find("Lightsource").light.intensity -= fadeOut_step / 1.5;
		fb.Find("Smoke").particleEmitter.maxEnergy -= fadeOut_step / 2.5;
	}
}

function startTimer() {
	timer_isActive = true;
}

function incrementTimer() {
	if (timer_isActive) {
		timer += 1.0F * Time.deltaTime;
	}
}

function pauseTimer() {
	timer_isActive = false;
}

function stopTimer() {
	pauseTimer();
	timer = 0;
}