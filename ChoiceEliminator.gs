function choiceEliminator(form,ss){
  
  if(!form){form = FormApp.getActiveForm() };
  if(!ss){ss = getActiveSS(form)};
  var dataSheetName = PropertiesService.getDocumentProperties().getProperty("dataSheet");
  var allSheets = ss.getSheets();
//  SpreadsheetApp.flush();
  
  for (h in allSheets){
    var c = allSheets[h];
    SpreadsheetApp.flush();
    var sName = c.getName();
    if(sName == dataSheetName){continue};
    var sheetData = c.getDataRange().getValues(); 
    try {
    var B4 = sheetData[3][1];
    var C5 = sheetData[4][2];
    } catch(err){ continue };
    var choices = [];
    var choicesPLN = [];
    if (sName == B4){
      var nChoices = sheetData[6][11]; //Cell L7
      var end = 8+nChoices;
      //update Choices
      if (C5 == true){
        for (var i=8; i<end; i++){
          var combined = sheetData[i][11];
          var combined_PNT = sheetData[i][9];
          var combined_PNTId = sheetData[i][10];
          choicesPLN.push([combined,combined_PNT,combined_PNTId]);
        };
        updateChoicesWithPLN(B4,choicesPLN,form);
        
      } else {
        
        for (var i=8; i<end; i++){
          var combined = sheetData[i][11];
          choices.push(combined)
        };
        updateChoices(B4,choices,form);
        
      }
    }
  }
  
}

function updateChoices(id,choices,form){  
  var ques = form.getItemById(id);
  var quesAs = getAsQuestionType(ques);
  quesAs.setChoiceValues(choices);
}






function updateChoicesWithPLN(id,choicesPLN,form){

  if (!form){
    form = FormApp.getActiveForm();
  }
  if (!choicesPLN){ choicesPLN = [["Go To Page 2", "GO_TO_PAGE", 1255540175], ["Go To Page 3", "GO_TO_PAGE", 1103976777],["Submit","SUBMIT",""]]};
  if (!id){id = "1310873270"}; 
  
  
  var ques = form.getItemById(id);
  var quesAs = getAsQuestionType(ques);  // reinable befor publication.  If you don't do this the auto-populate feature won't work.
  
  var newQSet =[];
  for (i in choicesPLN){
   var c = choicesPLN[i];
   
   var cName = c[0];
   var cType = c[1]; 
   var cPageId = c[2];
    
   var cPLN = ""; 
    if(cType == "GO_TO_PAGE"){
     cPLN = form.getItemById(cPageId).asPageBreakItem();
    } else {
      
      switch (cType){
        case "CONTINUE":
          cPLN = FormApp.PageNavigationType.CONTINUE;
          break;
        case "RESTART":
          cPLN = FormApp.PageNavigationType.RESTART;
          break;
       case "SUBMIT":
          cPLN = FormApp.PageNavigationType.SUBMIT;
          break;
        default:
          cPLN = FormApp.PageNavigationType.CONTINUE; 
      }
    }
    
    var choices = quesAs.createChoice(cName, cPLN);
    newQSet.push(choices); 
  }
  quesAs.setChoices(newQSet);
}