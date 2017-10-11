import * as d3 from 'd3';
require('./css/index.scss')

//variables

var margin = { top: 40, right: 100, bottom: 70, left: 60},
    
    width  = 800 - margin.right - margin.left, // chart width
    
    height = 600  - margin.top   - margin.bottom; // chart height
    
d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json',function(data){
    
   
    
    
    var minTime = d3.min(data,function(d){return d.Seconds}),
        maxRank = d3.max(data,function(d){return d.Place}),
        minRank = d3.min(data,function(d){return d.Place});
    
    
    //add the time difference between the fastest to each data
    data.map((d) => {
        
       d.TimeDiff = d.Seconds-minTime;
            
    })
    
  
    
    var maxSeconds = d3.max(data, function(d){ return d.TimeDiff})
    
    //format ticks for X axis
    
    var formatTicks = (d) => {
               
     var minutes = Math.floor(d/60);
     var seconds = (d%60).toFixed(0);
     return (minutes < 10? '0'+minutes :  minutes) +':'+ (seconds < 10? '0'+seconds :  seconds )
                            
}
    
    
    
    // x scale
    
    var x = d3.scaleLinear()
                .domain([0, maxSeconds+10])
                .range([width,0]);
    // y scale
    var y = d3.scaleLinear()
                .domain([minRank, maxRank+2])
                .range([0, height])
                
    var xAxis = d3.axisBottom(x)
                    .tickFormat(formatTicks);
    
    var yAxis = d3.axisLeft(y);
    
    //create tooltip
    
    var tooltip = d3.select('.wrapper')
                    .append('div')
                    .attr('class','tooltip')
                    .style('opacity','0')
                
    var svg = d3.select('.svg')
                .attr('width',width + margin.right + margin.left)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform','translate('+margin.left+','+margin.top+')')
                
                
    var chart = svg.selectAll('circle')
                    .data(data)
                    .enter()
                    .append('circle')
                    .attr('cx', function(d){ return x(d.TimeDiff)})
                    .attr('cy', function(d){ return y(d.Place)})
                    .attr('r','4')
                    .attr('fill',function(d){
                        return d.Doping === '' ? '#140200' : '#d62717';
                    })
                    .on('mouseover',function(d){
                        var xPos =  420 + 'px';
                        var yPos =  300 + 'px';
                        tooltip.transition()
                            .duration(200)
                            .style('opacity','.9')
                        tooltip.html(function(){
                            if(d.Doping == ''){
                                return `<span>${d.Name} : ${d.Nationality}</span><br/><span>Year : ${d.Year}</span><br/><span>No doping allegations</span>`
                            }
                            else
                                return `<span>${d.Name} : ${d.Nationality}</span><br/><span>Year : ${d.Year}</span><br/><span>${d.Doping}</span>`
                        })
                            .style('left',xPos)
                            .style('top',yPos)
                    })
                    .on('mouseout',function(d){
                        tooltip.transition()
                                .duration(500)
                                .style('opacity','0')
                    })
    // add names to each circle
    
    svg.selectAll('text')
        .data(data)
        .enter()
        .append('text')
        .attr('x',function(d){ return x(d.TimeDiff)})
        .attr('y',function(d){ return y(d.Place)})
        .text(function(d){ return d.Name})
        .attr('font-size','12')
        .attr('transform','translate(8,3)')
        
                    
    
    //add X axis
    svg.append('g')
        .attr('class','x axis')
        .attr('transform','translate(0 '+height+')')
        .call(xAxis)
    svg.append('text')
        .attr('x',function(){return width / 2})
        .attr('y',function(){ return height + 50})
        .attr('font-size','20px')
        .attr('font-family','Tohama')
        .style("text-anchor", "middle")
        .text('Minutes Behind Fastest Time');
    //add Y axis
    
    svg.append('g')
        .attr('class','y axis')
        .call(yAxis)
    svg.append('text')
        .attr('dx','-50')
        .attr('dy','30')
        .attr('font-size','20px')
        .attr('font-family','Tohama')
        .style('text-anchor','end')
        .attr('transform','rotate(-90)')
        .text('Ranking')
                    
});


