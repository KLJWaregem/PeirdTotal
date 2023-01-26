let countdownInterval;
let numbers = [];
let lastRandom = 0;
let countdown = {};
let reward = "";


$(document).ready(() => {
    $(".countdown").hide();
    $(".spinners").hide();
    initWebSocket();
});

function initWebSocket() {
    let webSocket = new WebSocket(location.origin.replace(/^http/, 'ws').replace('3000', '3001'));
    webSocket.onmessage = function (e) {
        let message = JSON.parse(e.data);
        if (message.type === "Time") {
            console.log(message.payload)
            countdown = new Date(message.payload.Date);
            reward = message.payload.Reward;
            lastRandom = (1 * message.payload.From) + (1 * Math.round(Math.random() * (message.payload.Till - message.payload.From)));
            console.log(lastRandom)
            initCountDown();
        }
    };
    webSocket.onclose = function (e) {
        setTimeout(function () {
            initWebSocket();
        }, 1000);
    };
    webSocket.onerror = function (err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        webSocket.close();
    };
}

function initCountDown() {
    clearInterval(countdownInterval);
    $(".countdown").show();
    $(".spinners").hide();
    $(".reward").html(reward);
    let countDownDate = new Date(countdown).getTime();

    countdownInterval = setInterval(function () {
        let now = new Date().getTime();
        let distance = countDownDate - now;
        let minutes = Math.max(0, Math.floor(distance / (1000 * 60)));
        let seconds = Math.max(0, Math.floor(distance % (1000 * 60) / 1000));

        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;


        $(".countdown").html(minutes + ":" + seconds);

        if (distance < 0) {
            clearInterval(countdownInterval);
            StartRandomNumber();
        }
    }, 100);
}

function StartRandomNumber() {
    $(".countdown").hide();
    $(".spinners").show();
    numbers = [0, 0, 0, 0];

    let num1 = lastRandom / 1000;
    let num2 = lastRandom / 100 % 10;
    let num3 = lastRandom / 10 % 10;
    let num4 = lastRandom % 10;

    $("#spinner1").empty();
    $("#spinner2").empty();
    $("#spinner3").empty();
    $("#spinner4").empty();


    window.setTimeout(function () {
        setDeceleratingTimeout(rollNumber, 50, 9 + num1, 1);
    }, 0);
    window.setTimeout(function () {
        setDeceleratingTimeout(rollNumber, 50, 9 + num2, 2);
    }, 500);
    window.setTimeout(function () {
        setDeceleratingTimeout(rollNumber, 50, 9 + num3, 3);
    }, 1000);
    window.setTimeout(function () {
        setDeceleratingTimeout(rollNumber, 50, 9 + num4, 4);
    }, 1500);
}

function setDeceleratingTimeout(callback, factor, times, spinner) {

    var internalCallback = function (tick, counter) {
        return function () {
            if (--tick >= 0) {
                window.setTimeout(internalCallback, ++counter * factor + 250);
                callback(counter * factor + 250, false, spinner);
            } else {
                callback(counter * factor + 250, true, spinner);
            }
        };
    }(times, 0);

    window.setTimeout(internalCallback, factor);
}

function rollNumber(time, keep, spinner) {
    var number = numbers[spinner - 1] + 1;
    if (number > 9) number = 0;
    numbers[spinner - 1] = number;
    if (keep) {
        var div1 = $("<div>").html(number);
        $(div1).addClass("item");
        $("#spinner" + spinner).append(div1);
        $(div1).animate({
            top: "+=200px"
        }, time / 2, function () {
            $("#spinner" + spinner).find('div:first').addClass("finish");
        });
    } else {
        var div = $("<div>").html(number);
        $(div).addClass("item");
        $("#spinner" + spinner).append(div);
        $(div).animate({
            top: "+=400px"
        }, time, function () {
            $("#spinner" + spinner).find('div:first').remove();
        });
    }
}