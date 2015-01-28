#pragma strict
private var target : GameObject;
var sparkles : GameObject;
private var init_sparkles : GameObject;

// Timer vars
private var endDelayTime = 0.0;
private var startTimer = false;
private var attractTimer = 0.0;

var attractionDelay = 0.0;

var gemValue = 10;
//var sparkle_duration = 0.3;
var sparkleH = 2;
//var message : String;
var force = 200;
var forceL = 10;
var forceU = 10;
//var radius : double;
var eat = 0.5;

//static var isEatable = false;
private var isTriggered = false;
private var sheduleDestroy = false;
private var sparkleTime : float;
//private var init_sparkles : GameObject;
private var timer = 1.0;

function Start(){	
	target = GameObject.Find("Spyro");
	
	//Debug.Log("Gem Target is: " + target.name);
}

//function OnTriggerEnter (myTrigger : Collider) {
//	Debug.Log("Gem Collided with: " + myTrigger.gameObject.name);
//	if(myTrigger.gameObject.name == target.name){
//		isTriggered = true;
//		//transform.parent.collider.isTrigger = true;
//
//		// Upward force to gem
//		push(Vector3.up * forceU);
//		// Sidways put to initiate twirl
//		push(Vector3.left * forceL);
//		//Debug.Log(message);
//	}
//}

function OnTriggerEnter (myTrigger : Collider) {
	//Debug.Log("Gem Collided with: " + myTrigger.gameObject.name);
	if(myTrigger.gameObject.name == target.name && !isTriggered && !transform.parent.rigidbody.isKinematic){
		isTriggered = true;
		startAttractionTimer();
		
		//transform.parent.collider.isTrigger = true;

		// Upward force to gem
		push(Vector3.up * forceU);
		// Sidways put to initiate twirl
		push(Vector3.left * forceL);
		//Debug.Log(message);
	}
}

function Update(){
	if (sheduleDestroy) {
		destroy();
	} else {
		if (startTimer) {
			attractTimer += Time.deltaTime;
			
			if (attractTimer > endDelayTime) {
				isTriggered = true;
				stopAttractionTimer();
			}
		}
		
		if (isTriggered && !transform.parent.rigidbody.isKinematic) {
			timer += Time.deltaTime;
			
			Physics.IgnoreCollision(target.collider, transform.parent.collider);
		
			// Check distance from target
			var distance = Vector3.Distance(target.transform.position, transform.parent.transform.position);
			
			if (distance < eat) {
			//if (isEatable) {
				animateDestroy();
			} else {
				transform.LookAt(target.transform);
			
	//			// Direction
	//			var heading = target.transform.position - transform.position;
	//			// Distance Vector3
	//			var distanceV3 = heading.normalized / heading.magnitude;
	//			// Adds exponential force
	//			push(force * distanceV3);
	//		}
			
				//transform.parent.transform.LookAt(target.transform.parent.transform);
				var direction = (target.transform.position + (target.transform.up * 1.1)) - transform.parent.transform.position;
				direction.Normalize();
				//push(Vector3.left * (distance * forceL));
				//push(Vector3.left * forceL);
				transform.parent.transform.LookAt(target.transform);
				//push(force * (timer) * (direction * distance));
				push(Mathf.Sqrt(timer*2) *  ((direction * distance) * force));
				push(Vector3.left * force * 2);
			}
		}
	}
}

function push(pushIndex : Vector3){
	transform.parent.gameObject.rigidbody.AddForce(pushIndex);
}

function animateDestroy() {
	// Changes sparkle color depending on gem color
	var gemColor = transform.parent.renderer.material.color;
	//Debug.Log("Sparkle Color: " + gemColor);
	
	// COLOR TEST!
//	var leaderBoardGuiTxt = GameObject.Find("LeaderBoard");
//	leaderBoardGuiTxt.guiText.material.color = gemColor;
	
//	//var sparks = sparkles.GetComponentsInChildren(ParticleEmitter);
//	var sparklesChildren = sparkles.GetComponentsInChildren(Transform);
//	//Debug.Log("Sparks length: " + sparkles.transform.childCount);
//	for (var child : Transform in sparklesChildren) {
//	    //if(child.gameObject.GetComponent(MeshRenderer)){
//	    	Debug.Log("Sparks color before: " + child.renderer.material.color);
//	       child.renderer.material.color = gemColor;
//	       Debug.Log("Sparks color after: " + child.renderer.material.color);
//	    //}    
//	}
	
//	for (var i = 1; i < sparkles.transform.childCount; i++) {
//		Debug.Log("Sparks color before: " + sparkles.t.renderer.material.color);
//		sparks[i].renderer.material.color = gemColor;
//		Debug.Log("Sparks color after: " + sparks[i].renderer.material.color);
//	}

	// Play vanish sparkles
	init_sparkles = Instantiate(sparkles, target.transform.position, target.transform.rotation);
	var sparksArr = Array(init_sparkles.Find("GemVanishSparkle0"), init_sparkles.Find("GemVanishSparkle1"), init_sparkles.Find("GemVanishSparkle2"), init_sparkles.Find("GemVanishSparkle3"), init_sparkles.Find("GemVanishSparkle4"));
	for (var sr : GameObject in sparksArr) {
		//sr.transform.renderer.material.color = gemColor;
		sr.transform.renderer.material.SetColor("_TintColor", gemColor);
	}
	
	
	init_sparkles.transform.parent = target.transform;
	init_sparkles.transform.localPosition = Vector3(0, sparkleH, 0);
	
	// Add gem score
	target.GetComponentInChildren(ScoreKeeper).addGemScore(gemValue);
	// Hide gem
	transform.parent.renderer.enabled = false; //gameObject.SetActive(false);
	transform.parent.collider.isTrigger = true;
	//transform.parent.rigidbody.active = false;
	transform.parent.gameObject.SetActive(false);
	
	// Schedule object to be destroyed
	sheduleDestroy = true;
	Destroy(init_sparkles, 1);
}

function destroy(){
	Debug.Log("Destroyed Gem");
	//Destroy(init_sparkles);
	Destroy(transform.parent.gameObject);
}

function startAttractionTimer() {
	startTimer = true;
	endDelayTime = Time.time + attractionDelay;
}

function stopAttractionTimer() {
	startTimer = false;
}