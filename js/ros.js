/** Class used to manage ROS server connections
 * @class
*/
var ROS = function(){
    
    this.rbServer =  new ROSLIB.Ros({
        url : 'ws://192.168.1.17:9090'
     });
     
     this.onConnect = () => { console.log("ROS Connected") }

     this.onError = () => { console.log("ROS Connection Error") }

     this.onClose = () => { console.log("ROS Connection Closed") }

}

/** Handle ROS Bridge Server events
 * @function
*/
ROS.prototype.init = function(){

    // This function is called upon the rosbridge connection event
    this.rbServer.on('connection', this.onConnect);

    // This function is called when there is an error attempting to connect to rosbridge
    this.rbServer.on('error', this.onError);

    // This function is called when the connection to rosbridge is closed
    this.rbServer.on('close', this.onClose);
}


/** Sends message to rostopic
 * @function
*/
ROS.prototype.sendMsg = function(topicName, type, msg){
    var cmd = new ROSLIB.Topic({
        ros : this.rbServer,
        name : topicName,
        messageType : type
    });

    var package = new ROSLIB.Message({
        data : msg
    });

    cmd.publish(package);
}