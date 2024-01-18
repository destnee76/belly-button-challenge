// store URL souce
let url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Initialize...Sample data
function init() {
    let dropdownMenu = d3.select("#selDataset");
    // fetch the JSON data
    d3.json(url).then(function (data) {
        console.log(data);
        let names = data.names;

        for (let i = 0; i < names.length; i++) {
            dropdownMenu.append("option").text(names[i]).property("value", names[i])
        }
        // Build the initial charts and metadata display for the first sample
        buildChart(names[0])
        buildMetadata(names[0])
        buildGaugeChart(names[0])
        
    });
}
init()

// Build a horizontal bar chart and a bubble chart based on the selected sample
function buildChart(sample_id) {
    d3.json(url).then(function (data) {
        let samples = data.samples
        let sample = samples.filter(element => element.id == sample_id)[0]
        console.log(sample)

        //Extract data for the bar chart
        let otu_ids=sample.otu_ids.slice(0,10).map(otu_id=>`OTU ${otu_id}`).reverse()
        let otu_labels=sample.otu_labels.slice(0,10).reverse()
        let sample_values=sample.sample_values.slice(0,10).reverse()

        //Create trace bar chart
        let trace={
            x:sample_values,
            y:otu_ids,
            text: otu_labels,
            type: "bar",
            orientation:"h",
            marker:{
                color: 'rgb(15,255,200)',
                opacity: .7
            }
        }
        Plotly.newPlot("bar",[trace])

        //Create trace bubble chart
        let bubbletrace = {
            x: sample.otu_ids,
            y: sample.sample_values,
            text: sample.otu_labels,
            mode: "markers",
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids,
                colorscale: "Picnic"
            }
        }
        Plotly.newPlot("bubble",[bubbletrace])
    })
}

// Display metadata associated with the selected sample
function buildMetadata(sample_id){
    d3.json(url).then(function (data) {
        let metadatalist = data.metadata
        let metadata = metadatalist.filter(element => element.id == sample_id)[0]
        // console.log(metadata)
        
        // Select the HTML element for metadata display
        let PANEL=d3.select("#sample-metadata")
        PANEL.html("")
        
        // Display each key-value pair from the metadata JSON object
        for (key in metadata){
            PANEL.append("h6").text(key.toUpperCase()+": "+metadata[key])
        }
    })
}

// Build a gauge chart
function buildGaugeChart(sample_id) {
    d3.json(url).then(function (data) {
        let metadata = data.metadata.find(element => element.id == sample_id);
        let washFrequency = metadata ? metadata.wfreq : 0;

        // Create trace for the gauge chart
        let gaugeTrace = {
            value: washFrequency,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 9], tickmode: "linear" },
                steps: Array.from({ length: 9 }, (_, i) => ({ range: [i, i + 1], color: `rgba(${255 - i * 25}, ${255 - i * 20}, 0, .5)` }))
            }
        };

        Plotly.newPlot("gauge", [gaugeTrace]);
    });
}

// Update charts and metadata when a new sample is selected
function optionChanged(newSample){
    buildChart(newSample)
    buildMetadata(newSample)
    buildGaugeChart(newSample)
}