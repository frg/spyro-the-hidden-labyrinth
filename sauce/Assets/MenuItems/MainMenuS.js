#pragma strict
var openingMusic : AudioClip;


var spyroTitle : GameObject;
//var startTime : float;
//var animationTime : float = 1.633;
//var DropTitle : AnimationClip;
//var TurnTitle : AnimationClip;


function Start () {
//startTime = Time.time;

Time.timeScale = 1.0f;

audio.Play();

//spyroTitle.animation["DropTitle"].wrapMode= WrapMode.Once;
//spyroTitle.animation["TurnTitle"].wrapMode= WrapMode.PingPong;
//animation.Play("DropTitle",PlayMode.StopAll);
Debug.Log("started n");
animation.Play("DropTitle",PlayMode.StopAll);
animation.PlayQueued("TurnTitle",QueueMode.CompleteOthers);
}

	

//function Update () {
//
//if (Time.time > (startTime + animationTime))
//{
//	animation.Play("TurnTitle",PlayMode.StopAll);
//	
//
//}
//}

