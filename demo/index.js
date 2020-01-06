var fs = require("fs")
fs.readdirSync(__dirname).filter(function (item) {
    var reg = /^(test)/ig
    if (reg.test(item)) {
        require(`./${item}`)
    }
    return false
})
