


//function getDataSheet(){
// var form = FormApp.getActiveForm();
// var id = form.getDestinationId();
// var type = form.getDestinationType();
// var ss = SpreadsheetApp.openById(id);
//  
// var sheet = "";  // how do I get the sheet that the data will go to? 
//}



//////////////////////////////////////////////////////////////////////////////////////////////////////
// Add/Remove questions to be eliminated
//////////////////////////////////////////////////////////////////////////////////////////////////////


function addCESheet(id,dataSheet,title,versionNumber){
  if(!id){id = "1187728346"};
  if(!dataSheet){dataSheet = "Form Responses"};
  if(!title){title = "Go To a place"};
  if(!versionNumber){versionNumber = "none"};
  
  var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  
  //add property to identify CE2 is installed
    var properties = PropertiesService.getDocumentProperties();
  properties.setProperty('CE2version', versionNumber);
  
  
  var dSheet = ss.getSheetByName(dataSheet);
  var dSheetA2 = dSheet.getRange("A2").getValue();
  if (dSheetA2 != "FormQId"){
    dSheet.insertRowAfter(1);
    dSheet.getRange("A2").setValue("FormQId");
    //    SpreadsheetApp.flush();
    dSheet.setFrozenRows(2);
    dSheet.hideRows(2);
  }
  
  var row1 = dSheet.getRange(1, 1, 1, dSheet.getLastColumn()).getValues()[0];
  for (var r=0; r<row1.length;r++){
    if (row1[r] == title){
      dSheet.getRange(2,r+1).setValue(id);
      SpreadsheetApp.flush();
    }
    
  }
  
  try {
    var sheet = ss.insertSheet(id);  
  } catch(err) {
    var Rsheet = ss.getSheetByName(id);
    ss.deleteSheet(Rsheet);
    sheet = ss.insertSheet(id); 
  }
  
  sheet.hideSheet();
  
  var ques = form.getItemById(id);
  var qTitle = ques.getTitle();
  var qType = ques.getType();
  var qTypeAs = getAsQuestionType(ques);
  var qChoices = qTypeAs.getChoices();

  qTypeAs.setRequired(true);  // This no longer works to prevent an option from not being selected if the window is up. 
  
  var sheetData = [
    ["Data Sheet",dataSheet],
    ["Column",'=MATCH(B4;INDIRECT(B1&"!2:2");0)'],
    ["Question Title",'=INDIRECT(B1&"!R1C"&B2; false)'],
    ["Question Id",id],
    ["Question Type",qType],
    ["Backup Text", "No More Options"]
  ];
  var headData = [[
    "Choices",
    "ROffset",
    "RLimit",
    "PageNavigationType",
    "GoToPage ID",
    "GoToPage Title",
    "",
    "RCountTotal",
    "RCount",
    "Combined PNT",
    "Combined GTPId",
    "Combined"
  ]];
  
  var choicesData = [];
  var choicesOptions = [];

  for (i in qChoices) {
    var c = qChoices[i].getValue();
    var pnt = qChoices[i].getPageNavigationType();
    var gtp = qChoices[i].getGotoPage();
    var gtpId = "";
    var gtpTitle = "";
    if(gtp){
      gtpId = gtp.getId();
      gtpTitle = gtp.getTitle();
    };

    choicesData.push([
      c,
      0,
      1,
      pnt,
      gtpId,
      gtpTitle,
      "",
//      '=COUNTIF(INDIRECT(B$1&"!C"&B$2&":C"&B$2;false);"*"&INDIRECT("A"&ROW())&"*")',  // does not work with numbers, but needed for checkboxes
//      '=COUNTIF(INDIRECT(B$1&"!C"&B$2&":C"&B$2;false);INDIRECT("A"&ROW()))',  
      '=COUNTIF(INDIRECT(B$1&"!C"&B$2&":C"&B$2;false);if(ISNUMBER(INDIRECT("A"&ROW()));INDIRECT("A"&ROW());"*"&INDIRECT("A"&ROW())&"*"))',
      '=INDIRECT("H"&row())-INDIRECT("B"&row())'
    ]);
  };
  
  var formulas = [[
      '=if(not(iserror(filter(D9:D;I9:I<C9:C)));FILTER(filter(D9:D;I9:I<C9:C);not(iserror(filter(D9:D;I9:I<C9:C))));B6)',
      '=if(not(iserror(filter(E9:E;I9:I<C9:C)));FILTER(filter(E9:E;I9:I<C9:C);not(iserror(filter(E9:E;I9:I<C9:C))));B6)',
      '=if(not(iserror(filter(A9:A;I9:I<C9:C)));FILTER(filter(A9:A;I9:I<C9:C);not(iserror(filter(A9:A;I9:I<C9:C))));B6)'
    ]];
  
  sheet.getRange("A1:B6").setValues(sheetData);
  sheet.getRange("A8:L8").setValues(headData);
  sheet.getRange(9,1,choicesData.length,9).setValues(choicesData);
  sheet.getRange("J9:L9").setValues(formulas);
  sheet.getRange("C5").setFormula('=if(COUNTA($D$9:$D) = 0;false;true)');
  sheet.getRange("L7").setFormula("=COUNTA(L9:L)");
  
//  var ChoiceFormat = sheet.getRange("A9").getNumberFormat();
  var A9 = sheet.getRange("A9").getValue();
  var ChoiceFormat = typeof A9;
  if (ChoiceFormat != "number"){
  sheet.getRange("A:A").setNumberFormat('@STRING@');
  }
  
//  sheet.getRange(9, 8, sheet.getLastRow()-8, 1).copyValuesToRange(sheet, 2, 1, 9, sheet.getLastRow()-8); // Broken see issue: https://code.google.com/p/google-apps-script-issues/issues/detail?can=2&start=0&num=100&q=copyValuesToRange&colspec=Stars%20Opened%20ID%20Type%20Status%20Summary%20Component%20Owner&groupby=&sort=&id=4729
  var ROffsetValues = sheet.getRange(9, 8, sheet.getLastRow()-8, 1).getValues();
  sheet.getRange(9, 2, sheet.getLastRow()-8, 1).setValues(ROffsetValues);
  
  
  
  //verify sheet is valid
  SpreadsheetApp.flush();
 var errorLog = "sucess"
  var b2 = sheet.getRange("B2").getValue();
  b2 = b2.toString();
//  var b2Type = typeof b2;
  var erTest = b2.slice(0, 1);
  if (erTest == "#"){ 
    errorLog = "Error (Data sheet)" 
  }
  
 
  
  
  //enable Trigger
  enableTrigger(true);
  
  return errorLog;
  

} // end add new




