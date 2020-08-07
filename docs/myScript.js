var current;
var selectedChoices = [];
var user='Hafsah';

function myScript()
{
 
  plotChart('monthly','',null);
  document.getElementById('optionsdiv').style.display = "none";
  document.getElementById('yearlybutton').onclick= function() {plotChart('yearly','', selectedChoices);plotpiechart('yearly','');current='yearly';}
  document.getElementById('monthlybutton').onclick= function() {plotChart('monthly','', selectedChoices); plotpiechart('monthly','');current='monthly';hidePiechart();}
  document.getElementById('weeklybutton').onclick= function() {plotChart('weekly','', selectedChoices);current='weekly'; hidePiechart();}
  document.getElementById('bonusbutton').onclick= function() {plotChart('monthly','1stbonus', selectedChoices);plotpiechart('monthly','1stbonus');current='monthly';displaySuggestions();}
  document.getElementById('2ndbonusbutton').onclick= function() {plotChart('monthly','2ndbonus', selectedChoices);plotpiechart('monthly','2ndbonus');current='monthly';displaySuggestions();}
  document.getElementById('choosedata').onclick= function() {choosedata();}
  document.getElementById('optionsbutton').onclick= function() {selectData();}

}

function choosedata()
{
  var x = document.getElementById("optionsdiv");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }


}

function selectData()
{


  var input = document.getElementsByClassName('opt');
  var choices=[];

  for (var i = 0; i < input.length; i++)
  {
    if(input[i].checked)
    {
      choices.push(input[i].value); 
    }
    input[i].checked=false;
  }

if(choices)
{
choices.unshift("Period");
}
selectedChoices = choices;

//use choices....
plotChart(current,'', choices);

}


function tryresponisve()
{

  var trydiv = document.getElementById('tryDiv');
  var trace1 = {
    type: 'bar',
    x: [1, 2, 3, 4],
    y: [5, 10, 2, 8],
    marker: {
        color: '#C8A2C8',
        line: {
            width: 2.5
        }
    }
};

var data = [ trace1 ];

var layout = {
  title: 'Responsive to window size!',
  font: {size: 18}
};

Plotly.newPlot('charts', data, layout, {responsive: true});
}



function mapLink(val)
{
  var link = "https://gist.githubusercontent.com/sultantariq/b18d628b5b1e408f692c18368b447d80/raw/1a4d1926d791a9742e6b849552bc9353490421d5/Hafsah_2020_AllMonthly.new_cell_values";

if (val=='weekly')
{
  link="https://gist.githubusercontent.com/sultantariq/92859b8821fd162d8625d3139873cdcd/raw/483eb12067a1a6f714d5ca4f77c9f58b19b99324/Hafsah_2020_Allweekly.csv"
}

else if (val == 'monthly')
{
  link="https://gist.githubusercontent.com/sultantariq/b18d628b5b1e408f692c18368b447d80/raw/1a4d1926d791a9742e6b849552bc9353490421d5/Hafsah_2020_AllMonthly.csv"
}

else if (val == 'yearly')
{
  link="https://gist.githubusercontent.com/sultantariq/353ed4b2120c214d8ecdcab3c21bd1bb/raw/6363a344beea369f3426b76d15b63da5bee46e55/Hafsah_AllYears.csv"
}
return link;

} 






function find(key, array) {
  // The variable results needs var in this case (without 'var' a global variable is created)
  var results = [];
  for (var i = 0; i < array.length; i++) {
    if (array[i].indexOf(key) == 0) {
      results.push(i);
    }
  }
  return results;
}


