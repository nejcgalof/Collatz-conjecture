var collatz_path = function(num, duration) { 
	var numbers={};
 	var oldNodes1 = {};

  	function treeChildren1(max) {
    	return function(d, i) {
			return i < max ? numbers[d] : null;
    	};
  	}

	/*function getOldParent1(d) {
    	var n = d;
    	while (n) {
      	var old = oldNodes1[n.data];
      	if (old) return old;
      		n = n.parent;
    	}
    	return d;
  	}

  	function children1(d, i) {
    	return (d.children1 || []).map(function(v) {
      		return {
        		oldParent: getOldParent1(d),
        		parent: d,
        		child: v
      		};
    	});
  	}*/

	var tree1 = d3.layout.tree()
    	.size([360, 500 - 20])
    	.sort(null)
    	.value(String)
    	.separation(function(a, b) { return a.parent == b.parent ? 6.5 : 5.5; });

  	// Radial scales for x and y.
  	function xs(d) { return d.y * Math.cos((d.x - 90) / 180 * Math.PI); }
  	function ys(d) { return d.y * Math.sin((d.x - 90) / 180 * Math.PI); }

  	function toffset(d) { return d.x <= 270 && d.x >= 90 ? 8 : -8; }

	function plot(num, duration) {
    	return function() {
    		numbers={};
    		oldNodes1 = {};
    		var k= d3.select("#path");
    		k.select("g.parent").selectAll("*").remove();
    		var n=num;
			var f=n;
			f = (f % 2 == 0) ? f / 2 : f * 3 + 1;
			numbers[f] = [n];
			while (n != 1 && f!=1){
				n = (n % 2 == 0) ? n / 2 : n * 3 + 1;
			    f=n;
			    f = (f % 2 == 0) ? f / 2 : f * 3 + 1;	
			    numbers[f] = [n];
			}
			var key, count = 0;
			for(key in numbers) {
			  if(numbers.hasOwnProperty(key)) {
			    count++;
			  }
			}
			console.log(numbers);
			var vis = this,
			nodes = tree1.children(treeChildren1(count))(1);

			var link = vis.selectAll("g.link")
          		.data(nodes, function(d) { return d.data; });

     		var linkEnter = link.enter().append("g")
          		.attr("class", "link");

      		var line = link.selectAll("line").data(nodes.slice(0,count));
      		line.enter().append("line")
          		.attr("x1", function(d) { return xs(d); })
          		.attr("y1", function(d) { return ys(d); })
          		.attr("x2", function(d) { return xs(d.children[0]); })
          		.attr("y2", function(d) { return ys(d.children[0]); });
      		line.transition()
          		.duration(duration)
          		.attr("x1", function(d) { return xs(d); })
          		.attr("y1", function(d) { return ys(d); })
          		.attr("x2", function(d) { return xs(d.children[0]); })
          		.attr("y2", function(d) { return ys(d.children[0]); });
      		line.exit().remove();
      		link.exit().remove();

      		var node = vis.selectAll("g.node")
          		.data(nodes, function(d) { return d.data; });
     		var nodeEnter = node.enter().append("g")
          		.attr("class", "node")
          		.attr("transform", function(d) {
            var p = d; //d.parent || d;
            	return "translate(" + xs(p) + "," + ys(p) + ")";
          	});
      		nodeEnter.append("circle")
          		.attr("r", 5)
          		.attr("id",(function(d) { return d.data; }))
          		.attr("class",(function(d) { 
            		if(d.data%2==0){return "even";}
            		else{return "odd";}
           		}));
      		nodeEnter.append("text")
          		.attr("dy", ".31em");
      		node.exit().remove();
      		node.transition()
          		.duration(duration)
          		.attr("transform", function(d) { return "translate(" + xs(d) + "," + ys(d) + ")"; });
      		node.select("text")
          		.attr("text-anchor", function(d) { return d.x <= 270 && d.x >= 90 ? "start" : "end"; })
          		.attr("transform", function(d) {
            var o = d;
            	return "rotate(" + (d.x + (d.x <= 270 && d.x >= 90 ? -180 : 0)) + ")translate(" + toffset(d) + ")";
          	})
          	.text(function(d) { return d.data; })
        		.transition()
          		.duration(duration)
          		.attr("transform", function(d) { return "rotate(" + (d.x > 270 || d.x < 90 ? d.x : d.x - 180) + ")translate(" + toffset(d) + ")"; });
    	};
  	}
return plot;
};