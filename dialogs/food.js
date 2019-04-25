var BUILDER = require('botbuilder');
var HELPER = require('./../foodhelper.js')
module.exports = function(builder) {
    return [
        function(session, data, next){
            if(session.userData.foodChosen) {
                session.userData.foodlist = null;
                session.userData.food = null;
            }
            if(session.userData.food || session.userData.foodlist || session.userData.greetings || data) {
                if(data) {
                    if(data.entities) {
                        session.userData.entities = data.entities;
                    }
                }
                next();
            }
            else if(!data.entities) {
              session.userData.foodlist = null;
              BUILDER.Prompts.confirm(session, 'Looking for a new recipe?');
            } else {
              BUILDER.Prompts.confirm(session, 'Looking for a new recipe?');
            }
        },
        function(session, data, next) {
            if(!data.response && !session.userData.food && !session.userData.foodlist && !session.userData.entities && !session.userData.greetings) {
                session.endDialog('Thank you for using the food choice bot.');
            }
            else if(session.userData.foodlist || session.userData.entities) {
                next();
            } else {
                // BUILDER.Prompts.text(session, 'What protein do you want? \n Beef\n Pork\n Chicken\n Vegetarian\n You can also type "cancel" to cancel')
                var choices = ['Beef', 'Pork', 'Chicken', 'Vegetarian', 'Cancel']
                BUILDER.Prompts.choice(session, 'What type of food would you like?', choices);
            }
        },
        function(session, data) {
            data.response = session.userData.entities ? session.userData.entities[0]['type'] : data.response;
            // console.log(data.response['entity'])
            if(data.response['entity'] == 'Cancel'){
                session.endDialog('Thank you for using the food choice bot.')
            } else {
                HELPER.LUISCall(data.response)
                .then(function(res) {
                    var json = JSON.parse(res);
                    var protein = json.entities[0]['type'];
                    data.response = session.userData.foodlist ? session.userData.foodlist : protein;
                    if(data.response == 'beef'){
                        session.userData.foodlist = HELPER.foods.Beef;
                    } else if(data.response == 'pork'){
                        session.userData.foodlist = HELPER.foods.Pork;
                    } else if(data.response == 'chicken'){
                        session.userData.foodlist = HELPER.foods.Chicken;
                    } else if(data.response == 'vegetarian'){
                        session.userData.foodlist = HELPER.foods.Vegetarian;
                    } else if(data.response == 'Cancel') {
                        sesison.endDialog('Thank you for using the food choice bot.');
                    }
                    if(session.userData.foodlist.length) {
                        session.userData.food = session.userData.foodlist[Math.floor((Math.random() * session.userData.foodlist.length))];
                        BUILDER.Prompts.confirm(session, 'How do you feel about ' + session.userData.food + '?');
                    }
                })
                .catch(function(reason) {
                    HELPER.nomore(session);
                })
            }
        },
        function(session, data) {
            switch(data.response) {
                case 'cancel' :
                    session.endDialog('Thank you for using the food choice bot.')
                    break;
                case true :
                    if(session.userData.food) {
                        session.send('Bon Appetit! Enjoy your ' + session.userData.food)
                    }
                    session.userData.foodChosen = true;
                    session.userData.entities = null;
                    session.endConversation();
                    break;
                case false :
                    session.userData.foodlist = HELPER.remove(session.userData.foodlist, session.userData.food)
                    session.beginDialog('/selector');
                    break;
                default :
                    HELPER.LUISCall(data.response)
                    .then(function(res) {
                        var json = JSON.parse(res);
                        // console.log(json)
                        var protein = json.entities[0]['type'];
                        // console.log(json)
                        data.response = session.userData.foodlist ? session.userData.foodlist : protein;
                        if(data.response == 'beef'){
                            session.userData.foodlist = HELPER.foods.Beef;
                        } else if(data.response == 'pork'){
                            session.userData.foodlist = HELPER.foods.Pork;
                        } else if(data.response == 'chicken'){
                            session.userData.foodlist = HELPER.foods.Chicken;
                        } else if(data.response == 'vegetarian'){
                            session.userData.foodlist = HELPER.foods.Vegetarian;
                        }
                        if(session.userData.foodlist) {
                            session.userData.food = session.userData.foodlist[Math.floor((Math.random() * session.userData.foodlist.length))];
                            BUILDER.Prompts.confirm(session, 'How do you feel about ' + session.userData.food + ' ?');
                        }
                    })
                    .catch(function(reason) {
                        HELPER.nomore(session);
                    })
                    break;
            }
        },
        function(session, data) {
          switch(data.response) {
            case 'cancel':
              session.endDialog('Thank you for using the food choice bot!');
              break;
            case true:
              if(session.userData.food) {
                session.send('Bon Appetit! Enjoy your ' + session.userData.food);
              }
              session.userData.foodChosen = true;
              session.userData.entities = null;
              session.endDialog();
              break;
            case false:
              session.userData.foodlist = HELPER.remove(session.userData.foodlist, session.userData.food);
              session.beginDialog('/selector');
              break;
            default:
            var args = data.response;
            session.userData.foodlist = data.response;
            session.beginDialog('/', args)
            break;
          }
        }
    ];
}
