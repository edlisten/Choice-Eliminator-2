//http://marianoguerra.github.io/json.human.js/
//http://stackoverflow.com/questions/4810841/how-can-i-pretty-print-json-using-javascript
//http://jsfiddle.net/yEez8/
//http://json.bloople.net/#_output

function debug(){

  // on/off
  var submitTrigger = getOnFormSubmitStatus();
//  var datasheet = getDestinationSheet();
  var sheetInfo = debugEvaluateResultsSheet();
  var properties = PropertiesService.getDocumentProperties().getProperties();
  

  var report = {};
  report.onFormSubmit = submitTrigger;
//  report.datasheet = datasheet;
  report.sheetInfo = sheetInfo;
  report.properties = properties;

  
  // dialogue Box
  var rString = JSON.stringify(report);
//  var rStringPretty = JSON.stringify(report, null, '\t');
  
   var htmlHead = '<!DOCTYPE html><html><head><base target="_top">' 
  + '<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">'
  + '<script>function resetEverything(){google.script.run.reseteverything();document.getElementById("textArea").value = "Resent: Make sure to close this dialoge and the CE Configuration Sidebar before making any other changes."}</script>'
  +'</head><body>';
  var htmlFoot = '</body></html>'
  var htmlBody = ''
//  + '<div id="TableCont"></div>'
  + '<textarea id="textArea" rows="20" cols="45">'+rString+'</textarea>'
  + '<p>For a formatted view, copy and past into <a href="https://jsonformatter.curiousconcept.com/">JSON Formatter</a>.</p>'
//  + '<p><button onClick="google.script.run.runemailDebugReport(rString)">Send Report</button></p>'
  + '<p><button onClick="resetEverything()">Reset Everything</button>'
  + '<button onClick="google.script.host.close()">Close</button></p>';
  
  
  var htmlContent =   htmlHead + htmlBody + htmlFoot; 
  
  var html = HtmlService.createHtmlOutput(htmlContent);
  html.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  html.setHeight(450).setWidth(400);
  FormApp.getUi().showModalDialog(html, "CE2 Debug");
  
  

  
}


function emailDebugReport(report){
  Logger.log(report);
}

function debugEvaluateResultsSheet(){
  var sr = {};
  var form = FormApp.getActiveForm(); 
  var ss = getActiveSS(form);
// var ss = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone()
  
  
  // Get Sheet Data
  var sheetsObj =  ss.getSheets();
  var sheetNames ={};
  for (var i in sheetsObj){
    var cObj = {};
    var c = sheetsObj[i];
    var name = c.getName();
    var lastCol = c.getLastColumn();
    if(lastCol == 0){lastCol =1};
    var r2Data = c.getRange(1, 1, 2, lastCol).getValues();
    var a1 = r2Data[0][0];
    
    if (a1 != "Data Sheet"){
      var formDataArray = [];
      
      for (j in r2Data[0]){
       var row1 =  r2Data[0][j];
       var row2 =  r2Data[1][j];
       formDataArray.push([row1,row2]);
      }
      
      sheetNames[name] = formDataArray;
      
      
    } else {
      var name2 = name+"-Formulas";
      var cVals = c.getRange("A1:B6").getValues(); //.getDisplayValues();
      var cValsForm = c.getRange("B2:B3").getFormulas(); 
      sheetNames[name] = cVals;
      sheetNames[name2] = cValsForm;
    }
  }
  sr.sheetNames = sheetNames;
  
  
  // get sheet language
  sr.locale = ss.getSpreadsheetLocale();
  sr.timezone = ss.getSpreadsheetTimeZone();
  
  
  // return data
  return sr;
  
}

//function catchToString(err) {
////  if(!err){err = "testing"};
//  var errInfo = "Caught something:\n"; 
//  for (var prop in err)  {  
//    errInfo += "  property: "+ prop+ "\n    value: ["+ err[prop]+ "]\n"; 
//  } 
//  errInfo += "  toString(): " + " value: [" + err.toString() + "]"; 
//  var properties = PropertiesService.getDocumentProperties();
//  properties.setProperty("Send Error", errInfo);
//  return errInfo;
//}
//
//
//function getEmailQuota(){
//  
//  
//  
//}