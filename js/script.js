

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
    const currentDate = date.toLocaleDateString(langDate, options);

    // const options = {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC'};
    // подробнее про формат отображения по ссылке ниже
    // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString

    dateText.textContent = currentDate;    
}

showDate();


// 2. Приветствие
var imgDay = '';

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
        
    if (hours >= 0 && hours <= 5) {
        imgDay = 'night';
        if (lang === 'en') {            
            return 'Good night';
        } else if (lang === 'ru') {
            return 'Доброй ночи';
        }        
    } else if (hours >= 6 && hours <= 11) {
        imgDay = 'morning';
        if (lang === 'en') {
            return 'Good morning';
        } else if (lang === 'ru') {
            return 'Доброе утро';
        }        
    } else if (hours >= 12 && hours <= 17) {
        imgDay = 'afternoon';
        if (lang === 'en') {
            return 'Good afternoon';
        } else if (lang === 'ru') {
            return 'Добрый день';
        }        
    } else if (hours >= 18 && hours <= 23) {
        imgDay = 'evening';
        if (lang === 'en') {
            return 'Good evening'
        } else if (lang === 'ru') {
            return 'Добрый вечер';
        }        
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
    const greetingText = `${timeOfDay}`;
    const greeting = document.querySelector('.greeting');

    greeting.textContent = greetingText;
}

const nameGr = document.querySelector('.nameGr');

