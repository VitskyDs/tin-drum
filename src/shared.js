const generateTextStyles = (textLayer, model) => {

}

function sayHi(message) {
    console.log(`say: ${JSON.stringify(message)}`);
}

// populate model colors from saved colors
const getDocumentColors = (colors) => {
    let documentColors = {
        "colors": {}
    };
    //console.log(colors)
    colors.forEach(function (color) {
        documentColors.colors[color.name] = color.color;
    });
    return colors
};

module.exports = {sayHi, getDocumentColors, generateTextStyles};


