var BUILDER = require('botbuilder');
var HELPER = require('./../foodhelper.js')

module.exports.Selector = [
    function(session, data) {
        session.userData.foodlist = data ? data.foodlist : session.userData.foodlist;
        session.userData.food = session.userData.foodlist[Math.floor((Math.random() * session.userData.foodlist.length))];
        session.userData.foodlist = HELPER.remove(session.userData.foodlist, session.userData.food);
        BUILDER.Prompts.confirm(session, 'How do you feel about ' + session.userData.food + '?');
    },
    function(session, data) {
        if(data.response) {
            session.send('Bon Appetit! Enjoy your ' + session.userData.food)
            session.userData.foodChosen = true;
            session.userData.entities = null;
            session.endConversation();
        } else if(session.userData.foodlist.length < 1) {
            BUILDER.Prompts.confirm(session, 'You ran out of options, do you want to pick a different protein?')
        } else {
            session.replaceDialog('/selector', session.userData);
        }
    },
    function(session, data) {
        if(data.response == 'cancel' || !data.response) {
            session.userData.foodlist = null;
            session.userData.food = null;
            session.userData.entities = null;
            session.endDialog('Thank you for using the food choice bot');
        } else if(data.response == 'yes') {
            session.endDialog('Bon Appetit! Enjoy your ' + session.userData.food);
            session.userData.foodChosen = true;
            session.userData.entities = null;
            session.endConversation();
        } else if(data.response == 'no') {
            session.userData.foodlist = HELPER.remove(session.userData.foodlist, session.userData.food);
            session.replaceDialog('/selector', session.userData);
        } else if(data.response && session.userData.foodlist.length < 1) {
            session.userData.foodlist = null;
            session.userData.entities = null;
            session.replaceDialog('/FoodChoice');
        } else {
            HELPER.nomore(session);
        }
    }
]
