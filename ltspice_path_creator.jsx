var loadButton_pos = [10, 10, 100, 30];
var fileName_pos = [110, 10, 200, 30];
var heightLabel_pos = [10, 40, 80, 60];
var heightSlider_pos = [115, 40, 215, 60];
var heightEdit_pos = [80, 40, 115, 60];
var widthLabel_pos = [10, 60, 80, 80];
var widthSlider_pos = [115, 60, 215, 80];
var widthEdit_pos = [80, 60, 115, 80];
var resLabel_pos = [10, 80, 80, 100];
var resEdit_pos = [80, 80, 115, 100];
var resSlider_pos = [115, 80, 215, 100];
var startLabel_pos = [10, 100, 80, 120];
var startEdit_pos = [80, 100, 115, 120];
var startSlider_pos = [115, 100, 215, 120];
var endLabel_pos = [10, 120, 80, 140];
var endEdit_pos = [80, 120, 115, 140];
var endSlider_pos = [115, 120, 215, 140];

var createButton_pos = [10, 145, 100, 170];

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

var numTraces = 0;

var project = app.project;
var comp = project.activeItem;

var sourceFile = new File;

var fileIsLoaded = false;

var rawVoltageNums = [];

var rawTimeNums = [];

function checkAllowed(inputFile)
{
    if(inputFile.type == "TEXT")
    {
        return true;
    } else
    {
        return false;
    }
}

