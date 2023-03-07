const margin={top:60,right:40,bottom:60,left:60},
    width=900-margin.left-margin.right,
    height=500-margin.top-margin.bottom;

// get data from csv
d3.csv('data/A1_Data.csv').then(function(data){
    var keys=data.columns.slice(1)
    data.forEach(function(d) {
        d.total=d3.sum(keys,k=>+d[k])
        return d 
    });
    const mySelection=document.getElementById("selectMe");
    d3.select(mySelection)
        .append("span")
        .append("p")
        .attr("class","label");
    const selectItems=["Bar Chart","Stacked Bar Chart","Sorted Stacked Bar Chart"];
    d3.select(mySelection)
      .append("span")
      .append("select")
      .attr("id","selection")
      .attr("name","tasks")
      .selectAll("option")
      .data(selectItems)
      .enter()
      .append("option")
      .attr("value",d=>d)
      .text(d=>d);
    var selectedOption="Bar Chart";
    document.addEventListener("DOMContentLoaded",myChart());
    d3.select("#selection").on("change",function(){
        selectedOption = d3.select(this).node().value;
        if(selectedOption=="Sorted Stacked Bar Chart"){
            data.sort((a,b)=>{
                return d3.descending(a.total,b.total)
            });
        }else{
            data.sort((a,b)=>{
                return d3.ascending(a.State,b.State)
            });
        }
        myChart();
    })
    function myChart(){
        const chartDIV=document.createElement("div")
        const y=d3.scaleLinear()
            .domain([0,60000000])
            .range([height,0]);
        const svg=d3.select(chartDIV)
            .append("svg")
            .attr("width",width+margin.left+margin.right)
            .attr("height",height+margin.top+margin.bottom)
            .append("g")
            .attr("transform",
                        `translate(${margin.left},${margin.top})`);
        svg.append("g")
            .call(d3.axisLeft(y));
        svg.append("text")
            .attr("class","ylabel")
            .attr("y",0 - margin.left+ 30)
            .attr("x",0 - (height/120))
            .attr("dy","1em")
            .attr("transform","rotate(0)")
            .style('text-anchor', 'middle')
            .text("Population");
        if(selectedOption=="Bar Chart"){
            var x =d3.scaleBand()
                .domain(data.map(function(d){return d.State; }))
                .range([0,width])
                .paddingInner(0.05);
            svg.append("g")
                .attr("transform",`translate(0,${height})`)
                .call(d3.axisBottom(x));
            svg.selectAll(".bar")
                .data(data)
                .enter()
                .append("rect")
                .attr("class","bar")
                .attr("x",function(d){return x(d.State);})
                .attr("y",function(d){return y(d.total);})
                .attr("width",x.bandwidth())
                .attr("height",function(d){return height-y(d.total);})
                .style("fill","#7B0099");
        } else if (selectedOption=="Stacked Bar Chart"){
            var x=d3.scaleBand()
                .domain(data.map(function(d){return d.State;}))
                .range([0,width])
                .paddingInner(0.05);
            svg.append("g")
                .attr("transform",`translate(0,${height})`)
                .call(d3.axisBottom(x));
            const stack=d3.stack().keys(keys);
            const stackedDate=stack(data);
            const colorScale=d3.scaleOrdinal()
                .range(["#ff6f61","#77212e","#fa9a85","#5a3e36","#577284","#7B0099","#f3e08e"])
                .domain(keys);
            svg.selectAll(".bar")
                .data(stackedDate)
                .join('g')
                .attr("fill",d=>colorScale(d.key))
                .attr("class","bar")
                .selectAll('rect')
                .data(d=>d)
                .join('rect')
                .attr('x',d=>x(d.data.State))
                .attr('y',d=>y(d[1]))
                .attr('height',d=>y(d[0])-y(d[1]))
                .attr('width',x.bandwidth() );
            var size=20
            svg.selectAll('mydots')
                .data(keys)
                .enter()
                .append("rect")
                .attr('x',600 )
                .attr('y',function(d,i){return 10+i*(size+5)} )
                .attr('width',size )
                .attr('height',size )
                .style('fill', function (d) {return colorScale(d)});
            svg.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr('x',600+size*1.2 )
                .attr('y',function(d,i) {return 10+i*(size+5)+(size/2)} )
                .style("fill",function(d){return colorScale(d)})
                .text(function(d){return d})
                .attr('text-anchor',"left" )
                .style("alignment-baseline","middle");
        }else{
            var x=d3.scaleBand()
            .domain(data.map(function(d){return d.State;}))
            .range([0,width])
            .paddingInner(0.05);
            svg.append("g")
                .attr("transform",`translate(0,${height})`)
                .call(d3.axisBottom(x));
            const stack=d3.stack().keys(keys);
            const stackedDate=stack(data);
            const colorScale=d3.scaleOrdinal()
                .range(["#ff6f61","#77212e","#fa9a85","#5a3e36","#577284","#7B0099","#f3e08e"])
                .domain(keys);
            svg.selectAll(".bar")
                .data(stackedDate)
                .join('g')
                .attr("fill",d=>colorScale(d.key))
                .attr("class","bar")
                .selectAll('rect')
                .data(d=>d)
                .join('rect')
                .attr('x',d=>x(d.data.State))
                .attr('y',d=>y(d[1]))
                .attr('height',d=>y(d[0])-y(d[1]))
                .attr('width',x.bandwidth() );
            var size=20;
            svg.selectAll('mydots')
                .data(keys)
                .enter()
                .append("rect")
                .attr('x',600 )
                .attr('y',function(d,i){return 10+i*(size+5)} )
                .attr('width',size )
                .attr('height',size )
                .style('fill', function (d) {return colorScale(d)});
            svg.selectAll("mylabels")
                .data(keys)
                .enter()
                .append("text")
                .attr('x',600+size*1.2 )
                .attr('y',function(d,i) {return 10+i*(size+5)+(size/2)} )
                .style("fill",function(d){return colorScale(d)})
                .text(function(d){return d})
                .attr('text-anchor',"left" )
                .style("alignment-baseline","middle");
        }
        const showChart =document.getElementById("chartContainer");
        while (showChart.firstChild){
            showChart.firstChild.remove();
        }
        showChart.appendChild(chartDIV);
    }
});