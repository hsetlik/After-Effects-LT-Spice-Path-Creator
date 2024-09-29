//sorting out all the UI dimensions
var loadButton_pos = [10, 10, 100, 30];
var fileName_pos = [110, 10, 200, 30];
var heightLabel_pos = [10, 40, 80, 60];
var heightSlider_pos = [115, 40, 300, 60];
var heightEdit_pos = [80, 40, 115, 60];
var widthLabel_pos = [10, 60, 80, 80];
var widthSlider_pos = [115, 60, 300, 80];
var widthEdit_pos = [80, 60, 115, 80];
var resLabel_pos = [10, 80, 80, 100];
var resEdit_pos = [80, 80, 115, 100];
var resSlider_pos = [115, 80, 300, 100];
var startLabel_pos = [10, 100, 80, 120];
var startEdit_pos = [80, 100, 115, 120];
var startSlider_pos = [115, 100, 300, 120];
var endLabel_pos = [10, 120, 80, 140];
var endEdit_pos = [80, 120, 115, 140];
var endSlider_pos = [115, 120, 300, 140];
var colorLabel_pos = [10, 140, 80, 160];
var colorButton_pos = [80, 140, 120, 160];

var createButton_pos = [10, 180, 100, 200];
var test1_pos = [10, 200, 100, 220];
var test2_pos = [10, 220, 100, 240];
var test3_pos = [10, 240, 100, 260];

var fileName;
var loadButton;
var createButton;
var heightLabel;
var heightSlider;
var heightEdit;
var widthLabel;
var widthSlider;
var widthEdit;
var resLabel;
var resSlider;
var resEdit;

var startLabel;
var startEdit;
var startSlider;
var endLabel;
var endEdit;
var endSlider;

var colorLabel;
var colorButton;
var colorHex = "0xF96163";
var colorRGBA = [249 / 255, 97 / 255, 99 / 255, 1.0];

//track how many traces are in the comp for naming
var numTraces = 0;

var project = app.project;
var comp = project.activeItem;

var sourceFile = new File();

var fileIsLoaded = false;

var rawVoltageNums = [];

var rawTimeNums = [];

function checkAllowed(inputFile) {
  if (inputFile.type == "TEXT") {
    return true;
  } else {
    return false;
  }
}
//returns the index of the value closest to 'num'
function closestIndex(array, num) {
  var i = 0;
  var minDiff = 1000;
  var bestIndex;
  for (i in array) {
    var m = Math.abs(num - array[i]);
    if (m < minDiff) {
      minDiff = m;
      bestIndex = i;
    } else if (m > minDiff) {
      return bestIndex;
    }
  }
  return bestIndex;
}

function sciNot(input) {
  var leftHandExp = /(\S+)(?=e)/g;
  var leftHandArr = input.match(leftHandExp);
  if (leftHandArr === null) {
    alert("Failed to parse left hand for input: " + input);
  }
  var leftHandStr = leftHandArr[0];
  var leftHandNum = parseFloat(leftHandStr);
  if (isNaN(leftHandNum)) {
    alert("parseFloat failed for input: " + leftHandStr);
  }
  var rightHandExp = /[^e]*$/g;
  var rightHandArr = input.match(rightHandExp);
  if (rightHandArr === null) {
    alert("Failed to parse right hand for input: " + input);
  }
  var rightHandNum = parseInt(rightHandArr[0]);
  if (isNaN(rightHandNum)) {
    alert("parseInt failed for input: " + rightHandArr[0]);
  }
  var exponent = Math.pow(10, rightHandNum);
  var output = leftHandNum * exponent;
  return output;
}

