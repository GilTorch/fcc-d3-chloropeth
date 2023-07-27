const {
    json, 
    select,
    geoMercator,
    geoAlbersUsa,
    geoPath,
    geoGraticule,
    easeLinear,
    easePolyIn, 
    easePolyOut,
    quadIn, 
    quadOut,
    active
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
Promise.all([json(USCountyData),json(USEducationData)])
  .then(([us, usEducation]) => {
    
    console.table(us)
    console.table(usEducation)

    const g = svg.append('g')

        // Draw the map
        const nation = topojson.feature(us,us.objects.nation).features;
        const states = topojson.feature(us,us.objects.states).features;
        const counties = topojson.feature(us,us.objects.counties).features;
        
        const legendColors = [
            '#67001f',
            '#b2182b',
            '#d6604d',
            '#f4a582',
            '#fddbc7',
            '#f7f7f7',
            '#d1e5f0',
            '#92c5de',
            '#4393c3',
            '#2166ac',
            '#053061'
        ];
    
        const paths = g.selectAll('path');
    
       const displayCounties = paths
         .data(counties)
         .enter().append('path')
         .attr('d', path)
         .attr('fill','white')
         .transition()
         .ease(easePolyIn)
         .delay((_,i) => i*2)
         .attr('fill', legendColors[Math.floor(Math.random()*10)])
    
    })

