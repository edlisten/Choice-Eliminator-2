//////////////////////////////////////////////////////////////////////////////////////////////////////
// Manage Choices
//////////////////////////////////////////////////////////////////////////////////////////////////////




function getMCDefaults() {
  var defaults = {};
  
  var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  var properties = PropertiesService.getDocumentProperties();
  var qId = CacheService.getDocumentCache().get("activeQuestion");
  if (!qId){qId = 273191102};
  var sheet = ss.getSheetByName(qId);
  var data = sheet.getDataRange().getValues();
  
  //  populate defaults
  defaults.data = data;
  
//  // get head information 
//  defaults.swButtonHead = HtmlService.createHtmlOutputFromFile("head_switchButton.html").getContent();
  
  return(defaults);
}  //end getMCDefaults()



function removeChoice(obj){
  //  if(!obj){ obj = {"choice":"Option 2", "id":1397141730}};
  var choice = obj.choice;
  var id = obj.id;
   var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  var sheet = ss.getSheetByName(id);
  var data = sheet.getDataRange().getValues();
  
  for (var i=8; i<data.length;i++){
    if (data[i][0] == choice){
      var row = i+1;
      break;
    }
  }
  
  sheet.deleteRow(row);
  updateForm(ss);
}



function getChoicesFromForm(id){
  if(!id){ id = 1187728346};
  
  var form = FormApp.getActiveForm();
  var ques = form.getItemById(id);
  var qTypeAs = getAsQuestionType(ques);
  var qChoices = qTypeAs.getChoices();
  
  // get choices from the form
  var choicesData = [];
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
      '=COUNTIF(INDIRECT(B$1&"!C"&B$2&":C"&B$2,false),"*"&INDIRECT("A"&ROW())&"*")',
      '=INDIRECT("H"&row())-INDIRECT("B"&row())'
    ]);
  }
  
  
  // get choices from sheet
  var ss = getActiveSS(form);
  var sheet = ss.getSheetByName(id);
  var data = sheet.getDataRange().getValues();
  var choicesFromSheet = [];
  
  for (var i=8; i<data.length;i++){
    choicesFromSheet.push([data[i][0],data[i][1],data[i][2],data[i][3],data[i][4],data[i][5]]);
  }
  
  var a = choicesData;
  var b = choicesFromSheet;
  var seen = [], diff = [], rem = [];
  for ( var i = 0; i < b.length; i++){
    seen[b[i][0]] = true;
  }
  for ( var i = 0; i < a.length; i++){
    if (!seen[a[i][0]]){
      diff.push(a[i]);
    } else {
      rem.push(a[i]);
    }
  }
  
//  SpreadsheetApp.getActiveSheet().appendRow(rowContents)
  for (i in diff){
   sheet.appendRow(diff[i]); 
  }
  
  sheet.getRange("A:A").setNumberFormat('@STRING@');
  
  return;
  
//  updateForm(ss);
}


function changeLimit(obj){
  //  if(!obj){obj = {choice: "Option 3", id: "1397141730", limit: "3"}};
  var choice = obj.choice;
  var id = obj.id;
  var limit = obj.limit;
  var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  var sheet = ss.getSheetByName(id);
  var data = sheet.getDataRange().getValues();
  
  for (var i=8; i<data.length;i++){
    if (data[i][0] == choice){
      var row = i+1;
      break;
    }
  }
  
  sheet.getRange(row, 3, 1, 1).setValue(limit);
  
  updateForm(ss, form);
  
  return;
}


function onSortChange(obj){ // 
  if(!obj){obj = {start: 11, end: 9, id: 1187728346}};
  var id = obj.id;
  var s = obj.start;
  var e = obj.end;
  var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  var sheet = ss.getSheetByName(id);

  var sVal = "";
  var diff = "";
  var sRow = "";
  var dRow = "";
  
  if (s>e){
    diff = s-e;
    sVal = sheet.getRange(s, 1, 1,6).getValues();  
    sRow = e;
    dRow = e;
  } else {
    diff = e-s;
    sVal = sheet.getRange(e, 1, 1,6).getValues();  
    sRow = e-diff;
    dRow = s;
  }

  
  var sRange = sheet.getRange(sRow, 1, diff, 6);
  var eRange = sRange.offset(1, 0);
  sRange.moveTo(eRange);
  sheet.getRange(dRow, 1, 1, 6).setValues(sVal);
  
  
  
//  var startRange = sheet.getRange(obj.start, 1, 1,6);
//  var endRange = sheet.getRange(obj.end, 1, 1,6);
//  var endRangeV = endRange.getValues();
//  startRange.moveTo(endRange);
//  startRange.setValues(endRangeV);
  
  sheet.getRange("A:A").setNumberFormat('@STRING@');
  SpreadsheetApp.flush();
  updateForm(ss, form);
}


function saveBackupText(obj){
  //  if(!obj){obj = {"newText":"Change to this","id":1397141730}};
//  Logger.log(obj)
  var id = obj.id;
    var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  var sheet = ss.getSheetByName(id);
  sheet.getRange("B6").setValue(obj.newText);
  return;
}


function addChoice(obj){
  //  Logger.log(obj);
  //  if(!obj){obj =  {"newChoice":"this is my choice", "id":1397141730}};
  var id = obj.id;
    var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  var sheet = ss.getSheetByName(id);
  var rowData = [obj.newChoice,0,1,'','','','','=COUNTIF(INDIRECT(B$1&"!C"&B$2&":C"&B$2,false),"*"&INDIRECT("A"&ROW())&"*")','=INDIRECT("H"&row())-INDIRECT("B"&row())'];
  
  
  var newRange = sheet.appendRow(rowData)
  sheet.getRange("A:A").setNumberFormat('@STRING@');
  SpreadsheetApp.flush();
  updateForm(ss, form);
  return;                 
  
  
};



function resetCount(id){

  resetAllCounts(id);
  return;
}

