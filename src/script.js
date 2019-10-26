import BrowserWindow from 'sketch-module-web-view';
import {getWebview} from 'sketch-module-web-view/remote';
import {sayHi} from './shared';

const UI = require('sketch/ui')

const webviewIdentifier = 'tin-drum.webview';
const Document = require('sketch/dom').Document;
const document = Document.getSelectedDocument();
const selection = document.selectedLayers;
const selectedTextLayers = selection.layers.filter(layer => layer.type === "Text");

let createdStyles = 0;
let documentColors = document.colors;

let model = {
    "alignment": {
        "left": true,
        "center": true,
        "right": true,
        "justify": false
    },
    "colors": {}
};

export default function () {
    const options = {
        identifier: webviewIdentifier,
        width: 260,
        height: 480,
        show: false
    };

    const browserWindow = new BrowserWindow(options);

    // only show the window when the page has loaded to avoid a white flash
    browserWindow.once('ready-to-show', () => {
        browserWindow.show()
    });

    const webContents = browserWindow.webContents;

    // print a message when the page loads
    webContents.on('did-finish-load', () => {
        UI.message('UI loaded!!!')
    });


    // add a handler for a call from web content's javascript
    webContents.on('runTinDrum', (properties) => {
        UI.message('tododom tododom');

        // set model alignment
        model.alignment = properties;

        // get document colors
        documentColors.forEach(color => {
            model.colors[color.name] = color.color;
        });

        // create arrays out of alignment and color entries
        const alignmentEntries = Object.entries(model.alignment);
        const colorEntries = Object.entries(model.colors);

        sayHi(alignmentEntries)
        sayHi(colorEntries)

        // generateTextStyles function: pass the textLayer model and the model
        selectedTextLayers.forEach( textLayer => {
            sayHi(textLayer);
            // let originalStyle = textLayer.style;

            // loop through alignments and go only for those that are true
            for (let i = 0; i < 4; i++) {

                // check if alignment value is true
                if (alignmentEntries[i][1]) {

                    // loop through colors and create styles
                    for (let j = 0; j < colorEntries.length; j++) {
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
        });

        // say hi

    });

    browserWindow.loadURL(require('../resources/webview.html'))
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
    const existingWebview = getWebview(webviewIdentifier)
    if (existingWebview) {
        existingWebview.close()
    }
}
