$(document).ready(function(){ 
  var timer = null,
      level = 1,
      max = 20,
      duration = 1000,
      clientWidth = $(window).width(),
      clientHeight = $(window).height(),
      //clientHeight = document.getElementById('content').clientHeight;
      r = 600/ 2,
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
      .attr("width", 25 * 2)
      .attr("height", 250 * 2)
      .attr('id','path')
    .append("g")
      .attr("transform", "translate(" + 25 + "," + 10 + ")");

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
/*
  $('#play').click(function() {
    if (level > max) level = 1;
    plotLevel();
    if (timer) clearInterval(timer);
    timer = setInterval(function() {
      if (level <= max) plotLevel();
      else $('#stop').click();
    }, duration);
    $(this).hide();
    $('#stop').show();
  });
/*
  $('#stop').click(function() {
    if (timer) clearInterval(timer);
    $(this).hide();
    $('#play').show();
  });
*/

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

  document.getElementsByTagName("svg")[0].onclick=function(e){
    if(e.target.tagName.toLowerCase() === 'circle')
    {
      vis2.call(path(e.target.id,1));
    }
  };
});