function createPanel(thisObj)
{
    var panel = thisObj;
    loadButton = panel.add("button", loadButton_pos, "Choose a File");
    fileName = panel.add("statictext", fileName_pos, "None Selected");
    createButton = panel.add("button", createButton_pos, "Create Path"); 
    createButton.enabled = false;
    heightLabel = panel.add("statictext", heightLabel_pos, "Height: ");
    heightSlider = panel.add("slider", heightSlider_pos, 1080, 0, 5000);
    heightEdit = panel.add("edittext", heightEdit_pos, heightSlider.value.toString());
    heightSlider.onChanging = function() {
        heightEdit.text = Math.floor(heightSlider.value).toString();
    }
    heightEdit.onChange = function() {
        var inputNum = parseInt(heightEdit.text, 10);
        if(!isNaN(inputNum))
        {
            heightSlider.value = inputNum;
        }
    }

    widthLabel = panel.add("statictext", widthLabel_pos, "Width: ");
    widthSlider = panel.add("slider", widthSlider_pos, 1920, 0, 5000);
    widthEdit = panel.add("edittext", widthEdit_pos, widthSlider.value.toString());
    widthSlider.onChanging = function() {
        widthEdit.text = Math.floor(widthSlider.value).toString();
    }
    widthEdit.onChange = function() {
        var inputNum = parseInt(widthEdit.text, 10);
        if(!isNaN(inputNum))
        {
            widthSlider.value = inputNum;
        }
    }

    resLabel = panel.add("statictext", resLabel_pos, "Resolution: ");
    resSlider = panel.add("slider", resSlider_pos, 200, 10, 1000);
    resEdit = panel.add("edittext", resEdit_pos, resSlider.value.toString());
    resSlider.onChanging = function() {
        resEdit.text = Math.floor(resSlider.value).toString();
    }
    resEdit.onChange = function() {
        var inputNum = parseInt(resEdit.text, 10);
        if(!isNaN(inputNum))
        {
            resSlider.value = inputNum;
        }
    }
    
    function closest(array,num){
        var i=0;
        var minDiff=1000;
        var ans;
        for(i in array){
             var m=Math.abs(num-array[i]);
             if(m<minDiff){ 
                    minDiff=m; 
                    ans=array[i]; 
                }
          }
        return ans;
    }

    loadButton.onClick = function()
    {
        sourceFile = sourceFile.openDlg("Choose a file", checkAllowed(sourceFile));
        fileName.text = sourceFile.name;
        var openFile = sourceFile.open('r');
        var fileStr = sourceFile.read();
        var regExp = /(\S)+$/gm;
        var rawVoltageStrings = fileStr.match(regExp);
        var lineNumber = rawVoltageStrings.length;
        for(var line = 1; line < lineNumber; line++)
        {
           var leftHand = rawVoltageStrings[line].toString();
           var leftHandExp = /(\d|\S)+(?=e)/;
            var leftHandArr = leftHand.match(leftHandExp);
           
           var leftHandStr = leftHandArr[0];
           var leftHandNum = parseFloat(leftHandStr);
           
           
           var rightHand = rawVoltageStrings[line].toString();
           var rightHandExp = /[^e]*$/g;
           var rightHandArr = rightHand.match(rightHandExp);
           var rightHandNum = parseInt(rightHandArr[0]);
           var exponent = Math.pow(10, rightHandNum);

           
           
           var voltageVal = leftHandNum * exponent;
           
           rawVoltageNums.push(voltageVal);
        }
        if(rawVoltageNums.length > 0)
        {
            fileIsLoaded = true;
            createButton.enabled = true;

            startLabel = panel.add("statictext", startLabel_pos, "Start: ");
            startSlider = panel.add("slider", startSlider_pos, 0, 0, 100);
            startEdit = panel.add("edittext", startEdit_pos, startSlider.value.toString());
            startSlider.onChanging = function() {
            startEdit.text = Math.floor(startSlider.value).toString();
            }
            startEdit.onChange = function() 
            {
                var inputNum = parseInt(startEdit.text, 10);
                if(!isNaN(inputNum))
                {
                    startSlider.value = inputNum;
                }
            }
            endLabel = panel.add("statictext", endLabel_pos, "End: ");
            endSlider = panel.add("slider", endSlider_pos, 100, 0, 100);
            endEdit = panel.add("edittext", endEdit_pos, endSlider.value.toString());
            endSlider.onChanging = function() {
            endEdit.text = Math.floor(endSlider.value).toString();
            }
            endEdit.onChange = function() 
            {
                var inputNum = parseInt(endEdit.text, 10);
                if(!isNaN(inputNum))
                {
                    endSlider.value = inputNum;
                }
            }
        } 
        else 
        { 
            fileIsLoaded = false;
        }
    }
    createButton.onClick = function()
    {
        if(fileIsLoaded == true)
        {
            var valuesToUse = [];
            var numDataPoints = resSlider.value;
            var start = startSlider.value;
            var startIndex;
            if(start > 1)
            {
                startIndex = Math.floor(rawVoltageNums.length * (start / 100));
            }
            else
            {
                startIndex = 0;
            }
            var end = endSlider.value;
            var endIndex = 0;
            if(end >= 1)
            {
                endIndex = rawVoltageNums.length * (end / 100);
            }
            else
            {
                alert("End value must be greater than start");
            }
            
            var increment = Math.floor((endIndex - startIndex) / numDataPoints);
            var maxVal = 0.0;
            for(var i = 0; i < numDataPoints; i++)
            {
                var thisValue = rawVoltageNums[startIndex + (i * increment)];
                
                valuesToUse.push(thisValue);
                if(thisValue > maxVal)
                {
                    maxVal = thisValue;
                }       
            }
            comp.openInViewer();
            var shapeLayer = comp.layers.addShape();
            numTraces += 1;
            var traceCount = numTraces.toString();
            var namePrefix = "Trace ";
            for(i = 0; i < comp.numLayers; ++i)
            {
                 var name = comp.layer(i + 1).name;
                 var getChars = /Trace/g;
                 if(getChars.test(name))
                 {
                     var arr = name.match(/\d/g);
                     if(parseInt(arr[0]) >= traceCount)
                     {
                         traceCount = parseInt(arr[0]);
                     }
                 }
            }
            var layerName = namePrefix.concat(traceCount);
            shapeLayer.name = layerName;
            //creating all the properties
            var pathGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Group");
            var strokeGroup = shapeLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Stroke");
             //making a shape based on the data
            var duration = rawTimeNums[rawTimeNums.length - 1];
            var verts = [];
            var inTans = [];
            var outTans = [];
            var xIncrement = (widthSlider.value / numDataPoints);
            var halfY = comp.height / 2;
            var halfX = comp.width / 2;
            var vMax = 1;
            for(i = 0; i < numDataPoints; i++)
            {
                if(valuesToUse[i] > vMax)
                {
                    vMax = valuesToUse[i];
                }
            }
            var gain = (heightSlider.value / vMax) / 2;
            for(var i = 0; i < numDataPoints; i++)
            {
                var xPos = (xIncrement * i) - halfX;
                var yPos = (gain * valuesToUse[i]);
                verts.push([xPos, yPos]);
                inTans.push([0, 0]);
                outTans.push([0, 0]);
                if(i == 10)
                {
                    var numStr = yPos.toString();
                }
            }
            var pathShape = new Shape();
            pathShape.inTangents = inTans;
            pathShape.vertices = verts;
            pathShape.outTangents = outTans;
            pathShape.closed = false;
            shapeLayer.property("Contents").property(1).property(2).setValue(pathShape);
            
        }
    }
    return panel;
}
var uiPanel = createPanel(this);