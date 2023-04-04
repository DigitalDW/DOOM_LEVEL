const svg = d3
  .select('body')
  .append('svg')
  .attr('width', 1250)
  .attr('height', 800)
  .style("border", "1px solid black");

d3.csv('../../CSV_data/vertexes_data.csv').then((data) => {
  /* ####
  SACLING
  #### */
  const coords_x = data.map((v) => Number(v.x_position));
  const coords_y = data.map((v) => Number(v.y_position));

  const min_x = d3.min(coords_x);
  const max_x = d3.max(coords_x);
  const min_y = d3.min(coords_y);
  const max_y = d3.max(coords_y);
  let ratio_x_y = (max_y - min_y) / (max_x - min_x);
  
  let range_x = [min_x, max_x];
  let range_y = [min_y, max_y];

  let min = 50;
  let max = svg.attr("width") - 50;
  let desired_range_x = [min, max];
  let desired_range_y = [min, max * ratio_x_y];
  
  /* ###############
  COORDINATE SCALING
  ############### */
  const scale_x = d3.scaleLinear()
    .domain(range_x)
    .range(desired_range_x)
  
  const scale_y = d3.scaleLinear()
    .domain(range_y)
    .range(desired_range_y)

  /* ##########
  DRAW VERTICES
  ########## */
  svg.selectAll('.vertices').remove();
  svg
    .selectAll('.vertices')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'vertices')
    .attr('cx', (d) => scale_x(d.x_position))
    .attr('cy', (d) => scale_y(d.y_position))
    .attr('r', 2)
    .attr('fill', 'black');
},
(error) => console.log(error));
