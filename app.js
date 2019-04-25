var BUILDER = require('botbuilder');
var CONFIG = require('./config.js');
var Food = require('./dialogs/food.js')();
var Selector = require('./dialogs/selector.js').Selector;

// Create bot and bind to console
var connector = new BUILDER.ConsoleConnector().listen();
var bot = new BUILDER.UniversalBot(connector);

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://' + CONFIG.LUIS_URL + CONFIG.LUIS_KEYS;
var recognizer = new BUILDER.LuisRecognizer(model);
var dialog = new BUILDER.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

dialog.matches('Greetings', function(session, data){
    session.beginDialog('/Greetings', data)
});

dialog.matches('FoodChoice', function(session, data) {
    session.beginDialog('/FoodChoice', data)
});
bot.dialog('/Greetings', [function(session, data) {
    BUILDER.Prompts.confirm(session, 'Hi, do you need help choosing what to cook?');
},
function(session, data) {
    if(data.response) {
        session.userData.greetings = true;
        session.beginDialog('/FoodChoice')
    }
    else {
      BUILDER.DialogAction.endDialog();
    }
}]);
bot.dialog('/FoodChoice', Food);
bot.dialog('/selector', Selector);

dialog.onDefault(BUILDER.DialogAction.beginDialog('/Greetings'))
