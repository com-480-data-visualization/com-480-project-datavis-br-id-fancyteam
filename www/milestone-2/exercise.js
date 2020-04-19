
/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}

const arrayMax = (array) => array.reduce((acc, val) => Math.max(acc, val), array[0]);

class ImageHistogram {

	initImage() {
		this.canvas = document.querySelector('#' + this.figure_element_id + ' canvas');
		console.log(this.canvas)
		this.canvas_context = this.canvas.getContext("2d");

		const image = new Image;
		image.onload = () => {
			this.canvas.width = image.width;
			this.canvas.height = image.height;
			this.canvas_context.drawImage(image, 0, 0);
		};
		image.src = "epfl-rolex.jpg";
	}

	/*
		Calculate the histogram of pixel values inside the specified area
		Returns an array [values_red, values_green, alues_blue]
		such that values_red[r] = number of pixels in the area which have the red value exactly equal to r
	*/
	getImageHistogramOfArea(x_left, y_top, width, height) {
		// getImageData:
		//	https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
		// returns an ImageData
		//	https://developer.mozilla.org/en-US/docs/Web/API/ImageData
		// we use the .data property which is a uint8 array
		//	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray
		const image_bytes = this.canvas_context.getImageData(x_left, y_top, width, height).data;

		// To make a histogram, for each color we count how many pixels
		// had a given value
		let counts = [
			new Array(256).fill(0),
			new Array(256).fill(0),
			new Array(256).fill(0),
		];

		// The bytes are arranged as follows: RGBARGBARGBA
		// so to get to the next pixel we add +4 to our index
		for(let idx = 0; idx < image_bytes.length; idx += 4) {
			// pixel color:
			// r = image_bytes[idx], g = image_bytes[idx+1], b = image_bytes[idx+2], a = image_bytes[idx+3]
			counts[0][image_bytes[idx]] += 1;
			counts[1][image_bytes[idx+1]] += 1;
			counts[2][image_bytes[idx+2]] += 1;
		}

		return counts;
	}

	updatePlot(selection) {
		if(selection) {
			/*
			The selected area is specified in `d3.event.selection` as `[[x_min, y_min], [x_max, y_max]]` or null if nothing is selected
			*/

			const top_left = selection[0];
			const bottom_right = selection[1];
			const selection_width = bottom_right[0] - top_left[0];
			const selection_height = bottom_right[1] - top_left[1];

			console.log('Top left:', top_left, ' bottom right:', bottom_right);

			const color_counts = this.getImageHistogramOfArea(top_left[0], top_left[1], selection_width, selection_height);

			// Adapt the upper limit to our data
			const max_count = arrayMax(color_counts.map(arrayMax));
			this.scaleY.domain([0, max_count]);

			// Write new data into the arrays which have been bound to our curves
			for (let i = 0; i < 256; i++) {
				this.histogram_data[0][i] = color_counts[0][i];
				this.histogram_data[1][i] = color_counts[1][i];
				this.histogram_data[2][i] = color_counts[2][i];
			}
			// Redraw the curves
			this.curves.attr("d", this.curve_generator);

			// Alternatively:
			//this.curves.attr("d", (val, color_idx) => this.curve_generator(color_counts[color_idx]));
		}
		else
		{
			// No selection, make the curves empty
			this.curves.attr("d", "");
		}

	}

	constructor(figure_element_id) {
		this.figure_element_id = figure_element_id;
		this.svg = d3.select('#' + figure_element_id + ' svg');
		console.log(this.svg);

		this.initImage();

		this.plot_area = this.svg.append('g')
			.attr('x', 0)
			.attr('y', 0);

		// may be useful for calculating scales
		const svg_viewbox = this.svg.node().viewBox.animVal;
		console.log('viewBox', svg_viewbox);

		// Scales
		this.scaleX = d3.scaleLinear()
		 	.domain([0, 255])
		 	.range([0, svg_viewbox.width]);

		this.scaleY = d3.scaleLinear()
		 	.range([svg_viewbox.height, 0]);

		// Curve generator
		this.curve_generator = d3.area()
			.curve(d3.curveBasis)
			.x((val, i) => this.scaleX(i))
			.y((val, i) => this.scaleY(val))
			.y1(svg_viewbox.height+1); // bottom of the area below the bottom of the plot

		// Data and curves
		this.histogram_data = [
			new Array(256).fill(0),
			new Array(256).fill(0),
			new Array(256).fill(0)
		];

		this.curves = this.plot_area.selectAll('path')
			.data(this.histogram_data)
			.enter()
			.append('path')
			.attr("class", (data, index) => ['red', 'green', 'blue'][index]);

		// this.curve_R = this.plot_area.append('path');
		// ...
		// this.curve_R.attr("d", this.curve_generator(color_counts.R))

		// Brush
		const brush = d3.brush().on("end",  () => {
    	// this is called when the selection is changed
			const selection = d3.event.selection;
			this.updatePlot(selection);
		});

		// Brush visual representation
		this.plot_area.append("g")
    	.attr("class", "brush")
    	.call(brush);
	}
}

whenDocumentLoaded(() => {
	plot_object = new ImageHistogram('fig-histogram');
	// plot object is global, you can inspect it in the dev-console
});
