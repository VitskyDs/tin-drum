//
const colorList = document.getElementById('color-list');

// model
let model = {
  "alignment": {
    "left": true,
    "center": true,
    "right": true,
    "justify": false
  }
};

// Listen to alignment events and toggle on class
const alignmentItems = document.getElementsByClassName('alignment-item');
const alignLeft = document.getElementById('left');
const alignCenter = document.getElementById('center');
const alignRight = document.getElementById('right');
const alignJustify = document.getElementById('justify');

Array.from(alignmentItems).forEach(function(element) {
  element.addEventListener('click', function() {
    this.classList.toggle('on');
  });
});

// disable the context menu (eg. the right click menu) to have a more native feel
// document.addEventListener('contextmenu', (e) => {
//     e.preventDefault()
// })

// push colors to model
window.pushColors = function(arg) {
  model.colors = arg;
  const colorEntries = Object.entries(model.colors);

  // create Div
  let colorItems = ``;
  for (var i = 0; i < 3; i++) {
    colorItems += `
    <div class="color-item">
      <div class="color-circle" style="background-color: ${colorEntries[i][1]};"></div>
      <div class="color-name">
        <p>${colorEntries[i][0]}</p>
      </div>
      <button class="remove-color">×</button>
    </div>
    <div></div>
    `
  }
  colorList.innerHTML = colorItems;
}

// call the plugin from the webview
document.getElementById('drum-roll').addEventListener('click', () => {

  // needs work: evaluate alignments and modify model
  if (alignLeft.classList.contains('on')) {
    model.alignment.left = true
  } else {
    model.alignment.left = false
  }
  if (alignCenter.classList.contains('on')) {
    model.alignment.center = true
  } else {
    model.alignment.center = false
  }
  if (alignRight.classList.contains('on')) {
    model.alignment.right = true
  } else {
    model.alignment.right = false
  }
  if (alignJustify.classList.contains('on')) {
    model.alignment.justify = true
  } else {
    model.alignment.justify = false
  }

  // evaluate colors and modify model

  // post message
  window.postMessage('runTinDrum', model.alignment);
});
