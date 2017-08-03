
// Helper methods for color


class ColorHelper {
    constructor() {}
    /**
     * Dims any hex color inserted
     * If hex color is 010101, it will return 000000.
     * All returned hex letters will be lowercase;
     * @param hexColor {string} - hex color 
     * @param level {number} - level of dim 1 to infinite
     * @return {string} - dimmed hex color
     */
    dim (hexColor, level) {
        let curLevel = level || 1;
        let dimColor = "#";
        let hex = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];
        let index = 0;
        let letter = /^[a-zA-Z]+$/;
        if (hexColor.length >= 6 && hexColor.length <= 7) {
            if (hexColor[0] == '#') {index++}

            let preHexIndex;
            let char;
            for (let i = index; i < (6+index); i++) {
                char = hexColor[i];
                if (char.match(letter)) {char = char.toLowerCase()}
                preHexIndex = hex.indexOf(char);
                preHexIndex -= curLevel;
                if (preHexIndex < 0) {preHexIndex = 0}
                dimColor += hex[preHexIndex]
            }

            return dimColor;
        } else {
            throw new Error('Hex Color Invalid');
        }
        
    }
    }
}

module.exports = ColorHelper;