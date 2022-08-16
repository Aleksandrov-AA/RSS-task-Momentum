

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
getTimeOfDay(); // запускаю только для того, чтобы первое изображение не выдавало ошибку

function showGreeting() {
    const timeOfDay = getTimeOfDay();
    const greetingText = `${timeOfDay}`;
    const greeting = document.querySelector('.greeting');

    greeting.textContent = greetingText;
}

const nameGr = document.querySelector('.nameGr');
document.querySelector('.nameGr').placeholder = '[Enter your Name]';

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


// async function getQuotes() { //выдает ошибку блокировки, мол Хром блокирует этот асинхронный запрос
//     const quotes = 'js/data.json';
//     const res = await fetch(quotes);
//     const data5 = await res.json();
//     console.log(data5);
// }
// getQuotes();

// временное решение просто перебор из массива

var quoteRu = [
    {
      "text": "Что разум человека может постигнуть и во что он может поверить, того он способен достичь",
      "author": "Наполеон Хилл, журналист и писатель"
    },
    {
      "text": "Стремитесь не к успеху, а к ценностям, которые он дает​",
      "author": "Альберт Эйнштейн"
    },
    {
      "text": "Своим успехом я обязана тому, что никогда не оправдывалась и не принимала оправданий от других",
      "author": "Флоренс Найтингейл"
    },
    {
      "text": "За свою карьеру я пропустил более 9000 бросков, проиграл почти 300 игр",
      "author": "Майкл Джордан"
    },
    {
      "text": "Сложнее всего начать действовать, все остальное зависит только от упорства",
      "author": "Амелия Эрхарт"
    },
    {
      "text": "Надо любить жизнь больше, чем смысл жизни",
      "author": "Федор Достоевский"
    },
    {
      "text": "Жизнь - это то, что с тобой происходит, пока ты строишь планы",
      "author": "Джон Леннон"
    },
    {
      "text": "Логика может привести Вас от пункта А к пункту Б, а воображение — куда угодно",
      "author": "Альберт Эйнштейн"
    },
    {
      "text": "Через 20 лет вы будете больше разочарованы теми вещами, которые вы не делали, чем теми, которые вы сделали",
      "author": "Марк Твен"
    },
    {
      "text": "Начинать всегда стоит с того, что сеет сомнения",
      "author": "Борис Стругацкий"
    },
    {
      "text": "Настоящая ответственность бывает только личной",
      "author": "Фазиль Искандер"
    },
    {
      "text": "Неосмысленная жизнь не стоит того, чтобы жить",
      "author": "Сократ"
    },
    {
      "text": "80% успеха - это появиться в нужном месте в нужное время",
      "author": "Вуди Аллен"
    },
    {
      "text": "Ваше время ограничено, не тратьте его, живя чужой жизнью",
      "author": "Стив Джобс"
    },
    {
      "text": "Победа - это еще не все, все - это постоянное желание побеждать",
      "author": "Винс Ломбарди, тренер по американскому футболу"
    },
    {
      "text": "Наука — это организованные знания, мудрость — это организованная жизнь",
      "author": "Иммануил Кант"
    },
    {
      "text": "В моем словаре нет слова «невозможно»",
      "author": "Наполеон Бонапарт"
    },
    {
      "text": "Вы никогда не пересечете океан, если не наберетесь мужества потерять берег из виду",
      "author": "Христофор Колумб"
    },
    {
      "text": "Свобода ничего не стоит, если она не включает в себя свободу ошибаться",
      "author": "Махатма Ганди"
    },
    {
      "text": "Либо вы управляете вашим днем, либо день управляет вами",
      "author": "Джим Рон, оратор и бизнес-тренер"
    },
    {
      "text": "Если вы думаете, что на что-то способны, вы правы; если думаете, что у вас ничего не получится - вы тоже правы",
      "author": "Генри Форд"
    },
    {
      "text": "Два самых важных дня в твоей жизни: день, когда ты появился на свет, и день, когда понял, зачем",
      "author": "Марк Твен"
    },
    {
      "text": "Начинайте делать все, что вы можете сделать – и даже то, о чем можете хотя бы мечтать",
      "author": "Иоганн Вольфганг Гете"
    },
    {
      "text": "Лучшая месть – огромный успех",
      "author": "Фрэнк Синатра"
    },
    {
      "text": "Зачастую говорят, что мотивации хватает ненадолго",
      "author": "Зиг Зиглар, писатель, бизнесмен и консультант по маркетингу"
    },
    {
      "text": "Слабые люди всю жизнь стараются быть не хуже других",
      "author": "Борис Акунин"
    },
    {
      "text": "Все дело в мыслях",
      "author": "Лев Толстой"
    },
    {
      "text": "Есть только один способ избежать критики: ничего не делайте, ничего не говорите и будьте никем",
      "author": "Аристотель"
    },
    {
      "text": "Человек, которым вам суждено стать – это только тот человек, которым вы сами решите стать",
      "author": "Ральф Уолдо Эмерсон, эссеист, поэт и философ"
    },
    {
      "text": "Идите уверенно по направлению к мечте",
      "author": "Генри Дэвид Торо, писатель, мыслитель, натуралист"
    },
    {
      "text": "Надеюсь, что в конце своих дней, когда я предстану перед Богом, у меня не останется ни капли таланта, чтобы я могла сказать ему: “Я использовала все, что ты дал мне”",
      "author": "Эрма Бомбек, писатель, журналист"
    },
    {
      "text": "Лучше быть уверенным в хорошем результате, чем надеяться на отличный",
      "author": "Уоррен Баффет"
    },
    {
      "text": "Некоторые вещи могут завладеть вашим вниманием, но сосредоточьтесь лучше на тех, что завладевают вашим сердцем",
      "author": "Индийская поговорка"
    },
    {
      "text": "Стоит только поверить, что вы можете – и вы уже на полпути к цели",
      "author": "Теодор Рузвельт"
    },
    {
      "text": "Не стоит винить ребенка за то, что он боится темноты",
      "author": "Платон"
    },
    {
      "text": "Научитесь говорить “Я не знаю”, и это уже будет прогресс",
      "author": "Моисей Маймонид, еврейский философ и богослов"
    },
    {
      "text": "Начните оттуда, где вы сейчас находитесь",
      "author": "Артур Эш, теннисист"
    },
    {
      "text": "Когда мне было 5 лет, мама всегда говорила, что главное в жизни – счастье",
      "author": "Джон Леннон"
    },
    {
      "text": "Упади семь раз и восемь раз поднимись",
      "author": "Японская поговорка"
    },
    {
      "text": "Когда закрывается одна дверь к счастью, тут же открывается другая",
      "author": "Элен Келлер, писательница, лектор, политическая активистка"
    },
    {
      "text": "У всего есть своя красота, но не каждый может ее увидеть",
      "author": "Конфуций"
    },
    {
      "text": "Как прекрасно, что не нужно ждать ни минуты, чтобы начать делать мир лучше",
      "author": "Анна Франк"
    },
    {
      "text": "Когда я освобождаюсь от того, кто я есть, я становлюсь тем, кем я могу быть",
      "author": "Лао Цзы"
    },
    {
      "text": "Счастье – это не нечто готовое",
      "author": "Далай Лама"
    },
    {
      "text": "Если вам предлагают место в ракетоносителе, не спрашивайте, что за место! Просто займите его",
      "author": "Шерил Сэндберг, операционный директор Facebook"
    },
    {
      "text": "Сначала определитесь со своим идеалом: поставьте цель",
      "author": "Аристотель"
    },
    {
      "text": "Если нет ветра, беритесь за вёсла",
      "author": "Латинская поговорка"
    },
    {
      "text": "Всегда опирайтесь на мысль о том, что ваше собственное решение добиться успеха намного важнее всего другого",
      "author": "Авраам Линкольн"
    },
    {
      "text": "Успех — это способность идти от поражения к поражению, не теряя оптимизма",
      "author": "Уинстон Черчилль"
    },
    {
      "text": "Они спрашивают: «Как ты можешь управиться со всеми делами за пятнадцать минут?» Я отвечаю: «Это просто",
      "author": "Ричард Брэнсон, британский предприниматель, основатель корпорации Virgin"
    },
    {
      "text": "Каждый хочет изменить человечество, но никто не задумывается о том, как изменить себя",
      "author": "Лев Толстой"
    },
    {
      "text": "Важно верить, что талант нам даётся не просто так – и что любой ценой его нужно для чего-то использовать",
      "author": "Мари Кюри"
    },
    {
      "text": "Если внутренний голос говорит вам, что вы не можете рисовать – рисуйте как можно больше, тогда этот голос затихнет",
      "author": "Винсент Ван Гог"
    },
    {
      "text": "Определенность цели - отправная точка всех достижений",
      "author": "Уильям Клемент Стоун, писатель и бизнесмен"
    },
    {
      "text": "Мы становимся тем, о чем мы думаем",
      "author": "Эрл Найтингейл, радиоведущий"
    },
    {
      "text": "Я не жертва обстоятельств, я - результат моих решений",
      "author": "Стивен Кови, консультант и преподаватель по организационному управлению"
    },
    {
      "text": "Лучшее время, чтобы посадить дерево, было 20 лет назад",
      "author": "Китайская пословица"
    },
    {
      "text": "Все дети - художники",
      "author": "Пабло Пикассо"
    },
    {
      "text": "Я был поражен тем, как важно предпринимать действия",
      "author": "Леонардо да Винчи"
    },
    {
      "text": "Что такое деньги? Человек успешен, если утром он просыпается, вечером возвращается в постель, а в перерыве делает то, что ему нравится",
      "author": "Боб Дилан"
    },
    {
      "text": "Я не провалил тест",
      "author": "Бенджамин Франклин"
    },
    {
      "text": "Поражение – не поражение, если только вы не признаете его таковым в своем сознании",
      "author": "Брюс Ли"
    },
    {
      "text": "Неудача – это просто возможность начать снова, но уже более мудро",
      "author": "Генри Форд"
    },
    {
      "text": "Я уверен: нельзя позволять, чтобы тебя остановило убогое словцо «нельзя»",
      "author": "Ричард Брэнсон"
    },
    {
      "text": "Никогда не делает ошибок только тот, кто не пробует ничего нового",
      "author": "Альберт Эйнштейн"
    },
    {
      "text": "Ты становишься тем, во что веришь",
      "author": "Опра Уинфри, телеведущая"
    },
    {
      "text": "Счастье не в том, чтобы делать всегда, что хочешь, а в том, чтобы всегда хотеть того, что делаешь",
      "author": "Лев Толстой"
    },
    {
      "text": "Я лучше умру от страсти, чем от скуки",
      "author": "Винсент ван Гог"
    },
    {
      "text": "Быстрее всего учишься в трех случаях — до 7 лет, на тренингах, и когда жизнь загнала тебя в угол",
      "author": "Стивен Кови"
    },
    {
      "text": "Люди забудут, что ты говорил, забудут, что ты делал, но никогда не забудут, что ты заставил их почувствовать",
      "author": "Майя Энджелоу, писательница и поэтесса"
    },
    {
      "text": "Наше сознание - это все",
      "author": "Будда"
    },
    {
      "text": "Если ты хочешь построить корабль, не надо созывать людей, планировать, делить работу, доставать инструменты",
      "author": "Антуан де Сент-Экзюпери"
    },
    {
      "text": "Никогда не думайте, что вы уже все знаете",
      "author": "Иван Павлов, ученый-физиолог"
    },
    {
      "text": "Не столь важно, как медленно ты идешь, как то, как долго ты идешь, не останавливаясь",
      "author": "Конфуций"
    },
    {
      "text": "Если вы думаете о том, что имеете в жизни, вы всегда сможете иметь больше",
      "author": "Опра Уинфри"
    },
    {
      "text": "Как можно быстрее превращайте ваши масштабные мысли в масштабные действия",
      "author": "Дональд Трамп"
    },
    {
      "text": "Чтобы вести людей за собой, иди за ними",
      "author": "Лао Цзы"
    },
    {
      "text": "Запомните, что не достичь успеха – иногда тоже большая удача",
      "author": "Далай Лама"
    },
    {
      "text": "Всегда выбирайте самый трудный путь - на нем вы не встретите конкурентов",
      "author": "Шарль де Голль"
    },
    {
      "text": "Одна законченная результативная задача стоит полусотни полузаконченных задач",
      "author": "Малкольм Форбс"
    },
    {
      "text": "Наша жизнь начинает подходить к концу, когда мы перестаём говорить о действительно важных вещах",
      "author": "Мартин Лютер Кинг-младший"
    },
    {
      "text": "Беда не приходит одна, но и удача тоже",
      "author": "Ромен Роллан, писатель"
    },
    {
      "text": "Всякая мысль подобна тесту, стоит помять ее хорошенько — все из нее сделаешь",
      "author": "Иван Тургенев"
    },
    {
      "text": "Делай все, что можешь, там, где ты находишься, используя все, что имеешь",
      "author": "Теодор Рузвельт"
    },
    {
      "text": "Запомните, никто не может заставить вас чувствовать себя неполноценным без вашего на то согласия",
      "author": "Элеонор Рузвельт"
    },
    {
      "text": "Мир делится на два класса — одни веруют в невероятное, другие совершают невозможное",
      "author": "Оскар Уайлд"
    },
    {
      "text": "Единственное счастье в жизни — это постоянное стремление вперед",
      "author": "Эмиль Золя"
    },
    {
      "text": "Выживает не самый сильный, а самый восприимчивый к переменам",
      "author": "Чарльз Дарвин"
    },
    {
      "text": "Ты можешь сказать, что у тебя плохая генетика, плохой обмен веществ, а можешь просто поднять свою задницу с дивана и начать работать над собой, задаться целью и верить в себя",
      "author": "Арнольд Шварцнеггер"
    },
    {
      "text": "Ни разу не упасть — не самая большая заслуга в жизни",
      "author": "Нельсон Мандела"
    },
    {
      "text": "Вопрос не в том, кто мне разрешит, а в том, кто сможет мне запретить",
      "author": "Айн Рэнд"
    },
    {
      "text": "Когда кажется, что весь мир настроен против вас, вспомните, что самолет взлетает не по ветру, а против него",
      "author": "Генри Форд"
    },
    {
      "text": "Жизнь меряется не тем, сколько в ней лет, а тем, сколько в этих годах настоящей жизни",
      "author": "Авраам Линкольн"
    },
    {
      "text": "Приносить пользу миру — это единственный способ стать счастливым",
      "author": "Ханс Кристиан Андерсен"
    },
    {
      "text": "Либо напиши что-нибудь стоящее, либо делай что-нибудь, о чем стоит написать",
      "author": "Бенджамин Франклин"
    },
    {
      "text": "Единственный способ сделать что-то очень хорошо – любить то, что ты делаешь",
      "author": "Стив Джобс"
    },
    {
      "text": "Мудрый человек требует всего только от себя, ничтожный же человек требует всего от других",
      "author": "Лев Толстой"
    },
    {
      "text": "Велики те, кто видит, что миром правят мысли",
      "author": "Ральф Эмерсон"
    },
    {
      "text": "Перед тем как карабкаться на лестницу успеха, убедитесь, что она прислонена к стене того здания, что вам нужно",
      "author": "Стивен Кови"
    },
    {
      "text": "У истоков каждого успешного предприятия стоит однажды принятое смелое решение",
      "author": "Питер Друкер, американский экономист"
    }
];
var quoteEn = [
    {
        "text": "Success does not consist in never making mistakes but in never making the same one a second time",
        "author": "George Bernard Shaw"
    },
    {
        "text": "Choose a job you love, and you will never have to work a day in your life",
        "author": "Confucius"
    },
    {
        "text": "In the middle of difficulty lies opportunity",
        "author": "Albert Einstein"
    },
    {
        "text": "Great spirits have always encountered violent opposition from mediocre minds",
        "author": "Albert Einstein"
    },
    {
        "text": "And if you gaze long into an abyss, the abyss also gazes into you",
        "author": "Friedrich Nietzsche"
    },
    {
        "text": "Only two things we'll regret on deathbed – that we are a little loved and little traveled",
        "author": "Mark Twain"
    },
    {
        "text": "Beauty is in the eye of the beholder",
        "author": "Oscar Wilde"
    },
    {
        "text": "My mom always said life was like a box of chocolates. You never know what you're gonna get.",
        "author": "Forrest Gump"
    },
    {
        "text": "We buy things we don't need, to impress people we don't like.",
        "author": "Fight Club"
    },
    {
        "text": "And now here is my secret, a very simple secret: it is only with the heart that one can see rightly, what is essential is invisible to the eye.",
        "author": "The Little Prince"
    },
    {
        "text": "Elementary, my dear Watson!",
        "author": "Sherlock Holmes"
    },
    {
        "text": "To be, or not to be: that is the question.",
        "author": "Hamlet, Shakespeare"
    }
];

var quotes = quoteEn;

function getQuoteLang() {
    if (lang === 'en') {
        quotes = quoteEn;
    } else if (lang === 'ru') {
        quotes = quoteRu;
    };
}

function randomQuote() {
    getQuoteLang();
    let random = Math.floor(Math.random() * quotes.length);    
    quote.textContent = quotes[random].text;
    author.textContent = quotes[random].author;
}
randomQuote();

const quoteNext = document.querySelector('.change-quote');

quoteNext.addEventListener('click', randomQuote);

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

        // if (playListContainer[playNum].textContent === playList[playNum].title) {
        //     playListContainer[playNum].classList.add('item-active');
        // } else {
        //     playListContainer[playNum].classList.remove('item-active');
        // }
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

    document.querySelector('.nameGr').placeholder = '[Enter your Name]';

    getWeather();
    showDate();
    getTimeOfDay();
    randomQuote();

}
English.addEventListener('click', getEnglish);

function getRussian() {
    langDate = 'ru-RU';
    lang = 'ru';
    langWeather = 'ru';

    document.querySelector('.nameGr').placeholder = '[Введи своё Имя]';

    getWeather();
    showDate();
    getTimeOfDay();
    randomQuote();

}
Russian.addEventListener('click', getRussian);