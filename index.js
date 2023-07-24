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


const USEducationData = 
[
"https://cdn.freecodecamp.org/",
"testable-projects-fcc/",
"data/",
"choropleth_map/",
"for_user_education.json"
].join('')

const USCountyData = [
    "https://cdn.freecodecamp.org/",
    "testable-projects-fcc/",
    "data/",
    "choropleth_map/",
    "counties.json"
].join('')

const svg = select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

    var projection = geoAlbersUsa()
    // .center([2, 47])                // GPS of location to zoom on
    // .scale(980)                       // This is like the zoom
    .translate([ width/2, height/2 ])

    const path = geoPath()
    // Load external data and boot

const g = svg.append('g')
json(USCountyData)
    .then(data => {
        console.log(data)
    // Draw the map
    const nation = topojson.feature(data,data.objects.nation).features;
    const states = topojson.feature(data,data.objects.states).features;
    const counties = topojson.feature(data,data.objects.counties).features;

    // g.selectAll('path')
    //  .data(states)
    //  .enter().append('path')
    //  .attr('d', path)

    // g.selectAll('path')
    //  .data(nation)
    //  .enter().append('path')
    //  .attr('d', path)

    g.selectAll('path')
     .data(states)
     .enter().append('path')
     .attr('d', path)

})
