function tooltipd3(tltp_name){

/**
* @Class tooltip - d3 object tooltip
* Requiere [d3.js](https://github.com/mbostock/d3)
*/

"use strict";

	var s = {};
	s.name = tltp_name ? tltp_name : "tooltipd3";
	s.w = 0;	// width tooltip
	s.h = 0;	// height tooltip
	
	s.t = d3.select("body").append("div") // tooltip html node
		.attr("class", s.name)
		.style("opacity", 1e-6)
		.style("position", "absolute");
	
	s.mouseover = function(html) {
		/** @param {string} html - Is the content for tooltip */
		s.t.html(html)
		  	.transition()
			.duration(300)
			.style("opacity", 1);

		s.t.selectAll(".close").on('click', function(){ s.mouseout(); });
		
		/** After innerhtml on tooltip get w & h */
		s.get_t_size();
	};

	s.mousemove = function(){
		s.t.style("left", (d3.event.pageX - s.w/2) + "px")
			.style("top", (d3.event.pageY - s.h - 5) + "px");
	};

	s.mouseout = function() {
		s.t.transition()
			.duration(300)
			.style("opacity", 1e-6)
			.each("end", function(){
				s.t.html("");
			});
	};

	/** Get width and height of tooltip and set w & h of Tooltip class */
	s.get_t_size = function(){
		var size = s.t.node().getBoundingClientRect();
		s.w = size.width;
		s.h= size.height;
	};

	return s;
}
