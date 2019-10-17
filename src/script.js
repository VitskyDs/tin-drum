var onRun = function(context) {
  const sketch = require('sketch')
  var UI = require('sketch/ui')

  const Document = require('sketch/dom').Document;

  const document = Document.getSelectedDocument();
  const page = document.selectedPage;
  const selection = document.selectedLayers;
  const selectedLayers = selection.layers;

  let createdStyles = 0;

  // model
  let model = {
    "alignment": {
      "Left": true,
      "Center": true,
      "right": true,
      "Justify": false
    },
    "colors": {
      "Dark": "#000000",
      "Gray": "#aaaaaa",
      "Light": "#ffffff"
    }
  };

  if (selectedLayers.every(layer => layer.type === 'Text')) {

    const alignmentEntries = Object.entries(model.alignment);
    const colorEntries = Object.entries(model.colors);

    // loop through the selected layers
    for (let textLayer of selectedLayers) {

      let originalStyle = textLayer.style;

      // loop through alignments and go only for those that are true
      for (var i = 0; i < alignmentEntries.length; i++) {
        // check if alignment value is true
        if (alignmentEntries[i][1]) {

          // loop through colors and create styles
          for (var j = 0; j < colorEntries.length; j++) {
            textLayer.style.alignment = alignmentEntries[i][0];
            textLayer.style.textColor = colorEntries[j][1];
            // push the style
            document.sharedTextStyles.push({
              name: `${textLayer.name} / ${alignmentEntries[i][0]} / ${colorEntries[j][0]}`,
              style: textLayer.style
            });
            createdStyles++;
          }
          // end of color loop
        }
      }
      // end of alignment loop
      textLayer.style.alignment = alignmentEntries[0][0];
      textLayer.style.textColor = colorEntries[0][1];
    }
  }
  if (createdStyles > 0) {
    UI.message(`🤟 Rock On 🤟 ${createdStyles} styles created!`)
  } else {
    UI.message(`🤦🏼‍♀️ Nothing happend...`)
  }
};
