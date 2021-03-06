import BrowserWindow from 'sketch-module-web-view';
import {
  getWebview
} from 'sketch-module-web-view/remote';
import {
  sayHi,
  getDocumentColors
} from './shared';

const UI = require('sketch/ui')

const webviewIdentifier = 'tin-drum.webview';
const Document = require('sketch/dom').Document;

let document = Document.getSelectedDocument();
let page = document.selectedPage;
let selection = page.selectedLayers;
let selectedTextLayers = selection.layers.filter(layer => layer.type === "Text");

const reselect = () => {
  document = Document.getSelectedDocument();
  page = document.selectedPage;
  selection = page.selectedLayers;
  selectedTextLayers = selection.layers.filter(layer => layer.type === "Text");
}

let model = {
  "alignment": {
    "left": true,
    "center": true,
    "right": true,
    "justify": false
  },
  "colors": {}
};


model.colors = getDocumentColors(document.colors);

export default function() {
  const options = {
    identifier: webviewIdentifier,
    width: 308,
    height: 480,
    show: true,
    resizable: true,
    alwaysOnTop: true,
    titleBarStyle: 'default',
    movable: true,
    remembersWindowFrame: true,
    center: true
  };

  const browserWindow = new BrowserWindow(options);

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  });

  const webContents = browserWindow.webContents;

  browserWindow.loadURL(require('../resources/webview.html'))

  // print a message when the page loads
  // webContents.on('did-finish-load', () => {
  //     // UI.message('UI loaded!!!')
  // });

  // push colors to UI
  browserWindow.webContents
    .executeJavaScript(`pushColors(${JSON.stringify(model.colors)})`)
    .then(res => console.log(res))
    .catch(err => console.log(err));

  // update colors form UI
  webContents.on('updateColors', (properties) => {
    model.colors = properties;
    console.log(model);
  })
  // add a handler for a call from web content's javascript
  webContents.on('runTinDrum', (alignments) => {

    // count created styles
    let createdStyles = 0;

    // reselect text layers
    reselect();

    // set model alignment
    model.alignment = alignments;

    // create arrays out of alignment and color entries
    const alignmentEntries = Object.entries(model.alignment);
    const colorEntries = Object.entries(model.colors);

    // generateTextStyles function: pass the textLayer model and the model
    selectedTextLayers.forEach(textLayer => {

      const originalStyleColor = textLayer.style.textColor;
      // loop through alignments and go only for those that are true
      for (let i = 0; i < alignmentEntries.length; i++) {

        // check if alignment value is true
        if (alignmentEntries[i][1]) {

          // loop through colors and modify layers styles
          for (let j = 0; j < colorEntries.length; j++) {
            textLayer.style.alignment = alignmentEntries[i][0];
            textLayer.style.textColor = colorEntries[j][1];

            // push the style
            document.sharedTextStyles.push({
              name: `${textLayer.name} / ${alignmentEntries[i][0]} / ${colorEntries[j][0]}`,
              style: textLayer.style
            });
            // keep track of how many styles created
            createdStyles++;
          }
          // end of color loop
        }
      }
      // end of alignment loop
      textLayer.style.textColor = originalStyleColor;
    });
    // message at the end
    if (createdStyles > 0) {
      UI.message(`🤟 Rock On 🤟 ${createdStyles} styles were created!!!`)
    } else {
      UI.message(`🤦🏼‍♀️ Nothing happend...`)
    }
  });

}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}
