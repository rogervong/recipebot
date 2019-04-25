var BUILDER = require('botbuilder');
var CONFIG = require('./config.js');
module.exports = {
    remove: function(list, food) {
        for(var i = list.length; i >= 0; i --) {
            if(list[i] == food) {
                list.splice(i,1);
            }
        }
        return list;
    },
    foods: {
        proteins : ['Beef', 'Pork', 'Chicken', 'Vegetarian'],
        Beef : ['Steak', 'Meatloaf', 'Hamburger', 'Beef Wellington', 'Corned Beef'],
        Pork : ['Kalua Pork', 'Pork Chops', 'Ham', 'BBQ Pork', 'Roasted Pork'],
        Chicken : ['Orange Chicken', 'Fried Chicken', 'Grilled Chicken', 'Teriyaki Chicken', 'Salt and Pepper Chicken'],
        Vegetarian : ['Cauliflower Mac and Cheese', 'Sweet Potato Casserole', 'Salad', 'Ratatouille', 'Mushroom-Artichoke Lasagna']
    },
    LUISCall: function(request) {
        // console.log(request.entity)
		var options = {
			host: CONFIG.LUIS_URL,
			path: CONFIG.LUIS_KEYS + request.entity
		};
        // console.log(options)
		var response = "";

		return new Promise(function(resolve, reject){
			var request = require("https").request(options, function(res){
				res.setEncoding('utf8');
				res.on('data', function(data) {
					response += data;
				});
				res.on('error', function(err){
					return reject(err);
				});
				res.on('end', function(){
					if(!response) {
						return resolve('');
					}
					return resolve(response);
				});
			}).end()
		})
	},
  nomore: function(session) {
    BUILDER.Prompts.text(session, 'Something is wrong')
  }
}