function setLocalStorage() {
    localStorage.setItem('name', nameGr.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        nameGr.value = localStorage.getItem('name');
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
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${imgDay}/${bgNum}.jpg`;
    img.onload = () => {
        body.style.backgroundImage = `url('https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${imgDay}/${bgNum}.jpg')`;
    };    
}
setBg(); // если убрать эту строчку, то стаптовать будет всегда с одного изображения


// 4 Виджет погоды

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');
const city = document.querySelector('.city');
city.value = 'Minsk'; // по умолчанию покапоставил Москву, чтоб не было ошибок в консоли, потом удалить

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${langWeather}&appid=14f1061edcbf91ddf2f8948a4263ba58&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    let windText = '';
    let windTexts = '';
    let humifityText = '';
    if (lang === 'en') {
        windText = 'Wind speed';
        windTexts = 'm/s';
        humifityText = 'Humidity';
    } else if (lang === 'ru') {
        windText = 'Скорость ветра';
        windTexts = 'м/с';
        humifityText = 'Влажность';
    }

    if (data.cod === '404' || data.cod === '400') { // добавил сообщение об ошибке, но пришлось продублировать весь код ниже, чтоб обнулить значения, скорее всего есть более красивые методы.
        weatherError.textContent = `Error: "${city.value}" - ${data.message}`;
        weatherIcon.className = 'weather-icon owf';
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
    } else {
        weatherError.textContent = '';
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = data.weather[0].description;
        wind.textContent = `${windText}: ${Math.round(data.wind.speed)} ${windTexts}`;
        humidity.textContent = `${humifityText}: ${data.main.humidity}%`;
    }  
}
getWeather()

city.addEventListener('change', getWeather);

function setLocalStorageCity() {
    localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorageCity);

function getLocalStorageCity() {
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }
}
window.addEventListener('load', getLocalStorageCity);

// Можно добавить Скорость ветра, влажность как на Демо, но это потом Фиксами добавлять


// 5 Виджет "цитата дня"

const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
// пока напишу для теста
// quote.textContent = "Пишите код так, как будто сопровождать его будет склонный к насилию психопат, который знает, где вы живете";
// author.textContent = "Стив Макконнелл";

// async function getQuotes() {
//     const quotes = 'js/data.json';
//     const res = await fetch(quotes);
//     const data = await res.json();
//     console.log(data);
// }
// getQuotes();

// временное решение просто перебор из массива

var quoteText = [
    {
      "text": "Пишите код так, как будто сопровождать его будет склонный к насилию психопат, который знает, где вы живете",
      "author": "Стив Макконнелл"
    },
    {
      "text": "Сложность программы растет до тех пор, пока не превысит способности программиста",
      "author": "Артур Блох. Законы Мэрфи"
    },
      {
      "text": "Ходить по воде и разрабатывать программы, следуя ТЗ, очень просто… если они заморожены",
      "author": "И. Берард"
    }
  ];
var q = 0;
quote.textContent = quoteText[q].text;
author.textContent = quoteText[q].author;

const quoteNext = document.querySelector('.change-quote');
function getQuoteNext() {
    if (q === 2) {
        q = 0;
    } else {
        q += 1;
    }
    quote.textContent = quoteText[q].text;
    author.textContent = quoteText[q].author;    
}
quoteNext.addEventListener('click', getQuoteNext);

// потом переписать решение на нормальное функционирование из асинхронного запроса


// 6 Аудиоплеер

// import playList from './playList.js'; если будем добавлять отдельным листом плей лист
// console.log(playList);

const playList = [
    {      
        title: 'Aqua Caelestis',
        src: './assets/sounds/Aqua Caelestis.mp3',
        duration: '00:39'
    },  
    {      
        title: 'River Flows In You',
        src: './assets/sounds/River Flows In You.mp3',
        duration: '01:37'
    },
    {      
        title: 'Summer Wind',
        src: './assets/sounds/Summer Wind.mp3',
        duration: '01:50'
    },  
    {      
        title: 'Ennio Morricone',
        src: './assets/sounds/Ennio Morricone.mp3',
        duration: '01:37'
    }
]

let playNum = 0;

let isPlay = false;
const buttonPlay = document.querySelector('.play');
const audio = new Audio();

function playAudio(mus) {
    // function toggleBtn() {
    //     buttonPlay.classList.toggle('pause');
    // }
    // toggleBtn(); // перекинул пока сюда, чтобы тогл работал и при кнопках переключения, хотя можно было просто два вызова сделать.
    
    if (!isPlay || mus === 1) {
        isPlay = true;
        audio.src = playList[playNum].src;
        audio.currentTime = 0; // производит всегда с начала трек
        audio.play();

        if (playListContainer[playNum].textContent === playList[playNum].title) {
            playListContainer[playNum].classList.add('item-active');
        } else {
            playListContainer[playNum].classList.remove('item-active');
        }
    } else {
        isPlay = false;        
        audio.pause();
    }    
}
buttonPlay.addEventListener('click', playAudio);

function toggleBtn() {
    buttonPlay.classList.toggle('pause');
}
buttonPlay.addEventListener('click', toggleBtn);


// let playNum = 0;
const playNext = document.querySelector('.play-next');
const playPrev = document.querySelector('.play-prev');

function getPlayNext() {
    if (!isPlay) {
        toggleBtn();
    }

    if (playNum === 3) {
        playNum = 0;
    } else {
        playNum += 1;
    }
    playAudio(1);
}
playNext.addEventListener('click', getPlayNext);

function getPlayPrev() {
    if (!isPlay) {
        toggleBtn();
    }
    
    if (playNum === 0) {
        playNum = 3;
    } else {
        playNum -= 1;
    }
    playAudio(1);

    // li[playNum].classList.add('item-active');  Надо добавить этот класс текущему треку в списке
    // if (li.textContent === playList[playNum].title) {
    //     li.classList.add('item-active');
    // }
}
playPrev.addEventListener('click', getPlayPrev);

// добавляю треки на страницу через перебор массива ПлейЛиста

const playListContainer = document.querySelector('.play-list');

for(let i = 0; i < playList.length; i++) {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = playList[i].title;
    playListContainer.append(li);
}


// 8. Перевод приложения на два языка (en/ru)
const English = document.querySelector('.english');
const Russian = document.querySelector('.russian');

var langDate = 'en-US';
var lang = 'en';
var langWeather = 'en';


//en-US
function getEnglish() {
    langDate = 'en-US';
    lang = 'en';
    langWeather = 'en';

    getWeather();
    showDate();
    getTimeOfDay();

}
English.addEventListener('click', getEnglish);

function getRussian() {
    langDate = 'ru-RU';
    lang = 'ru';
    langWeather = 'ru';

    getWeather();
    showDate();
    getTimeOfDay();

}
Russian.addEventListener('click', getRussian);