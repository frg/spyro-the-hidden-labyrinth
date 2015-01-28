#pragma strict
var rotSpace : Space = Space.Self;
var rotDirection : Vector3 = Vector3.right;
var rotSpeed : float = 5;

function Start () {

}

function Update () {
	rotateObject();
}

function rotateObject() {
	// rotSpace = Space.World;
	transform.Rotate((rotDirection * rotSpeed) * Time.deltaTime, rotSpace);
}