//function test(){
//  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/15mvo21_0Lnzt8g-h93Joksmm7J4BhuLVNuFJjohDD-A/edit#gid=2110119986");
//  var sheet = ss.getSheetByName("1187728346");
//  
//  sheet.getRange(9, 8, sheet.getLastRow(), 1).copyValuesToRange(sheet, 2, 1, 9, sheet.getLastRow());
//  
//  
//}



function removeCESheet(id,ss){
  if(!id){id = "1898133013"};
  if(!ss){
    var form = FormApp.getActiveForm();
    var ss= getActiveSS(form);
  };
  try{
  var sheet = ss.getSheetByName(id);
  ss.deleteSheet(sheet);
  } catch(err){
  Logger.log(err);
    }
}






function saveDatasheet(dataSheet){
  
  var properties = PropertiesService.getDocumentProperties();
  properties.setProperty('dataSheet', dataSheet);
  
  //update sheets with new dataSheet
  var form = FormApp.getActiveForm();
  var ss= getActiveSS(form);
  var allSheets = ss.getSheets();
  for (h in allSheets){
    var sName = allSheets[h].getName();
    var B4 =  allSheets[h].getRange("B4").getValue();
    if (sName == B4){
      allSheets[h].getRange("B1").setValue(dataSheet);
    } 
  }
  
  
  
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// Get Defaults
//////////////////////////////////////////////////////////////////////////////////////////////////////




function getCEDefaults() {
  
  var defaults = {};
  var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  var items = form.getItems();
  var itemL = items.length-1;
  var allQuestions = [];
  
  var properties = PropertiesService.getDocumentProperties();
  var runTime = properties.getProperty('runTime');
//  var dataSheet = properties.getProperty('dataSheet');  //moved to data sheets
  
//      // test if there is a version 1, if so then delete
//    var ce1 = properties.getProperty('choiceEliminator');
//  if(ce1){
//    deleteCEProperties(properties);
//  }
  
  // loop through allSheets
  var allSheets = ss.getSheets();
  var sheetQIds = [];
  var dataSheets = [];
  
  for (h in allSheets){
    var sName = allSheets[h].getName();
    var B4 =  allSheets[h].getRange("B4").getValue();
    if (sName == B4){
      sheetQIds.push(sName);
    } else {
      dataSheets.push(sName);  
    }
  }

  var dataSheet = properties.getProperty('dataSheet');
  if (!dataSheet) {
    dataSheet = dataSheets[0];
  };
  
  
  
  // build entries defauls
  var formQIds= [];
  for (var i=0; i <= itemL; ++i) {
    var qID = items[i].getId();
    formQIds.push(qID);
    var qType = items[i].getType()+ "";
    var qTitle =  items[i].getTitle();
    var choiceEliminator = '';
    for (var j=0; j <= sheetQIds.length; ++j) {
      if (sheetQIds[j] == qID){
        choiceEliminator = 'checked';
      }
    }
    
    var entry = {'qID':qID,'title':qTitle,'type':qType,'choiceEliminator':choiceEliminator};
    if (qType == 'MULTIPLE_CHOICE' || qType == 'CHECKBOX' || qType == 'LIST'){
      allQuestions.push(entry);
    }
  } // end For
  
  //remove deleted questions from sheet
  var toRemove = subtractArrays(sheetQIds,formQIds);
  for (k in toRemove){
    removeCESheet(toRemove[k],ss);
  }
  
  //  populate defaults
  defaults.allQuestions = allQuestions;
  defaults.runTime = runTime;
  defaults.dataSheets = dataSheets;
  defaults.dataSheet = dataSheet;
  
//  sheet.getSheetByName("make an error");
  
  return(defaults);
    
}  //end getCEDefaults()





function getOnFormSubmitStatus(){
  var triggers = ScriptApp.getUserTriggers(FormApp.getActiveForm());
  var exists = false;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT) {
      exists = true;
    }
  }
  return exists;  
}



