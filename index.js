const {
    json, 
    select,
    geoMercator,
    geoAlbersUsa,
    geoPath,
    geoGraticule,
    active,
    scaleTreshold,
    interpolateYlGn,
    scaleSequential
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

        console.log('counties', counties)
        const fetchCountyBachelorInfo = (id) => {
            const county = usEducation.find(el => el.fips === id);
            console.log('County', county)
            if(county){
                return county.bachelorsOrHigher;
            }
            return null;
        }

        const colorScale = scaleSequential(interpolateYlGn)
                                    .domain([0, 100]);

        const paths = g.selectAll('path');
    
        paths
         .data(counties)
         .join('path')
         .attr('d', path)
         .attr('fill',d => colorScale(fetchCountyBachelorInfo(d.id)))

        paths
         .data(states)
         .join('path')
         .attr('d', path)
         .attr('stroke','white')
         .attr('stroke-width',1.5)
         .attr('fill', 'transparent')
    
    })

