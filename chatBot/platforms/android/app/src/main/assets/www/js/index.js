
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();




var accessToken = "9d78c1978c584bc9b40089587a9a3c31";
var baseUrl = "https://api.api.ai/v1/";
var conversation = [];

$(document).ready(function() {
    $("#input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            send();
        }
    });
    $("#rec").click(function(event) {
        switchRecognition();
          // Start listening. You can call this here, or attach this call to an event, button, etc.
          // annyang.start();
    });
});

var recognition;

function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function(event) {
        updateRec();
    };
    recognition.onresult = function(event) {
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };
    recognition.onend = function() {
        stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    updateRec();
}

function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        startRecognition();
    }
}

function setInput(text) {
    $("#input").val(text);
    send();
}

function updateRec() {
    $("#rec").text(recognition ? "Stop" : "Speak");
}

//Send
function send() {
    
    var text = $("#input").val();
    conversation.push("Dinesh: " + text + '\r\n');
    
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
        success: function(data) {
            var respText = data.result.fulfillment.speech;
            console.log("AI_Response: " + respText);
            setResponse(respText);
            responsiveVoice.speak(respText);
        },
        error: function() {
            setResponse("Internal Server Error");
        }
    });
    // setResponse("Thinking...");
}


function setResponse(val) {
    conversation.push("AI: " + val + '\r\n'); 
    //$("#response").text(val);
    $("#response").text(conversation.join(""));
    var $textarea = $('#response');
    $textarea.scrollTop($textarea[0].scrollHeight);
}


if (annyang) {
// Let's define our first command. First the text we expect, and then the function it should call
var commands = {
'show tps report': function() {
$('#tpsreport').animate({bottom: '-100px'});
}
};

// Add our commands to annyang
annyang.addCommands(commands);


}
