




function getActiveSS(form){
  if(!form){form = FormApp.getActiveForm()};
  try{
  var id = form.getDestinationId();
  var ss = SpreadsheetApp.openById(id);
  } catch(err){
    var formD = DriveApp.getFileById(form.getId());  
    var title = formD.getName();
    var ss = SpreadsheetApp.create(title +" (Responses)");
    var destID = ss.getId();
    var destSheet = DriveApp.getFileById(destID);
    var parents = formD.getParents();
    while (parents.hasNext()){
      parents.next().addFile(destSheet);
    }
    DriveApp.removeFile(destSheet)
    form.setDestination(FormApp.DestinationType.SPREADSHEET, destID);
  }
  
  return ss;
}





function updateForm(ss, form){
  
  if(!form){form = FormApp.getActiveForm()};
  if(!ss){var ss = getActiveSS(form)};
//  var dataSheetName = PropertiesService.getDocumentProperties().getProperty("dataSheet");
  choiceEliminator(form, ss);
//  ss.toast("Form Choices Updated");
}


function subtractArrays(a,b){
//  https://radu.cotescu.com/javascript-diff-function/
//  var a = [1,2,3,4,5,6,7];
//  var b = [5,4,3];
  
    var seen = [], diff = [];
  for ( var i = 0; i < b.length; i++)
      seen[b[i]] = true;
  for ( var i = 0; i < a.length; i++)
      if (!seen[a[i]])
          diff.push(a[i]);

  return diff;  
}


function deleteProperties(){
  // Deletes all user properties.
 var scriptProperties = PropertiesService.getDocumentProperties();
 var documentProperties = PropertiesService.getDocumentProperties();
 var userProperties = PropertiesService.getUserProperties();
  
 scriptProperties.deleteAllProperties();
 documentProperties.deleteAllProperties();
 userProperties.deleteAllProperties();
  
}

//function deleteCEProperties(properties){
//  if(!properties){ properties = PropertiesService.getDocumentProperties() };
//  
//  //From CE1
//  var allProps = properties.getKeys();
//  for (i in allProps){
//    var c = allProps[i];
//    var a = c.substring(0,13);
//    if (a == "choiceOptions"){
//   properties.deleteProperty(c);
//    }
//  }
//  properties.deleteProperty('choiceEliminator');
//  properties.deleteProperty('formSettings');
//}


function reseteverything(){
  
  var properties = PropertiesService.getDocumentProperties();
  
  //From CE1
  var allProps = properties.getKeys();
  for (i in allProps){
    var c = allProps[i];
    var a = c.substring(0,13);
    if (a == "choiceOptions"){
   properties.deleteProperty(c);
    }
  }
  properties.deleteProperty('choiceEliminator');
  properties.deleteProperty('formSettings');
  
  // CE Lite
  properties.deleteProperty('noMoreOptions');
  properties.deleteProperty('CEIds');
  
  //From CE2  
  properties.deleteProperty('runTime');
  properties.deleteProperty('dataSheet');
  properties.deleteProperty('CE2version');
  
  
  //Remove Trigger
  var triggers = ScriptApp.getUserTriggers(FormApp.getActiveForm());
    for (var i = 0; i < triggers.length; i++) {
      if (triggers[i].getEventType() == ScriptApp.EventType.ON_FORM_SUBMIT) {
        ScriptApp.deleteTrigger(triggers[i]);
      }
    }
  
  //Remove Sheets
    // loop through allSheets
  var form = FormApp.getActiveForm();
  var ss = getActiveSS(form);
  var allSheets = ss.getSheets();
  
  for (h in allSheets){
    var sheet = allSheets[h];
    var sName = sheet.getName();
    var B4 =  allSheets[h].getRange("B4").getValue();
    var A2 =  allSheets[h].getRange("A2").getValue();
    if (sName == B4){ss.deleteSheet(sheet)};
    if (A2 == "FormQId"){sheet.deleteRow(2)};    
    
  }
  
  
  


}

//function tempProp(){
//  var properties = PropertiesService.getDocumentProperties();
//  properties.setProperty("choiceOptions-1234567", "value");
//  properties.setProperty("choiceOptions-2345678", "value");
//  properties.setProperty("choiceOptions-3456789", "value");
//  properties.setProperty("choiceEliminator", "value");
//  properties.setProperty("formSettings", "value");
//}







function getAsQuestionType(ques){
  var qType = ques.getType();
  var as = "";
  switch (qType){
    case FormApp.ItemType.CHECKBOX:
      as = ques.asCheckboxItem();
      break;
    case FormApp.ItemType.MULTIPLE_CHOICE:
      as = ques.asMultipleChoiceItem();
      break;
    case FormApp.ItemType.LIST:
      as = ques.asListItem();
      break;
      
  }
  return as;
}