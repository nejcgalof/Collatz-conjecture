var reverseCollatz = function(r, max) { 
  function compute() {
    var level = {1: 1},
        results = {},
        index = {};

    for (var c=1; c<max; c++) {
      var newlevel = {};
      for (var x in level) {
        x = level[x];
        // There will only sometimes be an odd multiple of 3 (plus one) above us
        // When (x-1) mod 3 is 0, x is an even number half the time
        // So we check against (x-4) mod 6 because we don't want to find evens
        var odd = ((x-4)%6!=0) ? 0 : (x-1)/3;
        if (odd > 1) { // We don't want 1 (the root) or 0 (no odd found)
          newlevel[odd] = odd;
          results[odd] = x;
        }
        newlevel[x*2] = x*2; // There will always be an even number above us
        results[x*2] = x;
      }
      level = newlevel;
    }
    for (var x in results) {
      var v = results[x];
      if (!index[v]) index[v] = [x];
      else index[v].push(x);
    }
    return index;
  }

  function treeChildren(max) {
    return function(d, i) {
      return i < max ? index[d] : null;
    };
  }

  var index = compute();
      tree = d3.layout.tree()
        .size([360, r - 20])
        .sort(null)
        .value(String)
        .separation(function(a, b) { return a.parent == b.parent ? 6.5 : 5.5; });

  var oldNodes = {};

  function plot(depth, duration) {
    return function() {
      var vis = this,
          nodes = tree.children(treeChildren(depth - 1))(1);

      var link = vis.selectAll("g.link")
          .data(nodes, function(d) { return d.data; });

      var linkEnter = link.enter().append("g")
          .attr("class", "link");

      var line = link.selectAll("line").data(children);
      line.enter().append("line")
          .attr("x1", function(d) { return xs(d.oldParent); })
          .attr("y1", function(d) { return ys(d.oldParent); })
          .attr("x2", function(d) { return xs(d.child); })
          .attr("y2", function(d) { return ys(d.child); });
      line.transition()
          .duration(duration)
          .attr("x1", function(d) { return xs(d.parent); })
          .attr("y1", function(d) { return ys(d.parent); })
          .attr("x2", function(d) { return xs(d.child); })
          .attr("y2", function(d) { return ys(d.child); });
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
          .attr("r", 5);
      nodeEnter.append("text")
          .attr("dy", ".31em");
      node.exit().remove();

      node.transition()
          .duration(duration)
          .attr("transform", function(d) { return "translate(" + xs(d) + "," + ys(d) + ")"; });
      node.select("text")
          .attr("text-anchor", function(d) { return d.x <= 270 && d.x >= 90 ? "start" : "end"; })
          .attr("transform", function(d) {
            var o = oldNodes[d.data] || d;
            return "rotate(" + (o.x + (d.x <= 270 && d.x >= 90 ? -180 : 0)) + ")translate(" + toffset(d) + ")";
          })
          .text(function(d) { return d.data; })
        .transition()
          .duration(duration)
          .attr("transform", function(d) { return "rotate(" + (d.x > 270 || d.x < 90 ? d.x : d.x - 180) + ")translate(" + toffset(d) + ")"; });

      oldNodes = {};
      _.each(nodes, function(node) {
        oldNodes[node.data] = node;
      });
    };
  }

  // Use instead of "dx" for FireFox.
  function toffset(d) {
    return d.x <= 270 && d.x >= 90 ? 8 : -8;
  }

  function getOldParent(d) {
    var n = d;
    while (n) {
      var old = oldNodes[n.data];
      if (old) return old;
      n = n.parent;
    }
    return d;
  }

  // Returns parent+child objects for any children of `d`.
  function children(d, i) {
    return (d.children || []).map(function(v) {
      return {
        oldParent: getOldParent(d),
        parent: d,
        child: v
      };
    });
  }

  // Radial scales for x and y.
  function xs(d) { return d.y * Math.cos((d.x - 90) / 180 * Math.PI); }
  function ys(d) { return d.y * Math.sin((d.x - 90) / 180 * Math.PI); }

  return plot;
};
