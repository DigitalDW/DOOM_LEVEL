const svg = d3
  .select('body')
  .append('svg')
  .attr('width', 1250)
  .attr('height', 800)
  .style("border", "1px solid black");

function draw() {
  Promise.all([
    d3.csv('../../CSV_data/vertexes_data.csv'),
    d3.csv('../../CSV_data/linedefs_data.csv'),
    d3.csv('../../CSV_data/things_data.csv'),
  ]).then((data) => {
    const vertex_data = data[0];
    const linedefs_data = data[1];
    const things_data = data[2]

    /* ###########
    DATA FILTERING
    ########### */
    const player = things_data.filter(
      (row) =>
        row.type == 1
    );

    /* ####
    SACLING
    #### */
    const coords_x = vertex_data.map((v) => Number(v.x_position));
    const coords_y = vertex_data.map((v) => Number(v.y_position));

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

    /* ################# 
    ADDING DATA TO LINES
    ################# */
    linedefs_data.forEach((row) => {
      const vertex_1 = vertex_data[Number(row.vertex_1)];
      const vertex_2 = vertex_data[Number(row.vertex_2)];
      row['vertex_1_pos'] = [scale_x(vertex_1.x_position), scale_y(vertex_1.y_position)];
      row['vertex_2_pos'] = [scale_x(vertex_2.x_position), scale_y(vertex_2.y_position)];
    });

    /* ###########
    DRAW FUNCTIONS
    ########### */
    draw_vertices(vertex_data, scale_x, scale_y);

    draw_linedefs(linedefs_data);

    // draw_start(player, scale_x, scale_y);
  },
  (error) => console.log(error));
}

function draw_vertices(vertex_data, scale_x, scale_y) {
  /* ##########
  DRAW VERTICES
  ########## */
  svg.selectAll('.vertices').remove();
  svg
    .selectAll('.vertices')
    .data(vertex_data)
    .enter()
    .append('circle')
    .attr('class', 'vertices')
    .attr('cx', (d) => scale_x(d.x_position))
    .attr('cy', (d) => scale_y(d.y_position))
    .attr('r', 2)
    .attr('fill', 'black');
}

function draw_linedefs(linedefs_data) {
  /* ##########
  DRAW LINEDEFS
  ########## */
  svg.selectAll('.lines').remove();
  svg
    .selectAll('.lines')
    .data(linedefs_data)
    .enter()
    .append('line')
    .attr('class', 'lines')
    .attr('id', (_, i) => `line_${i}`)
    .attr('stroke', 'black')
    // .attr('stroke', (d) =>
    //   d.action_special == 11 || d.action_special == 52 ? 'red' : 'black'
    // )
    .attr('stroke-width', '2px')
    .attr('x1', (d) => d.vertex_1_pos[0])
    .attr('y1', (d) => d.vertex_1_pos[1])
    .attr('x2', (d) => d.vertex_2_pos[0])
    .attr('y2', (d) => d.vertex_2_pos[1]);
}

function draw_start(player, scale_x, scale_y) {
  /* #######
  DRAW START
  ####### */
  svg.selectAll('.things').remove();
  svg
    .selectAll('.things')
    .data(player)
    .enter()
    .append('circle')
    .attr('class', 'things')
    .attr('cx', (d) => scale_x(d.x_position))
    .attr('cy', (d) => scale_y(d.y_position))
    .attr('fill', 'green')
    .attr('r', 4);
}

draw();