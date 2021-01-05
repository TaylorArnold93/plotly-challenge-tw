// Creating a function for Data plotting.
function getPlot(id) {
    // Initating the data from the json file
    d3.json("samples.json").then((data)=> {
        console.log(data)
  
        var wfreq = data.metadata.map(d => d.wfreq)
        console.log(`Washing Freq: ${wfreq}`)
        
        // Using the filtered data 
        var samples = data.samples.filter(s => s.id.toString() === id)[0];
        
        console.log(samples);
  
        // Getting the TOP 10 
        var samplevalues = samples.sample_values.slice(0, 10).reverse();
  
        // Getting the TOP 10 of the otu ids for the plot OTU and reversing it. 
        var OTU_top = (samples.otu_ids.slice(0, 10)).reverse();
        
        // The otu id's to the desired form for the plot
        var OTU_id = OTU_top.map(d => "OTU " + d)
  
      //console.log(`OTU IDS: ${OTU_id}`)
  
  
        // Getting the labels for TOP 10 for the plots
        var labels = samples.otu_labels.slice(0, 10);
  
      //console.log(`Sample Values: ${samplevalues}`)
      //console.log(`Id Values: ${OTU_top}`)
        // Creating the trace variable for the plot.
        var trace = {
            x: samplevalues,
            y: OTU_id,
            text: labels,
            marker: {
              color: 'rgb(149,142,165)'},
            type:"bar",
            orientation: "h",
        };
  
        // Creating data variable
        var data = [trace];
  
        // Creating the layout variable to set plots layout
        var layout = {
            title: "Top 10 OTU",
            yaxis:{
                tickmode:"linear",
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 30
            }
        };
  
        // Creating the bar plot
        Plotly.newPlot("bar", data, layout);
  
        //console.log(`ID: ${samples.otu_ids}`)
      
        // Creating the Bubble Plot/Chart 
        var trace1 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            },
            text: samples.otu_labels
  
        };
  
        // Setting the layout for the Bubble Plot/Chart
        var layout_b = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1000
        };
  
        // Creating the Data Variable 
        var data1 = [trace1];
  
        // Creating the Bubble Plot/Chart
        Plotly.newPlot("bubble", data1, layout_b); 
  
        // Creating the Guage Chart
  
        var data_g = [
          {
          domain: { x: [0, 1], y: [0, 1] },
          value: parseFloat(wfreq),
          title: { text: `Weekly Washing Frequency ` },
          type: "indicator",
          
          mode: "gauge+number",
          gauge: { axis: { range: [null, 9] },
                   steps: [
                    { range: [0, 2], color: "yellow" },
                    { range: [2, 4], color: "pink" },
                    { range: [4, 6], color: "teal" },
                    { range: [6, 8], color: "lime" },
                    { range: [8, 9], color: "green" },
                  ]}
              
          }
        ];
        var layout_g = { 
            width: 700, 
            height: 600, 
            margin: { t: 20, b: 40, l:100, r:100 } 
          };
        Plotly.newPlot("gauge", data_g, layout_g);
      });
  }  
// Create the function to get the necessary data
function getInfo(id) {
    // Reading the json file to reach the data
    d3.json("samples.json").then((data)=> {
        
        // Metadata info for the demographic panel
        var metadata = data.metadata;

        console.log(metadata)

        // Filtering the meta data info by id
        var result = metadata.filter(meta => meta.id.toString() === id)[0];

        // Selecting the demographic to put data
        var demographicInfo = d3.select("#sample-metadata");
        
        // Empty the demographic info panel each time before getting new id info
        demographicInfo.html("");

        // Grab the necessary demographic data data for the id and append the info to the panel
        Object.entries(result).forEach((key) => {   
                demographicInfo.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
        });
    });
}

// Creating the function change event
function optionChanged(id) {
    getPlot(id);
    getInfo(id);
}

// Creating the function for the initial data rendering
function init() {
    // Creating the Dropdown Menu Tab  
    var dropdown = d3.select("#selDataset");

    // Reading the data from the Samples.json 
    d3.json("samples.json").then((data)=> {
        console.log(data)

        // The ID data to the Dropdown Menu
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Creating and calling on the functions to display the data and the plots to the page
        getPlot(data.names[0]);
        getInfo(data.names[0]);
    });
}

init();