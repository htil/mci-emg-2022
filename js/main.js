/** Main class used to manage the WebHRI App.
 * @class
 */
var Main = function () {
  //ROS
  //window.ros = new ROS()

  //Baxter
  //this.baxter = new Baxter()
  //vid = new Video()
  //speech = new Speech()
  //window.pan = this.baxter.updateHeadPan

  //Visualizers
  //this.visualizer = new Vis()

  this.blocklyInterface = new BlocklyInterface();
  this.runButton = document.getElementById("runButton");

  /*
    window.Device = new BCIDevice({
		dataHandler: data => {
            console.log(data);
			data.data.forEach(el => {
				if (buffer.length > BUFFER_SIZE) buffer.shift();
				buffer.push(el);
			});

			if (buffer.length < BUFFER_SIZE) return;

			let psd = window.bci.signal.getPSD(BUFFER_SIZE, buffer);

			let alpha = window.bci.signal.getBandPower(BUFFER_SIZE, psd, 256, "alpha");
			let beta  = window.bci.signal.getBandPower(BUFFER_SIZE,psd, 256, "beta");
			let theta = window.bci.signal.getBandPower(BUFFER_SIZE,psd, 256, "theta");
			let gamma = window.bci.signal.getBandPower(BUFFER_SIZE,psd, 256, "gamma");
			let engagement = beta / (alpha + theta);
			let sum = alpha + beta + theta + gamma;

			let w_alpha = alpha / sum;
			let w_beta = beta / sum;
			let w_theta = theta / sum;
			let w_gamma = gamma / sum;

			if (weighted.alpha < 0) {
				weighted.alpha = w_alpha || 0;
				weighted.beta = w_beta || 0;
				weighted.theta = w_theta || 0;
				weighted.gamma = w_gamma || 0;
				weighted.engagement = engagement || 0;
			} else {
				weighted.alpha = weighted.alpha * WEIGHT + (w_alpha || 0) * (1 - WEIGHT);
				weighted.beta =  weighted.beta  * WEIGHT + (w_beta  || 0)  * (1 - WEIGHT);
				weighted.theta = weighted.theta * WEIGHT + (w_theta || 0) * (1 - WEIGHT);
				weighted.gamma = weighted.gamma * WEIGHT + (w_gamma || 0) * (1 - WEIGHT);
				weighted.engagement = weighted.engagement * WEIGHT + (engagement || 0) * (1 - WEIGHT);
			}

			// if (window.gameInstance.__ready == true) {
			// 	// window.gameInstance.SendMessage("Drone", "SetSpeed", (weighted.gamma/weighted.alpha));
			// 	dataManager.bands = weighted;
			// 	// console.log((weighted.gamma/weighted.alpha));

			// 	// document.getElementById("pre-start").style.display = "none";
			// 	// document.getElementById("footer").style.display = "flex";
			// }
		},
		statusHandler: status => {
			console.log(status)
		},
		connectionHandler: connected => {
			if (!connected) {
				alert("Device connection lost. Please reconnect.")
				window.location.reload()
			}
		}
	});

    */

  /*
	let connect = async() => {
		try {
			await window.Device.connect();
			// Plot data
			// window.gameInstance = UnityLoader.instantiate("gameContainer", "Build/bdr-simulator.json", {onProgress: UnityProgress, Module: {
			// 	onRuntimeInitialized: function () {
			// 		UnityProgress(gameInstance, "complete");
			// 		window.gameInstance.__ready = true;
			// 	},
			// }});
		} catch (e) {
			console.log("connect/load error. retrying...");
			connect();
		}
	} */

  $("#connect").on("click", () => {
    //connect();
  });

  this.createEventListener = function (id, callback) {
    document.getElementById(id).onclick = callback;
  };

  this.handleEvents = function () {
    this.createEventListener("runButton", window.runBlockCode);
    this.createEventListener("stopButton", this.stopProgram);
  };

};

Main.prototype.stopProgram = function(){
  window.resetPhaser();
  window.resetInterpreter();
}

Main.prototype.start = function () {
  //window.ros.init()
  this.blocklyInterface.init();
  this.handleEvents();
  //this.visualizer.start()
  //this.baxter.updateFace("Happy", "SW", "White")
  //this.baxter.updateHeadPan(0.0)
};

updateDisplay = function (doc, config) {
  let rawGraph = doc.getElementById("rawGraph");
  let psdGraph = doc.getElementById("psdGraphHolder");
  let bpGraph = doc.getElementById("bandPower");
  let videoHolder = doc.getElementById("videoHolder");
  let speechHolder = doc.getElementById("speechHolder");
  rawGraph.style.display = config.rawGraph;
  bpGraph.style.display = config.bpGraph;
  psdGraph.style.display = config.psdGraph;
  videoHolder.style.display = config.videoHolder;
  speechHolder.style.display = config.speechHolder;
};

setEditor = function (doc, mode) {
  let blocklyDiv = doc.getElementById("blocklyDiv");
  let textCode = doc.getElementById("textCode");
  if (mode == "text") {
    blocklyDiv.style.display = "none";
    textCode.style.display = "block";
  } else {
    blocklyDiv.style.display = "block";
    textCode.style.display = "none";
  }
};

// Wait until document is finished loading before starting App
$(document).ready(function () {
  console.log("LOADED MAIN");
  var main = new Main();
  main.start();
  //vid.start()
  //speech.recognizeSpeech()

  // updateDisplay(document, {
  //     psdGraph: "inline",
  //     bpGraph: "none",
  //     rawGraph: "none",
  //     videoHolder: "none",
  //     speechHolder: "none"
  // })

  // // Event
  // $("#rawEEG").click((e) => {
  //     updateDisplay(document, {
  //         psdGraph: "none",
  //         bpGraph: "none",
  //         rawGraph: "inline",
  //         videoHolder: "none",
  //         speechHolder: "none"
  //     })
  // })

  // $("#psd").click((e) => {
  //     updateDisplay(document, {
  //         psdGraph: "inline",
  //         bpGraph: "none",
  //         rawGraph: "none",
  //         videoHolder: "none",
  //         speechHolder: "none"
  //     })
  // })

  // $("#bandpower").click((e) => {
  //    updateDisplay(document, {
  //         psdGraph: "none",
  //         bpGraph: "inline",
  //         rawGraph: "none",
  //         videoHolder: "none",
  //         speechHolder: "none"
  //     })
  // })

  // $("#camera").click((e) => {
  //     updateDisplay(document, {
  //          psdGraph: "none",
  //          bpGraph: "none",
  //          rawGraph: "none",
  //          videoHolder: "inline",
  //          speechHolder: "none"
  //      })
  //  })

  //  $("#speech").click((e) => {
  //     updateDisplay(document, {
  //         psdGraph: "none",
  //         bpGraph: "none",
  //         rawGraph: "none",
  //         videoHolder: "none",
  //         speechHolder: "inline"
  //     })
  //  })

  $("#textfile").click((e) => {
    console.log("want text");
    setEditor(document, "text");
    window.editorMode = "text";
  });

  $("#blockFile").click((e) => {
    setEditor(document, "block");
    window.editorMode = "block";
  });
});
