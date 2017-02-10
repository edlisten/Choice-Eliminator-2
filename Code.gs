// Issue tracker, for dialog box going behind sidebar: https://code.google.com/p/google-apps-script-issues/issues/detail?id=5762&thanks=5762&ts=1455685070


function onInstall(){
  onOpen();
}

function onOpen(){
  var ui = FormApp.getUi();
  ui.createAddonMenu()
  .addItem("Configure", 'openCE_Configure')
//  .addItem("(dev) CO", "openManageChoices")
  .addToUi(); 
}

function openCE_Configure(){
  var ui = FormApp.getUi();

  var html = HtmlService.createHtmlOutputFromFile('CE_Configure.html');
//  var html = HtmlService.createHtmlOutputFromFile('getmdl.html');
  html.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  html.setTitle("Choice Eliminator 2"); 
  ui.showSidebar(html);
}

function openManageChoices(qID){
  if(!qID){qID = "273191102"};
  
//  Logger.log("sdf");
  
  var cache = CacheService.getDocumentCache();
  cache.put("activeQuestion", qID);
  
  var ui = FormApp.getUi();
  var html = HtmlService.createTemplateFromFile('Choice_Options.html').evaluate()
  .setWidth(500)
  .setHeight(500);
  html.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.showModalDialog(html, "Choice Options");
}


function openCE_Settings(){
  
  var ui = FormApp.getUi();
  var html = HtmlService.createTemplateFromFile('CE_Settings.html').evaluate()
  .setWidth(500)
  .setHeight(500);
  html.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.showModalDialog(html, "Choice Options");
}

function openChangeLog(){
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1HjBdlSspRcd_2HSdw39k2xG0i-SmA2e05MrYcshFLFE/edit#gid=0");
  var sheets = ss.getSheets();
  var data = [];
  for (i in sheets){
   var c = sheets[i];
   var name = c.getName();
   var cData = c.getDataRange().getValues();
    data.push([name,cData]);
  }
  data = JSON.stringify(data);

  
  var ui = FormApp.getUi();
  var html = HtmlService.createTemplateFromFile('ChangeLog.html');
  html.data = data;
  html = html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME)  
  .setWidth(600)
  .setHeight(500);
  
  
  ui.showModalDialog(html, "Change Log");
}


function openTutorials(){
var htmlHead = '<!DOCTYPE html><html><head><base target="_top">' 
  + '<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">'
  +'</head><body>';
  var htmlFoot = '</body></html>'
  var htmlBody = ''
//  + '<div id="TableCont"></div>'
  + '<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLR82RnaWE64mSdajpAL4IWHZxmk79_Pa4" frameborder="0" allowfullscreen></iframe>';
//  + '<button onClick="google.script.host.close()">Close</button></p>';
  
  
  var htmlContent =   htmlHead + htmlBody + htmlFoot; 
  
  var html = HtmlService.createHtmlOutput(htmlContent);
  html.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  html.setHeight(350).setWidth(580);
  FormApp.getUi().showModalDialog(html, "Tutorials");


}



function openAbout(){
  var ui = FormApp.getUi();
  var html = HtmlService.createTemplateFromFile('about.html').evaluate()
  .setWidth(350)
  .setHeight(500);
  html.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.showModalDialog(html, "About Author");
}

function openGame(){
  var ui = FormApp.getUi();
  var html = HtmlService.createTemplateFromFile('AlienInvasion.html').evaluate()
  .setWidth(340)
  .setHeight(500);
  html.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.showModalDialog(html, "Alien Invasion");
}


function openWarning(){
  var ui = FormApp.getUi();
  var html = HtmlService.createTemplateFromFile('warning.html').evaluate()
  .setWidth(350)
  .setHeight(500);
  html.setSandboxMode(HtmlService.SandboxMode.IFRAME);
  ui.showModalDialog(html, "Note form the author");
}





function onFormSubmit(e){
onFormSubmitCE2(e);
}






function onFormSubmitCE2(e){  // runs on form submit  
//  Logger.log(e);
//  var test =  e.response;
//  var test2 = FormApp.getActiveForm().getResponses()[0].
//
//  Logger.log(test);
//  [16-03-08 10:48:48:257 EST] {authMode=FULL, response=FormResponse, source=Form, triggerUid=7653591281050302077}

//  return;
  
  //  {authMode=FULL, response=FormResponse, source=Form, triggerUid=8932146637340251770}
  var startTime = new Date();
  
  try{
    var source = e.source;
  } catch(err){
    source = FormApp.getActiveForm();
  }
//  var dataSheetName = e.range.getSheet().getName();
  
  try{
    choiceEliminator(source);
  } catch(err){
  }
  
  var endTime = new Date();
  var runTime = (endTime-startTime)/1000;
  PropertiesService.getDocumentProperties().setProperty("runTime", runTime); 
  //  Logger.log(runTime);
}