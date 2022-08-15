

// 1. Часы и календарь

function showTime() {
    const time = document.querySelector('.time');
    const date = new Date();
    const currentTime = date.toLocaleTimeString();

    time.textContent = currentTime;
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);    
}

showTime();

function showDate() {
    const dateText = document.querySelector('.date');
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};    
    const currentDate = date.toLocaleDateString('en-US', options);

    // const options = {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC'};
    // подробнее про формат отображения по ссылке ниже
    // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString

    dateText.textContent = currentDate;    
}

showDate();


// 2. Приветствие

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    
    if (hours >= 0 && hours <= 3) {
        return 'night';
    } else if (hours >= 4 && hours <= 11) {
        return 'morning';
    } else if (hours >= 12 && hours <= 16) {
        return 'afternoon';
    } else if (hours >= 17 && hours <= 23) {
        return 'evening'
    }
    // стандартная разбивка по 6 часов, но не совсем логичная по времени суток:
    // if (hours >= 0 && hours < 6) {
    //     return 'night';
    // } else if (hours >= 6 && hours < 12) {
    //     return 'morning';
    // } else if (hours >= 12 && hours < 18) {
    //     return 'day';
    // } else if (hours >= 18 && hours < 24) {
    //     return 'evening'
    // }
}

function showGreeting() {
    const timeOfDay = getTimeOfDay();
    const greetingText = `Good ${timeOfDay}`;
    const greeting = document.querySelector('.greeting');

    greeting.textContent = greetingText;
}

// const name5 = name.value;
// console.log(name5);

// Пока не сохраняется значение имени, не могу понять почему. Надо починить позже!

function setLocalStorage() {
    localStorage.setItem('name', name.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        name.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage)


// 3. Приветствие