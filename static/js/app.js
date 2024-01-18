// store URL souce
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// Use sample_values as the values for the bar chart.
// Use otu_ids as the labels for the bar chart.
// Use otu_labels as the hovertext for the chart.



// Initialize...Sample data
function init() {
    let dropdownMenu = d3.select("#selDataset");
    // fetch the JSON data
    d3.json(url).then(function (data) {
        console.log(data);
        const names = data.names;

        for (let i = 0; i < names.length; i++) {
            dropdownMenu.append("option").text(names[i]).property("value", names[i])
        }
        buildChart(names[0])
        buildMetadata(names[0])
        buildGaugeChart(names[0])
        
    });
}
init()

function buildChart(sample_id) {
    d3.json(url).then(function (data) {
        const samples = data.samples
        const sample = samples.filter(element => element.id == sample_id)[0]
        console.log(sample)
        //const otu_ids=sample.otu_ids.slice(0,10).map(otu_id=>"OTU "+otu_id).reverse()
        const otu_ids=sample.otu_ids.slice(0,10).map(otu_id=>`OTU ${otu_id}`).reverse()
        const otu_labels=sample.otu_labels.slice(0,10).reverse()
        const sample_values=sample.sample_values.slice(0,10).reverse()

        const trace={
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

        const bubbletrace = {
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

function buildMetadata(sample_id){
    d3.json(url).then(function (data) {
        const metadatalist = data.metadata
        const metadata = metadatalist.filter(element => element.id == sample_id)[0]
        // console.log(metadata)
        const PANEL=d3.select("#sample-metadata")
        PANEL.html("")
        for (key in metadata){
            PANEL.append("h6").text(key.toUpperCase()+": "+metadata[key])
        }
    })
}

function buildGaugeChart(sample_id) {
    d3.json(url).then(function (data) {
        const metadata = data.metadata.find(element => element.id == sample_id);
        const washFrequency = metadata ? metadata.wfreq : 0;

        const gaugeTrace = {
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

// Display each key-value pair from the metadata JSON object somewhere on the page
function optionChanged(newSample){
    buildChart(newSample)
    buildMetadata(newSample)
    buildGaugeChart(newSample)
}