function loadTraceFile() {
  sourceFile = sourceFile.openDlg("Choose a file", checkAllowed(sourceFile));
  fileName.text = sourceFile.name;
  if (!sourceFile.open("r")) {
    alert("Failed to open trace file!");
  }
  //store the whole file in a string
  var fileStr = sourceFile.read();

  if (!sourceFile.close()) {
    alert("Failed to close trace file!");
  }
  // split into left and right columns
  const rightRegex = /(\S+)$/gm;
  const leftRegex = /^(\S+)/gm;
  var voltageStrings = fileStr.match(rightRegex);
  var timeStrings = fileStr.match(leftRegex);
  /*
  alert(
    "Loaded " +
      voltageStrings.length +
      " voltage strings and " +
      timeStrings.length +
      " time strings"
  );
  */
  for (var idx = 1; idx < voltageStrings.length; idx++) {
    var tVal = sciNot(timeStrings[idx].toString());
    var vVal = sciNot(voltageStrings[idx].toString());
    if (isNaN(tVal)) {
      alert("Invalid time value for input: ");
    }
    if (isNaN(vVal)) {
      alert("Invalid voltage value for input: ");
    }
    rawTimeNums.push(tVal);
    rawVoltageNums.push(vVal);
  }

  if (rawVoltageNums.length > 0) {
    fileIsLoaded = true;
    createButton.enabled = true;
  } else {
    fileIsLoaded = false;
  }
}

// color picker helpers
function drawColorButton() {
  with (this) {
    graphics.drawOSControl();
    graphics.rectPath(0, 0, size[0], size[1]);
    graphics.fillPath(fillBrush);
  }
}

function updateButtonColor(button, rgbArray) {
  button.fillBrush = button.graphics.newBrush(
    button.graphics.BrushType.SOLID_COLOR,
    rgbArray
  );
  button.onDraw = drawColorButton;
  button.enabled = false;
  button.enabled = true;
}

// -----

