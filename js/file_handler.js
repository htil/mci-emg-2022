let eById = (id) => {
    console.log("load project, eById");

  let res = document.getElementById(id);
  if (res == null) throw new Error("Could not find element with ID: " + id);

  return res;
};

let load_input = eById("file_handler");

load_input.onchange = (e) => {
  let file = e.target.files[0];

  if (!file) {
    return;
  }

  loadProject(file);
};

let loadProject = function (file) {
  window.workspace.clear();
  window.workspace.clearUndo();

  let reader = new FileReader();

  reader.onload = (e) => {
    let contents = e.target.result.toString();
    let as_xml = Blockly.Xml.textToDom(contents);
    Blockly.Xml.domToWorkspace(as_xml, window.workspace);
  };

  reader.readAsText(file);
};

let download = function () {
  console.log("download");
  let filename = prompt();
  filename = `${filename}.xml`;

  let as_dom = Blockly.Xml.workspaceToDom(window.workspace);
  let as_text = Blockly.Xml.domToText(as_dom);

  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(as_text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

eById("saveFile").onclick = download;
eById("uploadFile").onclick = () => load_input.click();

///////////// File Upload and Download Functions /////////////
