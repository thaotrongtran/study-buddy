/* eslint-disable  func-names */
/* eslint-disable  no-console */
const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = "Hey, what's up?";

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    },
};


const AddHomeworkIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AddHomework';
    },
    handle(handlerInput) {
        console.log(handlerInput);
        const speechText = handlerInput.requestEnvelope.request.intent.slots.task.value;
        const dateText = handlerInput.requestEnvelope.request.intent.slots.date.value;
        if(speechText && dateText){
            var docClient = new AWS.DynamoDB.DocumentClient();
             var params = {
            TableName: 'tasksList',
            Item: {
                'taskDescription': speechText,
                'dueDate': dateText
            }
        };
         //Call DynamoDB to add the item to the table
        docClient.put(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
        });

            return handlerInput.responseBuilder
            .speak('Your added task is ' + speechText)
            .withSimpleCard('Your added task is ' + speechText)
            .getResponse();
         } else {
            return handlerInput.responseBuilder
            .speak("What is the due date?")
            .addElicitSlotDirective("date")
            .getResponse();
        }
    }
};

// function dynamoScan() {
//     return new Promise(function(resolve, reject) {
//         var lastOne
//         var docClient = new AWS.DynamoDB.DocumentClient();
//         var tasks = [];
//         var params = {TableName: 'tasksList', ProjectionExpression: 'dueDate, taskDescription'};
//             var onScan = (err, data) => {
//             if (err) {
//                 console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
//             } else {
//                 console.log("Scan succeeded.");
//                 data.Items.forEach(function(task) {
//                     if(task != null){
//                         tasks.push(task);
//                     }
//                 });
//             }
//             tasks = tasks.sort(function(a,b){
//             var c = new Date(a.dueDate);
//             var d = new Date(b.dueDate);
//             return c-d;
//              });
//             lastOne = tasks.shift();
//             return resolve(lastOne);
//     }
//     docClient.scan(params, onScan)
//     })
// }

const GetHomeworkIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'GetHomework';
    },
    handle(handlerInput) {

    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
        TableName: 'currentTask',
        Item: {
            'taskID': 01,
            'taskDescription': "Computer Science PA1",
            'dueDate': "01/10/2018"
            }
    };
    docClient.put(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data);
            }
    });

    // var temp;
    //var x = dynamoScan()

    // x.then(function(results) {
    // //  return handlerInput.responseBuilder
    // //     .speak("You should do Computer Science PA1 which is due on 01/10/2018")
    // //     //.speak("Good data")
    // //     .getResponse();
    // }
    // ).catch(function(err) {
    //     console.log(err)
    // })


    return handlerInput.responseBuilder
      .speak("You should do Computer Science PA1 which is due on 01/10/2018")
        //.speak("Good data")
        .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    },
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

        return handlerInput.responseBuilder.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);

        return handlerInput.responseBuilder
            .speak('Sorry, I can\'t understand the command. Please say again.')
            .reprompt('Sorry, I can\'t understand the command. Please say again.')
            .getResponse();
    },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        AddHomeworkIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        GetHomeworkIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