function plotChart(val,selectIndex,choices)
  {

  var graphDiv = document.getElementById('charts');

  var link = mapLink(val);

  file=Plotly.d3.csv(link, function(err, rows) 
  {
    function unpack(rows, key) {
      return rows.map(function(row) {
        return row[key];
      });
  }
  // header values
  var headerNames = Plotly.d3.keys(rows[0]); 

  headerNames=headerNames.slice(3,16) // as we just need first 15 values
  headerValues_=[]

  for (i = 0; i < headerNames.length; i++) // getting rid of first two headers
  {
    headerValues_[i]=headerNames[i]
  } 

  // cell values
  var cellValues = [];
  for (i = 0; i < headerValues_.length; i++) // getting rid of first two coloumns
  {
    cellValue = unpack(rows, headerValues_[i]);
    cellValues[i] = cellValue;
  }
 
  
  choiceArray=[]
 if(choices)
  {
    choiceArray = choices;
    //choiceArray.unshift("Period");

  }
  
  
  
  //choiceArray=[];
  index_array=[];

  if (choiceArray.length>0)
  {
    
    for (i=0; i<choiceArray.length;i++)
    {
    index_array[i]=headerValues_.indexOf(choiceArray[i]);
    }
    

    var new_cell_values = index_array.map(i => cellValues[i])
    var new_header_values = index_array.map(i => headerValues_[i])

    cellValues=new_cell_values;
    headerValues_=new_header_values;
    headerValue=headerValues_;

  }
  else
  {
    headerValue=headerValues_.slice(0,4);  // getting 4 coloumns for table 
  }




if (!!selectIndex) //update for others
  {
  if (selectIndex=="1stbonus")
    {

     
      months=['Jan 2020','Feb 2020','Mar 2020']
      indexes=getIndex(months,cellValues[0])
      firstBonusMonths= indexes
      //get the incoming calls kpi
      var kpi=Math.round(getKPI(cellValues,1,firstBonusMonths))
 
//get the talk time
      talkTimePerMin= getKPI(cellValues,3,firstBonusMonths)
 if (talkTimePerMin >2)
 {
  talkTimePerMinValue=headerValue[3]+' : ' +talkTimePerMin
 }
 else 
 {
  talkTimePerMinValue= ""
 }
 kpi=kpi +' for 1st Bonus';
  document.getElementById("kpi").textContent=kpi;
  document.getElementById("talkTimePerMinValue").textContent=talkTimePerMinValue;

//get the Pause time
   pauseTimePerday= getKPI(cellValues,8,firstBonusMonths)
 if (pauseTimePerday >1)
 {
  pauseTimePerdayValue=headerNames[8]+' : ' +pauseTimePerday + 'hours = ' + pauseTimePerday*60 +'mins'
 }
 else 
 {
  pauseTimePerdayValue= ""
 }
document.getElementById("pauseTimePerdayValue").textContent=pauseTimePerdayValue;


    }
  else if (selectIndex=="2ndbonus")
    {
      months=['Apr 2020','May 2020','Jun 2020']
    
      indexes=getIndex(months,cellValues[0])
      secondBonusMonths=indexes
 var kpi=Math.round(getKPI(cellValues,1,secondBonusMonths))

  kpi=kpi +' for 2nd Bonus';    
  document.getElementById("kpi").textContent=kpi;
  //get the talk time
      talkTimePerMin= getKPI(cellValues,3,secondBonusMonths)
 if (talkTimePerMin >2)
 {
  talkTimePerMinValue=headerValue[3]+' : ' +talkTimePerMin
 }
 else 
 {
  talkTimePerMinValue= ""
 }
  document.getElementById("talkTimePerMinValue").textContent=talkTimePerMinValue;
  //get the Pause time
   pauseTimePerday= getKPI(cellValues,8,secondBonusMonths)
 if (pauseTimePerday >1)
 {
  pauseTimePerdayValue=headerNames[8]+' : ' +pauseTimePerday + 'hours = ' + pauseTimePerday*60 +'mins'
 }
 else 
 {
  pauseTimePerdayValue= ""
 }
document.getElementById("pauseTimePerdayValue").textContent=pauseTimePerdayValue;

      
    }
    else if (selectIndex=="2019")
    { 
      months=['Sep 2019','Oct 2019','Nov 2019','Dec 2019']
      //ind=getIndex(listArray,cellValues[0])
      indexes=getIndex(months,cellValues[0])
     
    }
    else if (selectIndex=="2020")
    { months=['Jan 2020','Feb 2020', 'Mar 2020','Apr 2020','May 2020','Jun 2020','Jul 2020','Aug 2020','Sep 2020']
      //ind=getIndex(listArray,cellValues[0])
      indexes=getIndex(months,cellValues[0])

    }
  else
    {
      indexes=find(selectIndex,cellValues[0]); 
    }
   
  
    var results = [];
    var temp=indexes
    var firstItem=temp[0];
    var lastItem = temp.slice(-1).pop()+1;

  
    for(var i = 0; i < cellValues.length; i++)
    {
      results.push(cellValues[i].slice(firstItem,lastItem));
    }
 
    cellValue=results.slice(0,4)
}



else
{
  cellValue=cellValues.slice(0,headerValue.length);
}



columnorders=[];
for (i=0; i<headerValue.length;i++)
 {
  columnorders.push(i);
 }

  // create table
  var table = {
    type: 'table',
    columnwidth: [350,455,455,455],
    columnorder: columnorders, //[0,1,2,3],
    header: {
      values: headerValue,
      align: "center",
      line: {width: 1, color: 'rgb(50, 50, 50)'},
      fill: {color: ['rgb(13, 93, 174)']},
      font: {family: "Arial", size: 11, color: "white"}
    },
    cells: {
      values: cellValue,
      align: ["center", "center"],
      line: {color: "black", width: 1},
      fill: {color: ['rgb(28, 113, 199)', 'rgba(228, 222, 249, 0.65)']},
      font: {family: "Arial", size: 10, color: ["black"]}
    },
    xaxis: 'x',
    yaxis: 'y',
    domain: {x: [0,0.4], y: [0,1]}
  }

 if (choiceArray.length>0)
{
var data_for=[];
var new_header_names=index_array.map(i => headerNames[i])


for (i = 0; i <new_header_names.length; i++) {
data_for[i]= {x: unpack(rows, new_header_names[0]),
    y: unpack(rows, new_header_names[i+1]),
    //xaxis: 'x1',
    //yaxis: 'y1',
    type: 'bar',
    //mode: 'lines',
    //Sline: {width: 2, color: '#9748a1'},
    name: new_header_names[i+1]
}
  }
}
else
{


//get data for charts (Incoming,Outgoing,Sum and Period)
var data_for=[];
newRows= rows.slice(firstItem,lastItem)

for (i = 0; i < 3; i++) {
data_for[i]= {x: unpack(newRows, headerNames[0]),
    y: unpack(newRows, headerNames[i+1]),
    //xaxis: 'x1',
    //yaxis: 'y1',
    type: 'bar',
    //mode: 'lines',
    //Sline: {width: 2, color: '#9748a1'},
    name: headerNames[i+1]
}
  }
}

  //var data = [trace1,trace2,trace3];
  var tab= [table];

  // define subplot axes
  var axis = {
    showline: true,
    zeroline: false,
    showgrid: true,
    mirror:true,
    ticklen: 4,
    gridcolor: '#ffffff',
    tickfont: {size: 10},
  }

  // define layout
  var layout = {
    title: user+"'s "+val+" data",
    showlegend: false,  
    barmode: 'stack',
    autosize: true,
  }
  var lay = {
    width: 1400,

  }




// Plotting the table and chart

  Plotly.newPlot('table', tab,lay,{displaylogo: false},{responsive: true});
  Plotly.newPlot('chartplot', data_for, layout,{displaylogo: false},{responsive: true});



});

document.getElementById('table').onclick= function(e) {

//if (e.target.__data__.value=='jan_2020')
  //      jan_2020();
  var value=e.target.__data__.value;


  monthNames=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  getValue= find(value.slice(0,3), monthNames)
  
  if (getValue.length>0)
    {

     plotChart('weekly',value.slice(0,3),selectedChoices);
     plotpiechart('monthly','',value.slice(0,3))
    

    }

  yearNames=["2017","2018","2019","2020"];
  
  getYearValue= find(value.slice(5, 9), yearNames);
  
  
  if (getYearValue.length>0)
    {
      if (value.slice(5,9) == 2019 )
      {
        plotChart('monthly','2019');
      }
      else if (value.slice(5,9) == 2020 )
      {
        plotChart('monthly','2020');
      }
     
    }
 
  }


  

document.getElementById('chartplot').onclick= function(e) {



  }


}
function getIndex(listArray,ValuesOfCell)
{
    ind=[]
      for (i=0; i<listArray.length;i++)
      {
        ind.push(find(listArray[i],ValuesOfCell)); 
      }
      indexes=[]
      for (i=0; i<ind.length;i++)
      {
        indexes.push(ind[i][0]); 
      }
      indexes=indexes.filter(item => item !== undefined)
      return indexes;

}