function createPanel(thisObj) {
  var panel = thisObj;
  loadButton = panel.add("button", loadButton_pos, "Choose a File");
  fileName = panel.add("statictext", fileName_pos, "None Selected");
  createButton = panel.add("button", createButton_pos, "Create Path");
  //disable until a valid file is loaded
  createButton.enabled = false;
  //tying together the slider and the edittext
  heightLabel = panel.add("statictext", heightLabel_pos, "Height: ");
  heightSlider = panel.add("slider", heightSlider_pos, 1080, 0, 5000);
  heightEdit = panel.add(
    "edittext",
    heightEdit_pos,
    heightSlider.value.toString()
  );
  heightSlider.onChanging = function () {
    heightEdit.text = Math.floor(heightSlider.value).toString();
  };
  heightEdit.onChange = function () {
    var inputNum = parseInt(heightEdit.text, 10);
    if (!isNaN(inputNum)) {
      heightSlider.value = inputNum;
    }
  };

  widthLabel = panel.add("statictext", widthLabel_pos, "Width: ");
  widthSlider = panel.add("slider", widthSlider_pos, 1920, 0, 5000);
  widthEdit = panel.add(
    "edittext",
    widthEdit_pos,
    widthSlider.value.toString()
  );
  widthSlider.onChanging = function () {
    widthEdit.text = Math.floor(widthSlider.value).toString();
  };
  widthEdit.onChange = function () {
    var inputNum = parseInt(widthEdit.text, 10);
    if (!isNaN(inputNum)) {
      widthSlider.value = inputNum;
    }
  };

  resLabel = panel.add("statictext", resLabel_pos, "Resolution: ");
  resSlider = panel.add("slider", resSlider_pos, 200, 10, 1000);
  resEdit = panel.add("edittext", resEdit_pos, resSlider.value.toString());
  resSlider.onChanging = function () {
    resEdit.text = Math.floor(resSlider.value).toString();
  };
  resEdit.onChange = function () {
    var inputNum = parseInt(resEdit.text, 10);
    if (!isNaN(inputNum)) {
      resSlider.value = inputNum;
    }
  };

  //add the start/end time controls
  startLabel = panel.add("statictext", startLabel_pos, "Start: ");
  startSlider = panel.add("slider", startSlider_pos, 0, 0, 100);
  startEdit = panel.add(
    "edittext",
    startEdit_pos,
    startSlider.value.toString()
  );
  startSlider.onChanging = function () {
    startEdit.text = Math.floor(startSlider.value).toString();
  };
  startEdit.onChange = function () {
    var inputNum = parseInt(startEdit.text, 10);
    if (!isNaN(inputNum)) {
      startSlider.value = inputNum;
    }
  };
  endLabel = panel.add("statictext", endLabel_pos, "End: ");
  endSlider = panel.add("slider", endSlider_pos, 100, 0, 100);
  endEdit = panel.add("edittext", endEdit_pos, endSlider.value.toString());
  endSlider.onChanging = function () {
    endEdit.text = Math.floor(endSlider.value).toString();
  };
  endEdit.onChange = function () {
    var inputNum = parseInt(endEdit.text, 10);
    if (!isNaN(inputNum)) {
      endSlider.value = inputNum;
    }
  };

  loadButton.onClick = function () {
    loadTraceFile();
  };

  colorLabel = panel.add("statictext", colorLabel_pos, "Trace Color:");
  colorButton = panel.add("button", colorButton_pos, "");
  colorButton.fillBrush = colorButton.graphics.newBrush(
    colorButton.graphics.BrushType.SOLID_COLOR,
    [0.9765, 0.3804, 0.3882]
  );
  colorButton.onDraw = drawColorButton;
  colorButton.onClick = function () {
    var colorPickerRes = $.colorPicker(colorHex);
    if (colorPickerRes != -1) {
      var r = colorPickerRes >> 16;
      var g = (colorPickerRes & 0x00ff00) >> 8;
      var b = colorPickerRes & 0xff;
      colorRGBA[0] = r / 255;
      colorRGBA[1] = g / 255;
      colorRGBA[2] = b / 255;
      $.writeln("selected a color");
      colorHex = colorPickerRes;

      updateButtonColor(colorButton, [r / 255, g / 255, b / 255]);
    } else {
      $.writeln("did not select a color");
    }
  };

  //========================================

  createButton.onClick = function () {
    if (fileIsLoaded == true) {
      var valuesToUse = [];
      var indecesToUse = [];
      var numDataPoints = resSlider.value;
      var dataDuration = rawTimeNums[rawTimeNums.length - 1];

      //check the start/end sliders to figure out what values to pull
      var start = startSlider.value;
      var end = endSlider.value;
      var startSecs = (start / 100) * dataDuration;
      var endSecs = (end / 100) * dataDuration;
      var windowDuration = endSecs - startSecs;
      var timeIncrement = windowDuration / numDataPoints;
      for (i = 0; i < numDataPoints; i++) {
        var timePos = startSecs + timeIncrement * i;
        indecesToUse.push(closestIndex(rawTimeNums, timePos));
      }

      //picking out values based on resolution and finding the largest one for the vertical scale
      var maxVoltage = 0.0;
      var minVoltage = 0.0;
      for (var i = 0; i < numDataPoints; i++) {
        var thisVoltage = rawVoltageNums[indecesToUse[i]];
        valuesToUse.push(thisVoltage);
        if (thisVoltage > maxVoltage) {
          maxVoltage = thisVoltage;
        }
        if (thisVoltage < minVoltage) {
          minVoltage = thisVoltage;
        }
      }
      var pxPerVolt = heightSlider.value / (maxVoltage - minVoltage);
      comp.openInViewer();
      //make a new shape layer
      var shapeLayer = comp.layers.addShape();
      numTraces += 1;
      //determining the layer name
      shapeLayer.name = sourceFile.name.substring(
        0,
        sourceFile.name.indexOf(".")
      );

      //creating all the properties
      var pathGroup = shapeLayer
        .property("ADBE Root Vectors Group")
        .addProperty("ADBE Vector Shape - Group");
      var strokeGroup = shapeLayer
        .property("ADBE Root Vectors Group")
        .addProperty("ADBE Vector Graphic - Stroke");

      //making a shape based on the data
      var verts = [];
      var inTans = [];
      var outTans = [];
      var xIncrement = widthSlider.value / numDataPoints;
      var halfX = comp.width / 2;
      for (var i = 0; i < numDataPoints; i++) {
        var xPos = xIncrement * i - halfX;
        var yPos = pxPerVolt * (valuesToUse[i] - minVoltage);
        verts.push([xPos, comp.height - yPos]);
        inTans.push([0, 0]);
        outTans.push([0, 0]);
      }
      var pathShape = new Shape();
      pathShape.inTangents = inTans;
      pathShape.vertices = verts;
      pathShape.outTangents = outTans;
      pathShape.closed = false;
      //assigning that shape to the layer path
      shapeLayer
        .property("Contents")
        .property(1)
        .property(2)
        .setValue(pathShape);

      shapeLayer
        .property("Contents")
        .property(2)
        .property("Color")
        .setValue(colorRGBA);
    }
  };
  return panel;
}
var uiPanel = createPanel(this);
