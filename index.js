const {
    json, 
    select,
    geoMercator,
    geoAlbersUsa,
    geoPath,
    geoGraticule,
    active,
    scaleLinear,
    scaleThreshold,
    interpolateYlGn,
    scaleSequential,
    format, 
    axisBottom,
} = d3

console.log('Hello World')

const width = window.innerWidth*0.6;
const height = window.innerHeight*0.6;


const margin = {
    top: 50, 
    left: 50, 
    right: 50, 
    bottom: 200
}


const usEducationData = 
[
"https://cdn.freecodecamp.org/",
"testable-projects-fcc/",
"data/",
"choropleth_map/",
"for_user_education.json"
].join('')

const usCountyData = [
    "https://cdn.freecodecamp.org/",
    "testable-projects-fcc/",
    "data/",
    "choropleth_map/",
    "counties.json"
].join('')

const svg = select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height + 200)

    var projection = geoAlbersUsa()

    .translate([ width/2, height/2 ])

    const path = geoPath()
    // Load external data and boot
Promise.all([json(usCountyData),json(usEducationData)])
  .then(([us, usEducation]) => {
    
    console.table(us)
    console.table(usEducation)

    const g = svg.append('g')

    // Draw the map
    const nation = topojson.feature(us,us.objects.nation).features;
    const states = topojson.feature(us,us.objects.states).features;
    const counties = topojson.feature(us,us.objects.counties).features;
    
    const fetchCountyBachelorInfo = (id) => {
        const county = usEducation.find(el => el.fips === id);
        if(county){
            return county.bachelorsOrHigher;
        }
        return null;
    }

    const colorScale = scaleSequential()
                        .interpolator(d => {
                            return interpolateYlGn(d)
                        })
                        .domain([0, 100]);

    const paths = g.selectAll('path');

    paths
        .data(nation)
        .join('path')
        .attr('d', path)
        .attr('stroke','black')
        .attr('stroke-width', 5)

    paths
        .data(counties)
        .join('path')
        .attr('d', path)
        .attr('fill',d => colorScale(fetchCountyBachelorInfo(d.id)))

    paths
        .data(states)
        .join('path')
        .attr('d', path)
        .attr('stroke','#fff')
        .attr('stroke-width',1.5)
        .attr('fill', 'transparent')


    // Legend section

    const tresholdValues = [[3,12],[12,21],[21,30],[30,39],[39,48],[48,57],[57,66]];
    const uniqueTresholdValues = new Set(tresholdValues.flat());
    const tickValues = Array.from(uniqueTresholdValues);

    const domain = [
        Math.min(...tickValues),
        Math.max(...tickValues)
    ]
    console.log(`Domain`, domain)

    const legendScale = scaleLinear()
                            .domain(domain)
                            .range([0, 500])

    const legendAxis = axisBottom(legendScale)


   const legend = svg
     .append('g')
     .attr('transform', `translate(${margin.left},${height+ 100})`)
     .call(legendAxis
            .tickValues(tickValues)
            .tickSizeOuter(0)
        )

    const legendHeight = 10;

    legend 
        .selectAll('.legends')
        .data(tresholdValues)
        .join('rect')
        .attr('x', (d, i) => legendScale(tickValues[i]))
        .attr('y',-legendHeight)
        .attr('height', legendHeight)
        .attr('width', (d,i) => legendScale(d[1]) - legendScale(d[0]))
        .attr('fill', d => colorScale(d[0]))
})