function hidePiechart()
{
  document.getElementById("pieDiv").style.display = "none";
  document.getElementById("table").getElementsByClassName("svg-container")[0].style.height = "100%";

}

function plotpiechart(val,selectIndex,monthname)
{

document.getElementById("pieDiv").style.display = "block";
/*if (val == 'monthly')
{
  link="https://gist.githubusercontent.com/sultantariq/b18d628b5b1e408f692c18368b447d80/raw/b09d2205886b64037622dc1fb4b47ae3bc576886/Hafsah_2020_all_monthly_chart.csv"
}
*/
var link = mapLink(val);

file2=Plotly.d3.csv(
  link,
  function(err, rows) {
    function unpack(rows, key) {
      return rows.map(function(row) {
        return row[key];
      });
    }
var headerNames = Plotly.d3.keys(rows[0]);


headerNamesData=headerNames.slice(16,21); // too get the specific data i.e last 5 coloumns


period=unpack(rows, headerNames[3]); 



var cellValues = [];
  for (i = 0; i < headerNamesData.length; i++) {
    cellValue = unpack(rows, headerNamesData[i]);
    cellValues[i] = cellValue;
   
  }

 //to get every first value from cellValues Array so that data of a row is in one array
new_val=[];

  for (i = 0; i < rows.length; i++) {
new_val[i]=cellValues.map(function(x) {
        return x[i];
    });
} 

if (!!selectIndex)
 
  {
  if (selectIndex=="1stbonus")
    {
       months=['Jan 2020','Feb 2020','Mar 2020']
      indexes=getIndex(months,period)
      firstBonusMonths= indexes
  var start=firstBonusMonths[0]
  var temp=firstBonusMonths
  var end=temp.slice(-1).pop()+1;
  
    rows=rows.slice(start,end) //first three rows of 2020 monthly file - update this for other
   
    period=period.slice(start,end)
    new_val=new_val.slice(start,end)

    }
  else if (selectIndex=="2ndbonus")
    {
      months=['Apr 2020','May 2020','Jun 2020']
      indexes=getIndex(months,period)
      secondBonusMonths= indexes
  var start=secondBonusMonths[0]
  var temp=secondBonusMonths
  var end=temp.slice(-1).pop()+1;


    rows=rows.slice(start,end) //nect three rows of 2020  monthly file - update this for others
    period=period.slice(start,end)
    new_val=new_val.slice(start,end)
    }
}


/*
var data = [{
  values: new_val[0],
  type: 'pie',
  name: period[2][0],
  labels: headerNamesData,
  domain: {
    row: 0,
    column: 0
  },
  hoverinfo: 'headerNamesData',
},{
  values: new_val[1],
  labels: headerNamesData,
  type: 'pie',
 name: period[0][1],
  domain: {
    row: 1,
    column: 0
  },
  hoverinfo: 'headerNamesData',
 
}];
*/

new_data=[]

for (i=0; i<rows.length; i++)
{

new_data[i] = {
  values: new_val[i],
  type: 'pie',
  name: period[i],
  labels: headerNamesData,
  domain: {
    row: 0,
    column: i
  },
  hoverinfo: 'headerNamesData',
};
}
var layout = {
  height: 700,
  width: 1000,
  grid: {rows: 1, columns: 3}
};

if (!!monthname)
   {
    indexes=find(monthname,period);
    index=indexes[0] 
    console.log(index)
    rows=rows.slice(indexes[0],indexes[0]+1);
    period=period.slice(indexes[0],indexes[0]+1);
 new_data=[]
 new_data[0] = {
  values: new_val[index],
  type: 'pie',
  name: period,
  labels: headerNamesData,
  domain: {
    row:0,
    column: 0
  },
  hoverinfo: 'headerNamesData',
};
var layout = {
  height: 600,
  width: 1000,
  grid: {rows: 1, columns: 1}
};
   }

Plotly.newPlot('pieDiv', new_data,layout);
 });






}

function displaySuggestions()
{
 var x = document.getElementById("suggetions");
  x.style.display = "block";
}

  



function display()
{
 var x = document.getElementById("suggetions");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function getKPI(cellValues,argument,bonusIndex)
{
  var nom_val= cellValues[argument]
  var loginDays=cellValues[10]
  var ab=[]
      for (i=0; i<nom_val.length;i++)
      {
        ab[i]=nom_val[i]*loginDays[i]
      }

  var temp=bonusIndex
  var end=temp.slice(-1).pop()+1;
  a=ab.slice(bonusIndex[0],end)
  nom=a.reduce(function(a, b) { return a + b; }, 0); // sum of all the elements in an array
  a=loginDays.slice(bonusIndex[0],end)
  a=a.map(function(v){return +v}) //change string array to number array
  
  denom=a.reduce(function(a, b) { return a + b; }, 0);
  value= (nom/denom);
  return value

}
  