//////////////////////////////////////////////////////////////////////////////////////////////////////
// Actions
//////////////////////////////////////////////////////////////////////////////////////////////////////


function resetAllCounts(id){
  
  var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  
  
  if (!id){
  var allSheets = ss.getSheets();
  for (h in allSheets){
    var sName = allSheets[h].getName();
    var B4 =  allSheets[h].getRange("B4").getValue();
    if (sName == B4){
      var sheet = allSheets[h];
//      sheet.getRange(9, 8, sheet.getLastRow(), 1).copyValuesToRange(sheet, 2, 1, 9, sheet.getLastRow());
        var ROffsetValues = sheet.getRange(9, 8, sheet.getLastRow()-8, 1).getValues();
        sheet.getRange(9, 2, sheet.getLastRow()-8, 1).setValues(ROffsetValues);
      
    } 
  }
  } else {
    var sheet = ss.getSheetByName(id);
//    sheet.getRange(9, 8, sheet.getLastRow(), 1).copyValuesToRange(sheet, 2, 1, 9, sheet.getLastRow());
      var ROffsetValues = sheet.getRange(9, 8, sheet.getLastRow()-8, 1).getValues();
      sheet.getRange(9, 2, sheet.getLastRow()-8, 1).setValues(ROffsetValues);
  }
    
  //updateForm
  updateForm(ss, form);

  return;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////
// ON / Off alert
//////////////////////////////////////////////////////////////////////////////////////////////////////


