$(document).ready(function(){ 
  var timer = null,
  level = 1,
  max = 20,
  duration = 1000,
  r = 600 / 2,
  animation=false,
  collatz = reverseCollatz(r, max),
  path = collatz_path(max,1);

  var vis = d3.select("#vis")
  .append("svg")
  .attr("width", r * 2)
  .attr("height", r * 2)
  .append("g")
  .attr("transform", "translate(" + r + "," + r + ")");

  var vis2 = d3.select("#vis2")
  .append("svg")
  .attr("width", 50 * 2)
  .attr("height", 300 * 2)
  .attr('id','path')
  .append("g")
  .attr("transform", "translate(" + 25 + "," + 100 + ")");

  var example_even = d3.select("#even-example")
  .append("svg")
  .attr("width", 12)
  .attr("height", 12)
  .append("g")
  .attr("transform", "translate(" + 6 + "," + 6 + ")")
  .append("circle")
  .attr("r", 5)
  .attr("class","even");
  
  var example_odd = d3.select("#odd-example")
  .append("svg")
  .attr("width", 12)
  .attr("height", 12)
  .append("g")
  .attr("transform", "translate(" + 6 + "," + 6 + ")")
  .append("circle")
  .attr("r", 5)
  .attr("class","odd");

  function plotLevel() {
    if (level <= max) {
      $('#level-val').text(level);
      vis.call(collatz(level, duration));
      if(animation){
        level++;
      }
      else{
        level=document.querySelector('output').textContent;
        if (timer) clearInterval(timer);
        vis.call(collatz(level, duration));
      }
    }
  }

  $('#play').click(function() {
    animation=false;
    level=document.querySelector('output').textContent;
    $('#level-val').text(level);
    if (timer) clearInterval(timer);
    vis.call(collatz(level, duration));
  });

  $('#animation').click(function() {
    animation=true;
    level=1;
    if (level > max) level = 1;
    plotLevel();
    if (timer) clearInterval(timer);
    timer = setInterval(function() {
      if (level <= max) plotLevel();
      else $('#stop').click();
    }, duration);
  }).click();

  document.getElementsByTagName("svg")[2].onclick=function(e){
    if(e.target.tagName.toLowerCase() === 'circle')
    {
      vis2.call(path(e.target.id,1));
    }
  };

  document.getElementById("input_button").onclick=function(e){
    var x=document.getElementById("input_number").value;
    if (!(isNaN(x) || x<2 || x % 1 != 0))
    {
      vis2.call(path(x,1));
    }
  };
  
});
