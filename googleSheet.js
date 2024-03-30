=IMPORTXML("https://www.bastillepost.com/hongkong/sitemap/generate/post/today", "//*[local-name() ='url']/*[local-name() ='loc']")

=IMPORTXML("https://www.bastillepost.com/hongkong/sitemap/generate/post/today", "//*[local-name() ='url']/*[local-name() ='lastmod']")

=ArrayFormula("all post, "&LEFT(B1:INDEX(B1:B,COUNT(B1:B)), 10))

=ArrayFormula(IF(ISBLANK(B1:INDEX(B1:B,COUNT(B1:B))), "", ArrayFormula("all post, "&LEFT(B1:INDEX(B1:B,COUNT(B1:B)), 10))))



function storeValue() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Sheet1');  
  var values = sheet.getRange("A1:A").getValues();
  var filter = values.filter(String);
  var valueLength = values.filter(String).length;
  var values2 = sheet.getRange("B1:B").getValues();
  var filter2 = values2.filter(String);
  var values3 = sheet.getRange("C1:C").getValues();
  var filter3 = values3.filter(String);
  var sheet2 = ss.getSheetByName('Sheet2'); // where to store the data
  var height = sheet2.getLastRow();
  var valuesA = sheet2.getRange("A1:A").getValues();
  var ss2Length = valuesA.filter(String).length; 
  var valuesB = sheet2.getRange("B1:B").getValues();  
  //sheet2.insertRowsAfter(height);

  var count = 0;

  for (var i = 0; i < valueLength; i++) {
      if (ss2Length < 1) {
        var range = sheet2.getRange("A1:A" + valueLength);
        range.setValues(filter);
        var range2 = sheet2.getRange("B1:B" + valueLength);
        range2.setValues(filter2);
        var range3 = sheet2.getRange("C1:C" + valueLength);
        range3.setValues(filter3);
        
        break;
      }
      for (var j = 0; j < ss2Length; j++) {
        if (values[i][0] === valuesA[j][0] && values2[i][1] === valuesB[j][1]) {
          count++;
        } else {

        }
      }
      if (count > 0) {
        count = 0;
      } else {
        var row = [values[i][0], values2[i][0], values3[i][0]];
        sheet2.appendRow(row);
      }
  }

  //sheet2.getRange(height+1, 1, valueLength, 1).setValues([[new Date()].concat(values)]); 
  //sheet2.getRange(height+1, 2, valueLength, 1).setValues([[new Date()].concat(values2)]);
  //sheet2.getRange(height+1, 3, valueLength, 1).setValues([[new Date()].concat(values3)]);

  var currentDate = new Date();//today
  var weekOld = currentDate.getTime() - 604800000;

  var sheet2Values = sheet2.getRange("B1:B").getValues();
  var valueLength2 = sheet2Values.filter(String).length;


  for (var i = 0; i < valueLength2; i++) {
    var time = new Date(sheet2Values[i][0]);
    var timeNumerical = time.getTime();
    if (timeNumerical <= weekOld) {
      sheet2.deleteRow(i + 1);
    }
  }

}

function GetSheetName() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
} 


function createTrigger() {
  if(ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction() == "storeValue").length == 0) {
    ScriptApp.newTrigger("storeValue").timeBased().everyDays(1).atHour(4).create();
  }
}

