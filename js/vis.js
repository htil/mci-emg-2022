/** Class used to manage data visualization
 * @class
*/

var Vis = function() {

    this.start = function() {

        // Band Power
        var size = document.getElementById("bpColumn").parentElement.getBoundingClientRect().width
        window.bpGraph = new Rickshaw.Graph( {
            element: document.getElementById("bpGraph"),
            renderer: 'bar',
            width: 300,
            stack: false,
            series: [{
                data: [ { x: 0, y: 40 }, { x: 1, y: 49 }, { x: 2, y: 60 }, { x: 3, y: 90 }],
                color: 'steelblue', 
                name: "Alpha"
            }, 
            {
                data: [ { x: 0, y: 20 }, { x: 1, y: 24 },  { x: 2, y: 10 }, { x: 3, y: 40 }],
                color: 'lightblue'
            }, {
                data: [ { x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 23 }, { x: 3, y: 33 }],
                color: 'gold'
            }, {
                data: [ { x: 0, y: 20 }, { x: 1, y: 24 }, { x: 2, y: 23 }, { x: 3, y: 33 }],
                color: 'red'
            }]
        })

        var y_ticks = new Rickshaw.Graph.Axis.Y( {
            graph: window.bpGraph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis_bp')
        } );

        var format = function(n) {

            var map = {
                0: 'Theta',
                1: 'Alpha',
                2: 'Beta',
                3: 'Gamma',
            };
        
            return map[n];
        }

        var xAxis = new Rickshaw.Graph.Axis.X({
            graph: window.bpGraph,
            orientation: 'bottom',
	        element: document.getElementById('x_axis_bp'),
            pixelsPerTick: 75,
            tickFormat: format
        });

        window.bpGraph.render();

        /*
        setInterval(function() {
            console.log("Update")

            
        }, 5000)
        */


        // PSD Graph
        var size = document.getElementById("psdColumn").parentElement.getBoundingClientRect().width
        window.psdGraph = new Rickshaw.Graph( {
            element: document.getElementById("psdGraph"),
            renderer: 'line',
      
            width: size,
        
            
            series: [{
                color: 'steelblue',
                data: [ { x: 0, y: 0 }],
            }, {
                color: 'lightblue',
                data: [ { x: 0, y: 0 }],
            },{
                color: 'gold',
                data: [ { x: 0, y: 0 }],
            }, {
                color: 'red',
                data: [ { x: 0, y: 0 }],
            }]

        })

        var y_ticks = new Rickshaw.Graph.Axis.Y( {
            graph: window.psdGraph,
            orientation: 'left',
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
            element: document.getElementById('y_axis')
        } );

    
        var xAxis = new Rickshaw.Graph.Axis.X({
            graph: window.psdGraph,
            orientation: 'bottom',
	        element: document.getElementById('x_axis'),
            pixelsPerTick: 30,
            tickFormat: Rickshaw.Fixtures.Number.formatKMBT
        });

        window.psdGraph.render();
       

        // Raw Data
        size = document.getElementById("graph").parentElement.getBoundingClientRect().width
        timeInterval = 1
        window.rawSignalGraph = new Rickshaw.Graph( {
            element: document.querySelector("#graph"), 
            width: size - 10, 
            height: size * .70, 
            renderer: 'line',
            series: new Rickshaw.Series.FixedDuration([
                { name: 'TP9', color: 'steelblue' }, 
                { name: 'TP10', color: 'lightblue' }, 
                { name: 'AF7', color: 'gold' }, 
                { name: 'AF8', color: 'red' }
            
            ], undefined, {
                timeInterval: timeInterval,
                maxDataPoints: 256 * 2,
                timeBase: new Date().getTime() / 1000
            }) 

        });
        
        window.rawSignalGraph.render();

        var legend = document.querySelector('#legend');

        var Hover = Rickshaw.Class.create(Rickshaw.Graph.HoverDetail, {

            render: function(args) {
                
                legend.innerHTML = "";

                args.detail.sort(function(a, b) { return a.order - b.order }).forEach( function(d) {
                    
                    var line = document.createElement('div');
                    line.className = 'line';

                    var swatch = document.createElement('div');
                    swatch.className = 'swatch';
                    swatch.style.backgroundColor = d.series.color;

                    var label = document.createElement('div');

                    label.className = 'label';

                    // hard coded for muse. change this!!!!
                    if (d.name == "AF7"){
                        label.innerHTML = d.name + ": " + Math.round(d.formattedYValue - 900);
                    } else if (d.name == "AF8") {
                        label.innerHTML = d.name + ": " + Math.round(d.formattedYValue - 600);
                    } else if (d.name == "TP10") {
                        label.innerHTML = d.name + ": " + Math.round(d.formattedYValue - 300);
                    } else {
                        label.innerHTML = d.name + ": " + Math.round(d.formattedYValue);
                    }

                    line.appendChild(swatch);
                    line.appendChild(label);

                    legend.appendChild(line);
                    

                    var dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.style.top =  window.rawSignalGraph.y(d.value.y0 + d.value.y) + 'px';
                    dot.style.borderColor = d.series.color;

                    this.element.appendChild(dot);

                    dot.className = 'dot active';

                    this.show();
                    

                }, this );
                }
        });

    var hover = new Hover( { graph:  window.rawSignalGraph } );
    }
}