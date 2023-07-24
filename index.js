const {
    json, 
    select,
    geoMercator,
    geoAlbersUsa,
    geoPath,
    geoGraticule
} = d3

const width = 900;
const height = 600;

const svg = select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    var projection = geoAlbersUsa()
    // .center([2, 47])                // GPS of location to zoom on
    // .scale(980)                       // This is like the zoom
    .translate([ width/2, height/2 ])

    const path = geoPath(projection)
    // Load external data and boot

const g = svg.append('g')
json("https://unpkg.com/us-atlas@3.0.0/states-10m.json")
    .then(data => {
        console.log(data)
    // Draw the map
    const nation = topojson.feature(data,data.objects.nation).features;
    const states = topojson.feature(data,data.objects.states).features;
    // const counties = topojson.feature(data,data.objects.counties).features;

    g.selectAll('path')
     .data(states)
     .enter().append('path')
     .attr('d', path)

    g.selectAll('path')
     .data(nation)
     .enter().append('path')
     .attr('d', path)

})
