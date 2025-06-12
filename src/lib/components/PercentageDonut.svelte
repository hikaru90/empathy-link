<script>
	import { quantize, interpolateReds, pie, arc } from 'd3';
	import { cn } from '$lib/utils';

	/** @type {{data: any, colors: any, percentage?: number, class?: string}} */
	let { data, colors = $bindable(), percentage, class: className = undefined } = $props();
	
	// Use viewBox for responsive scaling instead of fixed dimensions
	const viewBoxSize = 250;
	const percent = true; // format values as percentages (true/false)
	const fontSize = 10; // the font size of the x and y values
	const strokeWidth = 0; // the width of stroke separating wedges
	const strokeLinejoin = 'round'; // line join style of stroke separating wedges
	const outerRadius = Math.min(viewBoxSize, viewBoxSize) * 0.5 - 10; // the outer radius of the circle, in pixels
	const innerRadius = Math.min(viewBoxSize, viewBoxSize) * 0.5 - 40; // the inner radius of the chart, in pixels
	const labelPosition = 0.3; // the position of the label offset from center
	const labelRadius = innerRadius * labelPosition + outerRadius * 0.6; // center radius of labels
	const strokeColorWOR = 'white'; //stroke color when inner radius is greater than 0
	const strokeColorWIR = 'none'; //stroke color when inner radius is 0
	const stroke = innerRadius > 0 ? strokeColorWIR : strokeColorWOR; // stroke separating widths
	const padAngle = stroke === 'none' ? 3 / outerRadius : 0; // angular separation between wedges

	const x = data[0] ? Object.keys(data[0])[0] : undefined; // given d in data, returns the (ordinal) x-value
	const y = data[0] ? Object.keys(data[0])[1] : undefined; // given d in data, returns the (quantitative) y-value
	const xVals = data.map((el) => el[x]);
	let yVals = data.map((el) => Number(el[y]));
	
	// Calculate percentage if not provided
	const displayPercentage = $derived(() => {
		if (percentage !== undefined) {
			return percentage;
		}
		// Calculate percentage from data (assuming first item is completed, second is remaining)
		const total = yVals.reduce((a, b) => a + b, 0);
		if (total === 0) return 0;
		return Math.round((yVals[0] / total) * 100);
	});
	
	if (percent) {
		const total = yVals.reduce((a, b) => a + b, 0);
		yVals = yVals.map((el) => el / total);
	}
	const iVals = data.map((el, i) => i);

	// colors can be adjusted manually by creating a color array which length matches length of data set.
	if (!colors) colors = quantize((t) => interpolateReds(t * 0.7 + 0.3), xVals.length).reverse();

	const wedges = pie()
		.padAngle(padAngle)
		.sort(null)
		.value((i) => yVals[i])(iVals);

	const arcPath = arc().innerRadius(innerRadius).outerRadius(outerRadius).cornerRadius(Infinity);

	const arcLabel = arc().innerRadius(labelRadius).outerRadius(labelRadius);
</script>

<div class={cn('relative', className)}>
  <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
    <div style="font-size: 90%" class="font-bold text-green-600">
      {displayPercentage()}%
    </div>
  </div>
  <svg 
    class="w-full h-full" 
    viewBox="{-viewBoxSize / 2} {-viewBoxSize / 2} {viewBoxSize} {viewBoxSize}"
    preserveAspectRatio="xMidYMid meet"
  >
	{#each wedges as wedge, i}
		<path
			fill={colors[i]}
			d={arcPath(wedge)}
			{stroke}
			stroke-width={strokeWidth}
			stroke-linejoin={strokeLinejoin}
			stroke-linecap="round"
		/>
    {/each}
  </svg>
</div> 