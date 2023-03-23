/** Class used to manage Blockly interface
 * @class
 */

var BlocklyInterface = function () {
  // Handle custom block creation
  createCustomBlocks();
  const printVal = document.querySelector("#printVal");

  // UI Elements
  //this.runButton = document.getElementById('runButton');

  window.interpreter = null;
  window.runner = null;
  window.latestCode = "";
  window.editorMode = "block";
  window.highlightPause = false;

  window.workspace = Blockly.inject("blocklyDiv", {
    media: "https://unpkg.com/browse/blockly/media/",
    toolbox: document.getElementById("toolbox"),
  });

  Blockly.Xml.domToWorkspace(
    document.getElementById("startBlocks"),
    window.workspace
  );

  // Exit is used to signal the end of a script.
  Blockly.JavaScript.addReservedWords("exit");

  // Clear interpreter
  window.resetInterpreter = function () {
    window.interpreter = null;
    window.workspace.highlightBlock(null);
    if (window.runner) {
      clearTimeout(window.runner);
      window.runner = null;
    }
  };

  window.generateCodeAndLoadIntoInterpreter = function () {
    Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
    Blockly.JavaScript.addReservedWords('highlightBlock');
    window.latestCode = Blockly.JavaScript.workspaceToCode(window.workspace);
    let xml = Blockly.Xml.workspaceToDom(window.workspace);
    console.log(xml);

    // sync code. comment to stop synching
    window.textEditor.setValue(window.latestCode);
    //this.runButton = ''
  };

  // Add native to blockly here
  window.initApi = function (interpreter, globalObject) {
    // Pan robot
    var wrapper = function (cmd) {
      window.pan(cmd);
      console.log("PAN ", cmd);
    };
    interpreter.setProperty(
      globalObject,
      "testVar",
      interpreter.createNativeFunction(wrapper)
    );

    // Print to console
    var wrapper = function (cmd, something) {
      //console.log(cmd, something);
      if (cmd !== undefined) {
        printVal.innerHTML = cmd;
      } else {
        printVal.innerHTML = "";
      }
    };
    interpreter.setProperty(
      globalObject,
      "print",
      interpreter.createNativeFunction(wrapper)
    );

    // setVelocityX
    var wrapper = function (cmd, something) {
      //console.log(cmd, something);
      window.player.setVelocityX(cmd);
    };
    interpreter.setProperty(
      globalObject,
      "setVelocityX",
      interpreter.createNativeFunction(wrapper)
    );

    // setVelocityY
    var wrapper = function (cmd, something) {
      window.player.setVelocityY(cmd * -1);
    };
    interpreter.setProperty(
      globalObject,
      "setVelocityY",
      interpreter.createNativeFunction(wrapper)
    );

    // END setY

    // setX
    var wrapper = function (cmd, something) {
      window.player.x = cmd;
    };
    interpreter.setProperty(
      globalObject,
      "setX",
      interpreter.createNativeFunction(wrapper)
    );

    // setY
    var wrapper = function (cmd, something) {
      window.player.y = cmd;
    };
    interpreter.setProperty(
      globalObject,
      "setY",
      interpreter.createNativeFunction(wrapper)
    );

    // END setX

    // Band power
    var wrapper = function (band, channel) {
      try {
        return window.bands[channel][band];
      } catch (error) {
        return error;
      }
    };
    interpreter.setProperty(
      globalObject,
      "getBandPower",
      interpreter.createNativeFunction(wrapper)
    );

    // create wrapper to pull facial data
    var wrapper = function (feature, component) {
      try {
        if (component == "score") {
          return window[feature][component];
        } else {
          return window[feature]["position"][component];
        }
      } catch (error) {
        return error;
      }
    };
    interpreter.setProperty(
      globalObject,
      "getFacialData",
      interpreter.createNativeFunction(wrapper)
    );


    // Expression Score
    var wrapper = function (expression) {
      try {
        console.log("expression", expression);
        return window["expressions"][expression];
      } catch (error) {
        return error;
      }
    };
    interpreter.setProperty(
      globalObject,
      "getExpressionScore",
      interpreter.createNativeFunction(wrapper)
    );


    // Get Speech
    var wrapper = function () {
      try {
        return `${window.lastSpeech}`;
      } catch (error) {
        return error;
      }
    };
    interpreter.setProperty(
      globalObject,
      "getSpeech",
      interpreter.createNativeFunction(wrapper)
    );


    // Speak
    var wrapper = function (text) {
      try {
        window.synthesizeSpeech(text);
      } catch (error) {
        return error;
      }
    };
    interpreter.setProperty(
      globalObject,
      "speak",
      interpreter.createNativeFunction(wrapper)
    );


    // Update Face
    var wrapper = function (emotion, gaze, color) {
      try {
        window.updateFace(emotion, gaze, color);
      } catch (error) {
        return error;
      }
    };
    interpreter.setProperty(
      globalObject,
      "updateFace",
      interpreter.createNativeFunction(wrapper)
    );


    // Get Physio
    var wrapper = function () {
      try {
        //console.log(window.filteredSample);
        return window.filteredSample; // get latest physio data here
      } catch (error) {
        return error;
      }
    };

    interpreter.setProperty(
      globalObject,
      "getPhysio",
      interpreter.createNativeFunction(wrapper)
    );

    // Handle highlighting
    function highlightBlock(id) {
      window.workspace.highlightBlock(id);
      //console.log("block ID", id)

      /*
      setTimeout(() => {
        window.workspace.highlightBlock(null);
      }, 1000)
      */
      
      //window.highlightPause = true;
    }

    // Add an API function for highlighting blocks.
    const wrapperHighlight = function(id) {
      id = String(id || '');
      return highlightBlock(id);
    };
    interpreter.setProperty(globalObject, 'highlightBlock',
        interpreter.createNativeFunction(wrapperHighlight));

    // Add an API for the wait block.  See wait_block.js
    initInterpreterWaitForSeconds(interpreter, globalObject);
  };

  

  window.runBlocklyCode = function () {
    //console.log("latest Code: ", window.latestCode);
    //console.log("Editor mode? ", window.editorMode);
    //console.log("Text code is ", window.textEditor.getValue());
    window.workspace.highlightBlock(null);
    if (window.editorMode == "block") {
      window.interpreter = new Interpreter(window.latestCode, window.initApi);
    } else {
      // use latest text code
      var textCode = window.textEditor.getValue();
      window.interpreter = new Interpreter(textCode, window.initApi);
      //console.log("HERE");
    }

    window.runner = function () {
      if (!window.interpreter) return;

      // console.log("running", window.interpreter)

      // Run is the example provided for async apps. However highlighting does not work well 
      //var hasMore = window.interpreter.run();

      var hasMore = window.interpreter.step();


      //console.log("hasMore: ", hasMore)
      if (hasMore) {
        setTimeout(window.runner, 10);
      } else {
        // console.log("window.resetInterpreter")
        window.resetInterpreter();
      }
    };
    try {
      window.runner();
    } catch (error) {
      return error;
    }
  };
};

BlocklyInterface.prototype.init = function () {
  //console.log("Blockly interface started")
  window.generateCodeAndLoadIntoInterpreter();
  window.workspace.addChangeListener(function (event) {
    if (!(event instanceof Blockly.Events.Ui)) {
      // Something changed. Parser needs to be reloaded.
      window.resetInterpreter();
      window.generateCodeAndLoadIntoInterpreter();

      // Don't run code until user is ready to run code
      //window.runBlockCode();
    }
  });
};

window.runBlockCode = function () {
  if (window.interprete == null) {
    //this.runButton = 'disabled'
    //console.log("setTimeout(window.runBlocklyCode, 1)")
    setTimeout(window.runBlocklyCode, 1);
  }
};
