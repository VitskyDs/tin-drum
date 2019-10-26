function sayHi(message) {
    console.log(`say: ${JSON.stringify(message)}`);
}

// populate model colors from saved colors
const getDocumentColors = (colors) => {
    let model = {};
    //console.log(colors)
    colors.forEach(function (color) {
        model[color.name] = color.color;
    });
    return model;
};

module.exports = {sayHi, getDocumentColors};


