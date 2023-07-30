const {
    json, 
    select,
    geoPath,
    scaleLinear,
    interpolateYlGn,
    scaleSequential,
    axisBottom,
} = d3

// Capture mouse positions
let globalMousePos = { x: undefined, y: undefined}
window.addEventListener('mousemove', (event) => {
    globalMousePos = { x: event.clientX, y: event.clientY };
  });

const tooltip = select('body').append('div').attr('id', 'tooltip')

/** UTILS */

const fetchCountyBachelorInfo = (data,id) => {
    const county = data.find(el => el.fips === id);
    if(county){
        return county.bachelorsOrHigher;
    }
    return null;
}

const getCounty = (data,id) => {
    const county = data.find(el => el.fips === id);
    if(county) return county; 
    if(!county) return null
}

/**  */
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

const svg = select('#svg-container')
    .append('svg')
    .attr('width', width)
    .attr('height', height + 200)

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
    
    const colorScale = scaleSequential()
                        .interpolator(interpolateYlGn)
                        .domain([0, 100]);

    const paths = g.selectAll('path');

    paths
        .data(nation)
        .join('path')
        .attr('d', path)
        .attr('stroke','black')
        .attr('stroke-width', 5)

    let currentRectId = 0;

    paths
        .data(counties)
        .join('path')
            .attr('class', 'county')
            .attr('data-fips', d => getCounty(usEducation,d.id).fips)
            .attr('data-education', d => getCounty(usEducation,d.id).bachelorsOrHigher)
            .attr('d', path)
            .attr('id', d => `path-${d.id}`)
            .attr('fill',d => colorScale(fetchCountyBachelorInfo(usEducation,d.id)))
            .on('mouseover', (e,d) => {
                // window.alert('hello')

                const { id } = d;
    
                const { area_name, state, bachelorsOrHigher } = getCounty(usEducation, id);
                
                const text = `
                    ${area_name}, ${state}: ${bachelorsOrHigher}%
                `

                tooltip.attr('data-education', bachelorsOrHigher);
                tooltip.attr('data-')
                tooltip.style('opacity',1);
                tooltip.style('left',globalMousePos.x+'px');
                tooltip.style('top', globalMousePos.y-50+'px');
                tooltip.style('opacity',1);
                tooltip.html(text);
                 currentRectId = e.target.getAttribute('id');
        
                svg 
                .select(`#${currentRectId}`)
                .attr('stroke','black')
                .attr('stroke-width', 2)     
            })
            .on('mouseout', () => {
                tooltip.style('opacity',0);
                svg 
                .select(`#${currentRectId}`)
                .attr('stroke','black')
                .attr('stroke-width', 0)
            })
        


        paths
            .data(states)
            .join('path')
            .attr('d', path)
            .attr('stroke','#fff')
            .attr('stroke-width',1.5)
            .attr('fill', 'none')

    // Legend section
    const tresholdValues = [[3,12],[12,21],[21,30],[30,39],[39,48],[48,57],[57,66]];
    const uniqueTresholdValues = new Set(tresholdValues.flat());
    const tickValues = Array.from(uniqueTresholdValues);

    const domain = [
        Math.min(...tickValues),
        Math.max(...tickValues)
    ]

    const legendScale = scaleLinear()
                            .domain(domain)
                            .range([0, 500])

   const legendAxis = axisBottom(legendScale)
   const legend = svg
     .append('g')
     .attr('transform', `translate(${margin.left},${height+ 100})`)
     .attr('id', 'legend')
     .call(legendAxis
            .tickValues(tickValues)
            .tickSizeOuter(0)
        )

    const legendHeight = 10;

    legend 
        .selectAll('.legends')
        .data(tresholdValues)
        .join('rect')
        .attr('x', (_, i) => legendScale(tickValues[i]))
        .attr('y',-legendHeight)
        .attr('height', legendHeight)
        .attr('width', (d) => legendScale(d[1]) - legendScale(d[0]))
        .attr('fill', d => colorScale(d[0]))
})


