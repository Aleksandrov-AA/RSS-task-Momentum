

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


// 3. Слайдер изображений

let randomNum;
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

function getRandomNum() {
    randomNum = Math.round(Math.random() * (21 - 1) + 1);
}
getRandomNum(); // это скорее лишнее - нужно найти решение 

function getSlideNext() {
    if (randomNum === 20) {
        randomNum = 1;
    } else {
        randomNum += 1;
    }
    setBg();
}
slideNext.addEventListener('click', getSlideNext);

function getSlidePrev() {
    if (randomNum === 1) {
        randomNum = 20;
    } else {
        randomNum -= 1;
    }
    setBg();
}
slidePrev.addEventListener('click', getSlidePrev);

function setBg() {
    const timeOfDay = getTimeOfDay();
    let bgNum = randomNum;
    bgNum = String(bgNum).padStart(2, '0');
    const body = document.querySelector('body');
    

    body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg')`;
    
    // console.log(bgNum);
}
setBg(); // если убрать эту строчку, то стаптовать будет всегда с одного изображения

// нужно добавить плавную загрузку, но пока не ясно что за код нцжно вставить в 
// function setBg() {  
//     const img = new Image();
//     img.src = // здесь ваш код 
//     img.onload = () => {      
//       body.style.backgroundImage = // здесь тоже ваш код
//     }; 
//   }

// РАЗОБРАТЬСЯ 
// https://github.com/rolling-scopes-school/tasks/blob/master/tasks/momentum/momentum-slider.md


// 4 Виджет погоды

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const city = document.querySelector('.city');
city.value = 'Moscow'; // по умолчанию покапоставил Москву, чтоб не было ошибок в консоли, потом удалить

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=en&appid=14f1061edcbf91ddf2f8948a4263ba58&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDescription.textContent = data.weather[0].description;

    // console.log(data.weather[0].id, data.weather[0].description, data.main.temp);
}
getWeather()

city.addEventListener('change', getWeather);

// Можно добавить Скорость ветра, влажность как на Демо, но это потом Фиксами добавлять


// 5 Виджет "цитата дня"

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
// пока напишу для теста
quote.textContent = "Пишите код так, как будто сопровождать его будет склонный к насилию психопат, который знает, где вы живете";
author.textContent = "Стив Макконнелл";

// async function getQuotes() {
//     const quotes = 'js/data.json';
//     const res = await fetch(quotes);
//     const data = await res.json();
//     console.log(data);
// }
// getQuotes();