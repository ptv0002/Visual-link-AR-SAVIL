const Store = require('electron-store');

module.exports = new Store({
    schema: {
        displays: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    "id": {
                        type: 'number'
                    },
                    "width": {
                        type: 'number'
                    }
                }
            },
            default: []
        }
    }
});