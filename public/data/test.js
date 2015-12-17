var visaData = rows.reduce( function(rowCollector, row,i){
  console.log('this is row data---',row)
  var rowData = row.split(/<td.*?>/).reduce( function( colCollector,col,j){
    if (j===0) return colCollector;
    // each column is a piece of data that you need
    var sanitized = col.replace(/(\n)|(<.*?>)|(&#160;)/g,'').replace(/\[\d+\]/g,'').trim()
    colCollector.push(sanitized);
    return colCollector;
  }, [])
  rowCollector.push(rowData);
    return rowCollector;
}, [])

visaData = visaData.filter(function(n){ return n.length != 0 });

var cleanVisaData = visaData.re


var codeData = codeRows.reduce( function(rowCollector, row,i){

  var codeRowData = row.split(/<td.*?>/).reduce( function( colCollector,col,j){
      if (j===0 || j>2) return colCollector;
    // each column is a piece of data that you need
    var sanitized = col.replace(/(\n)|(<.*?>)|(&#160;)/g,'').replace(/\[\d+\]/g,'').trim()
    colCollector.push(sanitized);
    return colCollector;
  }, [])
  rowCollector.push(codeRowData);
    return rowCollector;
}, [])

var n = s.indexOf('?');
s = s.substring(0, n != -1 ? n : s.length);
document.write(s);
