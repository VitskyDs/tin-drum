import sketch from 'sketch'
import BrowserWindow from 'sketch-module-web-view'
import {getWebview} from 'sketch-module-web-view/remote'
var Document = require('sketch/dom').Document
const document = Document.getSelectedDocument();

const UI = require('sketch/ui')

let createdStyles = 0;

// model
let model = {};

export default function() {

  console.log(document)
  // run webview
  const webviewIdentifier = 'webview.webview'

  const options = {
    identifier: webviewIdentifier,
    width: 260,
    height: 480,
    show: false
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message('UI loaded!')
  })

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', s => {
    UI.message(s)
    webContents
      .executeJavaScript(`setRandomNumber(${Math.random()})`)
      .catch(console.error)
  })

  webContents.on('postProperties', properties => {
    UI.message(properties);
    model.colors = properties;
  })

  webContents.on('runTinDrum', properties => {
    UI.message('running TinDrum');
    model = properties;
    mainFunction();
  })

  browserWindow.loadURL(require('../resources/webview.html'))
}

function generateColors(shapeLayer) {
  model.colors[shapeLayer.name] = shapeLayer.style.fills[0].color;
}

function generateTextStyles(textLayer) {
  const alignmentEntries = Object.entries(model.alignment);
  const colorEntries = Object.entries(model.colors);
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

function mainFunction() {
  // define consts
  const selection = document.selectedLayers;
  const selectedLayers = selection.layers;
  const selectedTextLayers = selection.layers.filter(layer => layer.type === "Text");
  const selectedShapeLayers = selection.layers.filter(layer => layer.type === "ShapePath");

  // validate selected layers have at least one text layer
  if (selectedLayers.length <= 0 && selectedTextLayers.length == 0) {
    UI.message(`Select some text and shape layers plz...`)
  } else if (selectedLayers.length > 0 && selectedTextLayers.length == 0) {
    UI.message(`Select some text layers as well plz...`)
  } else {
    // UI.message(`⏳This might take a few seconds`)
    // loop through the selected shape layers and update colors
    if (selectedShapeLayers.length > 0) {
      // reset model.colors
      model.colors = {};
      // populate model.colors from selectedShapeLayers
      selectedShapeLayers.forEach(generateColors);
    }

    // loop through the selected text layers and create styles
    selectedTextLayers.forEach(generateTextStyles);

    // message at the end
    if (createdStyles > 0) {
      UI.message(`🤟 Rock On 🤟 ${createdStyles} styles were created!!!`)
    } else {
      UI.message(`🤦🏼‍♀️ Nothing happend...`)
    }
  }
}
