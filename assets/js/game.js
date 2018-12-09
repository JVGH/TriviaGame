$(document).ready(function () {

    /* Q & A List */
    let qaList = [{
            question: "Which app was launched by Mark Zuckerberg?",
            answer: "facebook",
            choices: ["facebook", "instagram", "twitter", "linkedin"]
        },
        {
            question: "Which app was created by Kevin Systrom and Mike Krieger?",
            answer: "instagram",
            choices: ["instagram", "linkedin", "snapchat", "twitter"]
        },
        {
            question: "Which app is a business and employment-oriented service that operates via websites and mobile apps?",
            answer: "linkedin",
            choices: ["linkedin", "youtube", "twitter", "snapchat"]
        },
        {
            question: "Which app was created by Evan Spiegel, Bobby Murphy, Reggie Brown?",
            answer: "snapchat",
            choices: ["snapchat", "twitter", "linkedin", "instagram"]
        },
        {
            question: "Which app had its users' each content restricted to 140 characters?",
            answer: "twitter",
            choices: ["twitter", "snapchat", "instagram", "facebook"]
        },
        {
            question: "Which app was used to view videos and is currently owned by the Goog?",
            answer: "youtube",
            choices: ["youtube", "instagram", "twitter", "snapchat"]
        }
    ];

    /* FX to shuffle content of the Q&A array */
    function shuffleQAArrList(arr) {
        let i = arr.length;
        let temp;
        let arrayIndex;

        while (i > 0) {
            arrayIndex = Math.floor(Math.random() * i);
            i--;
            temp = arr[i];
            arr[i] = arr[arrayIndex];
            arr[arrayIndex] = temp;
        }
        return arr;
    }

    /* Configure toggle and initiate start/reset game */
    let toggleButton = $("#startGame");
    let mainContent = $("#mainContent");
    let cardContent = $(".card");

    toggleButton.on("click", function () {
        if (toggleButton.attr("data-click-state") == 1) {
            toggleButton.attr("data-click-state", 0)
                .text("Start")
                .removeClass("btn-outline-danger")
                .addClass("btn-outline-success");
            stopCountdown();
            timer.stop();
        } else {
            toggleButton.attr("data-click-state", 1)
            toggleButton.text("End")
                .removeClass("btn-outline-success")
                .addClass("btn-outline-danger");
            startGame();
        };

        mainContent.slideToggle("slow");

        /* Show/hide main/card content*/
        if (cardContent.is(":hidden")) {
            mainContent.slideToggle("slow");
            cardContent.slideToggle("slow");
        }
    });

    /* Progress Bar related code */
    let progressBar = $('.progress-bar');
    let progressBarMin;
    let progressBarMax;
    let progressBarNow;
    let progressBarSize;
    let counterInterval;
    let counterIntervalId;

    function startCountdown() {
        clearInterval(counterIntervalId);
        resetProgressBar();
        counterIntervalId = setInterval(decrementCounter, 1000);
    }

    function stopCountdown() {
        clearInterval(counterIntervalId);
        setTimeout(nextRound, 1000);
    }

    function decrementCounter() {
        counterInterval--;
        progressBarNow--;
        progressBarSize = (progressBarNow - progressBarMin) * 100 / (progressBarMax - progressBarMin);
        progressBar.css('width', progressBarSize + '%');
        progressBar.html(counterInterval + ' ');

        if (counterInterval == progressBarMin) {
            incrementUnansweredCount(1);
            stopCountdown();
        }
    }

    function resetProgressBar() {
        progressBar.attr('aria-valuemin', "0");
        progressBar.attr('aria-valuemax', "30");
        progressBar.attr('aria-valuenow', "30");
        progressBarMin = progressBar.attr('aria-valuemin');
        progressBarMax = progressBar.attr('aria-valuemax');
        progressBarNow = progressBar.attr('aria-valuenow');
        progressBarSize = (progressBarNow - progressBarMin) * 100 / (progressBarMax - progressBarMin);
        progressBar.css('width', progressBarSize + '%');
        progressBar.html(counterInterval + ' ');
        counterInterval = progressBarMax;
    }

    /* Overall Timer related code */
    let intervalId;

    let clockRunning = false;

    let timer = {
        time: 0,
        reset: function () {
            clearInterval(intervalId);
            clockRunning = false;
            timer.time = 0;

            $("#totalTime").text("00:00:00");
        },
        start: function () {
            if (!clockRunning) {
                intervalId = setInterval(timer.count, 1000);
                clockRunning = true;
            }
        },
        stop: function () {
            if (clockRunning) {
                clearInterval(intervalId);
                clockRunning = false;
            }
        },
        count: function () {
            timer.time++;

            let converted = timer.timeConverter(timer.time);

            $("#totalTime").text(converted);
        },
        timeConverter: function (t) {
            let hours = Math.floor(t / 3600);
            t = t % 3600;

            let minutes = Math.floor(t / 60);
            t = t % 60;

            let seconds = Math.floor(t);

            if (seconds < 10) {
                seconds = "0" + seconds;
            }

            if (minutes === 0) {
                minutes = "00";
            } else if (minutes < 10) {
                minutes = "0" + minutes;
            }

            if (hours === 0) {
                hours = "00";
            } else if (hours < 10) {
                hours = "0" + hours;
            }

            return hours + ":" + minutes + ":" + seconds;
        }
    };

    /* setup hover effects on options */
    let optionsGroupHover = $(".ans-option-hover");
    $(".ans-option-hover").hover(function () {
        $(this).css({
            "border": "3px solid rgb(256,256,256)"
        });
    }, function () {
        $(this).css({
            "border": "1px solid rgb(200, 200, 200)"
        });
    });

    /* Game vars */
    let optionsGroup = $(".ans-option");
    let correctCount;
    let incorrectCount;
    let unansweredCount;
    let currentQuestionNum;
    let totalQuestionNum;
    let currentQuestion;
    let currentAnswer;
    let currentAnswerIndx;
    let userAnswerIndx;
    let currentAnswerChoiceBox;
    let userAnswerChoiceBox;

    /* Reset game function */
    function resetGame() {
        qaList = shuffleQAArrList(qaList);

        correctCount = 0;
        incrementCorrectCount(correctCount);
        incorrectCount = 0;
        incrementincorrectCount(incorrectCount);
        unansweredCount = 0;
        incrementUnansweredCount(unansweredCount);
        currentQuestionNum = -1;
        incrementCurrentQuestion(1);
        totalQuestionNum = 0;
        totalQuestionCount();

        resetAnswerChoicesCSS();
        resetProgressBar();
        timer.reset();
    }

    /* Game init fx */
    function startGame() {
        resetGame();
        getNextQuestion(currentQuestionNum);
        getAnswer(currentQuestionNum);
        getAnswerChoices(currentQuestionNum);
        timer.start();
        startCountdown();
    }

    /* var handlers */
    function incrementCorrectCount(count) {
        correctCount += count;
        $("#totalCorrect").html(correctCount);
    }

    function incrementincorrectCount(count) {
        incorrectCount += count;
        $("#totalIncorrect").html(incorrectCount);
    }

    function incrementUnansweredCount(count) {
        unansweredCount += count;
        $("#totalUnanswered").html(unansweredCount);
    }

    function incrementCurrentQuestion(count) {
        currentQuestionNum += count;
        $("#currentQuestionNum").html(correctCount + incorrectCount + unansweredCount + 1);
    }

    function totalQuestionCount() {
        totalQuestionNum = qaList.length;
        $("#totalQuestionNum").html(totalQuestionNum);
    }

    function getNextQuestion(currentQuestionNum) {
        currentQuestion = qaList[currentQuestionNum].question;
        $("#question").html(currentQuestion);
    }

    function getAnswer(currentQuestionNum) {
        currentAnswer = qaList[currentQuestionNum].answer;
        qaList[currentQuestionNum].choices = shuffleQAArrList(qaList[currentQuestionNum].choices);
        currentAnswerIndx = qaList[currentQuestionNum].choices.indexOf(currentAnswer);
    }

    function getAnswerChoices(currentQuestionNum) {
        $("#opt-one").html(qaList[currentQuestionNum].choices[0]);
        $("#opt-two").html(qaList[currentQuestionNum].choices[1]);
        $("#opt-three").html(qaList[currentQuestionNum].choices[2]);
        $("#opt-four").html(qaList[currentQuestionNum].choices[3]);
    }

    function resetAnswerChoicesCSS() {
        optionsGroup.removeClass("bg-danger")
            .removeClass("bg-success")
            .addClass("bg-dark");

        optionsGroup.on("click", clickFX);
    }

    /* onclick fx for options */
    let clickFX = function (e) {
        e.stopPropagation();
        optionsGroup.off('click');
        userAnswerChoiceBox = $(this)
        userAnswerIndx = userAnswerChoiceBox.attr("data-indx");

        if (currentAnswerIndx == userAnswerIndx) {
            incrementCorrectCount(1);
            userAnswerChoiceBox.removeClass("bg-dark")
                .addClass("bg-success ");
        } else {
            incrementincorrectCount(1);
            userAnswerChoiceBox.removeClass("bg-dark")
                .addClass("bg-danger");

            currentAnswerChoiceBox = $("[data-indx=" + currentAnswerIndx + "]")
                .removeClass("bg-dark")
                .addClass("bg-success");
        }

        setTimeout(nextRound, 1000);
    }

    /* Next round validation > progress fx */
    function nextRound() {
        if ((correctCount + incorrectCount + unansweredCount) < totalQuestionNum) {
            incrementCurrentQuestion(1);

            resetAnswerChoicesCSS();
            resetProgressBar();
            getNextQuestion(currentQuestionNum);
            getAnswer(currentQuestionNum);
            getAnswerChoices(currentQuestionNum);
            startCountdown();
        } else {
            timer.stop();
            clearInterval(counterIntervalId);
            toggleButton.attr("data-click-state", 0)
                .text("Start")
                .removeClass("btn-outline-danger")
                .addClass("btn-outline-success");
            cardContent.slideToggle("slow");
        }
    }
});