/** Class used to manage Baxter 
 * @class
*/
var Baxter = function(){
    this.ros = window.ros
    this.headAngle = 0
    this.emotions = ["Afraid", "Confused", "Happy", "Joy", "Neutral", "Reactive", "Sad", "Sassy", "Silly", "Sleep", "Surprise", "Worried"]
    this.colors = ["Blue", "Gray", "Green", "Orange", "Purple", "Red", "White", "Yellow"]
    this.positions = ["NE", "SE", "SW", "NW", "Open", "Closed", ""]
    this.face = {
        emotion: "Happy",
        color: "White",
        position: ""
    }
}

/** Updates Baxter's face
 * @function
*/
window.updateFace = function(emotion, position, color) {
    let img = emotion + position + color + ".jpg"
    this.ros.sendMsg("/web_face", 'std_msgs/String', img)
}

/** Updates Baxter's pan
 * @function
*/
Baxter.prototype.updateHeadPan = function(cmd) {
    this.ros.sendMsg("/web_pan", 'std_msgs/Float32', cmd)
}