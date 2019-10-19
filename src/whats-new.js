import sketch from 'sketch'

export default function() {
  var UI = require('sketch/ui')
  const Document = require('sketch/dom').Document;
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString("https://github.com/VitskyDs/tin-drum"));
}
