# DiyorAI — Low-Budget Tours & Trip Planner Update

## Роль

Ты — Coding Agent, работающий над существующим веб-приложением **DiyorAI**, AI Travel Assistant для путешествий по Узбекистану.

Твоя задача — внедрить новую концепцию **Low-Budget / Smart Local Tours**, одновременно переработав структуру главной страницы и Trip Planner.

**Важно:** это именно задача на реализацию в существующем проекте. Не переписывай приложение с нуля и не создавай отдельный дизайн, если нужные компоненты уже существуют.

Перед изменениями изучи текущую архитектуру, существующие компоненты, routes, state management и design system. Переиспользуй существующий код там, где это возможно.

---

# 1. ГЛАВНАЯ ПРОДУКТОВАЯ ЛОГИКА

DiyorAI должен разделять три разных пользовательских сценария:

### A. Готовые маршруты
Пользователь хочет выбрать уже подготовленный маршрут.

### B. Low-Budget / Smart Local Tours
Пользователь хочет найти доступные локальные поездки и впечатления, особенно вокруг Ташкента и Ташкентской области.

### C. Конструктор путешествия
Пользователь хочет самостоятельно задать параметры поездки и получить персональный маршрут.

Эти три сценария **не должны визуально смешиваться**.

Главный принцип:

```text
READY-MADE ROUTES
        +
SMART / LOW-BUDGET TOURS
        +
TRIP CONSTRUCTOR
```

---

# 2. РАЗДЕЛИТЬ ГОТОВЫЕ МАРШРУТЫ, LOW-BUDGET И КОНСТРУКТОР

На главной странице создать отдельные блоки.

## Блок 1 — Готовые маршруты

Название:

**Готовые маршруты**

или более привлекательный существующий вариант в стиле DiyorAI.

Смысл:

Пользователь выбирает заранее подготовленный маршрут без необходимости создавать его с нуля.

Примеры:

- Ташкент → Самарканд → Бухара
- Самарканд на 2 дня
- Бухара Weekend
- Хива исторический маршрут
- Ташкент + горы

Карточка должна содержать:

- изображение;
- название;
- длительность;
- направление;
- примерный бюджет;
- тип поездки;
- основные highlights;
- кнопку просмотра маршрута.

CTA:

**Посмотреть маршрут**

или:

**Выбрать маршрут**

---

# 3. LOW-BUDGET / SMART LOCAL TOURS

Создать отдельный самостоятельный блок.

Он НЕ должен быть частью блока конструктора.

Название можно использовать:

**💰 Smart Trips**

или:

**🇺🇿 Local Experiences**

или:

**💚 Low-Budget Tours**

Выбери вариант, который лучше соответствует существующему дизайну DiyorAI.

Главная идея:

Не позиционировать их как "дешёвые туры для людей с маленьким бюджетом".

Позиционирование:

> **Discover more for less.**

или:

> **Smart way to experience more.**

Пользователь должен воспринимать это как возможность получить больше впечатлений за разумный бюджет.

---

# 4. LOW-BUDGET TOURS — ТАШКЕНТ И ТАШКЕНТСКАЯ ОБЛАСТЬ

Добавить в demo data реальные по типу направления локальные experiences:

- Чарвак
- Чимган
- Амирсой
- Бельдерсай
- Угам-Чаткал
- Чарвак + локальная еда
- Mountain Day Trip
- Mountain Sunrise
- Mountain Photo Experience

Можно использовать realistic mock prices для демонстрации.

Если цена является mock data, явно хранить:

```js
isMock: true
```

Не выдавать mock prices за актуальные рыночные цены.

---

# 5. SMART TRIP CARD

Создать reusable component:

`SmartTripCard`

Структура:

```text
[IMAGE]

🏔 Charvak Escape

$35 / person

📅 1 day
📍 Tashkent Region

🏔 Nature
🏃 Active

🎯 96% Match

[View Details]
[+ Add to Trip]
```

Показывать:

- название;
- фото;
- цену;
- длительность;
- регион;
- тип опыта;
- интересы;
- подходящий темп;
- Match Score, если он рассчитывается;
- CTA.

---

# 6. ИНТЕРАКТИВНОСТЬ LOW-BUDGET TOURS

Low-Budget Tours не должны быть просто каталогом карточек.

Они должны взаимодействовать с параметрами пользователя.

Учитывать:

- бюджет;
- количество взрослых;
- количество детей;
- количество человек;
- даты;
- количество дней;
- активные дни;
- destination;
- travel pace;
- interests.

Например:

```text
2 adults
3 days
Active
Nature
Budget: $200
```

DiyorAI должен предложить:

```text
💡 Smart options for your trip

🏔 Charvak — $35
🏔 Chimgan — $40
🎿 Amirsoy — $50
```

---

# 7. "WHAT CAN I DO FOR $X?"

Добавить интерактивный элемент внутри Low-Budget блока:

**💰 What can I do with my budget?**

Пользователь должен иметь возможность указать сумму и получить подходящие experiences.

Например:

```text
$30
$50
$100
$200
```

Но эти значения являются только быстрыми preset-вариантами.

Основным инструментом выбора бюджета теперь является **ползунок / range selector**, описанный ниже.

При изменении бюджета список доступных Smart Trips должен обновляться.

---

# 8. ADD TO TRIP

Каждый Smart Trip должен иметь:

**+ Add to Trip**

После нажатия:

```text
✓ Added to your trip
```

Система должна:

1. добавить experience в itinerary;
2. пересчитать стоимость;
3. пересчитать remaining budget;
4. проверить даты;
5. проверить длительность;
6. проверить размер группы;
7. обновить маршрут.

---

# 9. SMART BUDGET

Не использовать старые кнопки:

```text
<$200
<$500
<$1000
$1000+
```

Вместо них сделать **двойной ползунок бюджета**:

```text
Minimum budget       Maximum budget

$0 ●────────────────────● $5,000+
```

Пользователь самостоятельно задаёт:

- минимальный бюджет;
- максимальный бюджет.

Пример:

```text
Minimum: $100
Maximum: $400
```

или:

```text
Minimum: $300
Maximum: $1,500
```

или:

```text
Minimum: $1,000
Maximum: $10,000
```

---

# 10. БЮДЖЕТ $1000+

Не использовать жёсткий максимум `$1000`.

Пользователь должен иметь возможность выбирать значения выше $1000.

Предусмотреть достаточно большой диапазон для UI, например:

```text
$0 — $10,000+
```

или адаптивную шкалу.

При выборе верхнего значения:

```text
$10,000+
```

это должно означать:

```text
10,000 and above
```

а не жёсткий лимит.

Архитектура должна позволять в будущем изменить максимальный отображаемый диапазон без переписывания budget logic.

---

# 11. BUDGET RANGE LOGIC

Создать reusable component:

`BudgetRangeSlider`

Он должен возвращать:

```js
{
  minBudget,
  maxBudget
}
```

Не использовать только одну переменную `budget`.

Все рекомендации должны учитывать диапазон.

Например:

```text
minBudget = 100
maxBudget = 500
```

Smart Trips должны фильтроваться и ранжироваться в соответствии с выбранным диапазоном.

---

# 12. BUDGET + GROUP SIZE

Бюджет должен учитывать количество людей.

Например:

```text
$35 / adult

2 adults
2 children

Adult:
2 × $35 = $70

Children:
2 × $20 = $40

Total:
$110
```

Показывать пользователю:

```text
Group total: $110
```

Если child price отсутствует, использовать существующую pricing logic проекта.

---

# 13. BUDGET IMPACT

При добавлении Low-Budget Tour:

```text
Current trip:
$165

Experience:
$35

New total:
$200
```

Показывать:

```text
🟢 Within budget
```

Если:

```text
Current:
$180

Experience:
$40

Total:
$220
```

Показывать:

```text
🔴 $20 over selected budget
```

Не блокировать пользователя.

Предложить:

```text
[Keep]
[Find cheaper alternative]
```

---

# 14. CHEAPER ALTERNATIVES

Если выбранный experience не соответствует диапазону бюджета:

показать релевантные альтернативы.

Например:

```text
🎿 Amirsoy
$75

Your selected maximum:
$50
```

Предложить:

```text
💡 Similar options

🏔 Charvak
$35

🏔 Chimgan
$40
```

Альтернативы должны учитывать:

- location;
- interests;
- duration;
- pace;
- group size;
- budget.

Не предлагать просто самый дешёвый случайный вариант.

---

# 15. REMAINING BUDGET

После создания маршрута показать:

```text
💰 You have $65 left

Make the most of your budget:
```

И предложить:

```text
🏔 Charvak
$35

🍢 Local Food Experience
$25

🏛 Old Tashkent Walk
$15
```

Каждый вариант:

```text
[+ Add]
```

---

# 16. "SURPRISE ME"

Добавить интерактивную кнопку:

**🎲 Surprise me**

Система выбирает Smart Trip на основании:

- budget range;
- destination;
- interests;
- pace;
- duration;
- group size.

Пример:

```text
🎲 Your surprise

🏔 Charvak Hidden Spots

$38
1 day
Nature
Local Experience

Why we picked it:

✓ Fits your budget
✓ Matches your interests
✓ Suitable for your pace
✓ Near your destination

[Add to my trip]
```

---

# 17. SMART TRIPS + GUIDES

Smart Trip может быть связан с гидами.

Например:

```text
🏔 Charvak

Recommended guides:

Aziz Karimov
🎯 97% Match
🛡 94 Trust

Madina Akhmedova
🎯 91% Match
🛡 92 Trust
```

Показывать только гидов, которые реально доступны для данного experience.

---

# 18. ГОТОВЫЕ МАРШРУТЫ И LOW-BUDGET НЕ СМЕШИВАТЬ

Это критически важно.

На Homepage должны быть визуально отдельные секции:

```text
READY-MADE ROUTES

[Route] [Route] [Route]


SMART / LOW-BUDGET TOURS

[Tour] [Tour] [Tour]


TRIP CONSTRUCTOR

[Constructor]
```

Не делать один общий carousel.

Не помещать Low-Budget Tours внутрь Ready-Made Routes.

Не помещать Ready-Made Routes внутрь Constructor.

---

# 19. TRIP CONSTRUCTOR

Конструктор должен быть отдельным крупным блоком.

Он предназначен для пользователей, которые хотят создать персональную поездку.

Поля:

```text
WHO

Adults
Children


HOW MANY DAYS

Total trip days
Active travel days


FORMAT

Solo
Couple
Family
Friends
Group


TRAVEL PACE

Relaxed
Balanced
Active


DESTINATION

City / Region


BUDGET

Minimum
Maximum


INTERESTS
```

CTA:

**Build My Route**

---

# 20. TOP NAVIGATION — CONSTRUCTOR

В верхнее меню добавить ссылку:

**Конструктор**

или:

**Trip Constructor**

При нажатии пользователь должен перейти к блоку конструктора.

Основное поведение:

```text
Click "Конструктор"
        ↓
Homepage
        ↓
smooth scroll
        ↓
Constructor section
```

Использовать anchor:

```text
#trip-constructor
```

или существующий механизм проекта.

Если пользователь уже находится на Homepage — плавно прокрутить к блоку.

Если пользователь находится на другой странице — перейти на Homepage и затем прокрутить к Constructor.

---

# 21. NAVIGATION STRUCTURE

Верхнее меню должно иметь понятную структуру.

Например:

```text
Главная
Готовые маршруты
Smart Trips
Конструктор
Гиды
FAQ
```

Не перегружать меню.

Если некоторые пункты уже существуют, сохранить существующие названия и стиль, но добавить необходимую ссылку на Constructor.

---

# 22. УБРАТЬ БОЛЬШУЮ КНОПКУ "ЛОГИСТИКА И ПАМЯТКА ДЛЯ ТУРИСТА"

На главной странице удалить большую CTA-кнопку/hero block:

**Логистика и памятка для туриста**

Вместо неё использовать существующую концепцию:

**Всё для исследования Узбекистана**

Но НЕ делать её большой CTA-кнопкой.

Она должна стать обычным презентабельным блоком.

---

# 23. "ВСЁ ДЛЯ ИССЛЕДОВАНИЯ УЗБЕКИСТАНА"

Переработать этот блок в самостоятельный informational block.

Например:

```text
🇺🇿 Всё для исследования Узбекистана

Города
История
Культура
Еда
Природа
Транспорт
Полезная информация
```

Добавить CTA:

**Открыть справочник**

или:

**Explore Uzbekistan**

Но сам блок не должен занимать столько места, сколько главный Trip Constructor.

---

# 24. EXTERNAL DIRECTORY WEBSITE

Концепция:

**"Всё для исследования Узбекистана"**

должна быть вынесена на отдельный веб-сайт.

На основном DiyorAI оставить компактный promotional block:

```text
🇺🇿 Explore Uzbekistan

Everything you need to know before your trip.

[Explore Guidebook]
```

Кнопка должна вести на отдельный website / external destination.

Если URL ещё не задан, сделать конфигурационный параметр:

```js
GUIDEBOOK_URL
```

чтобы URL можно было легко заменить позже.

Не хардкодить URL в нескольких местах.

---

# 25. HOMEPAGE FINAL STRUCTURE

После изменений Homepage должна иметь примерно такую структуру:

```text
HERO
│
├── Main DiyorAI value proposition
│
├── READY-MADE ROUTES
│
├── SMART / LOW-BUDGET TOURS
│
├── TRIP CONSTRUCTOR
│
├── GUIDES
│
├── EXPLORE UZBEKISTAN / GUIDEBOOK
│
└── FOOTER
```

FAQ больше не должен находиться отдельным большим блоком на Homepage.

---

# 26. FAQ

FAQ оставить только на отдельной странице:

```text
/faq
```

Сделать его attractive:

```text
🧳 Planning
🏨 Hotels
✈️ Transport
👨‍🏫 Guides
💰 Budget
🛡 Safety
📱 DiyorAI
```

Использовать expandable questions.

На Homepage FAQ block удалить.

---

# 27. DIRECTORY BLOCK DESIGN

Блок "Всё для исследования Узбекистана" должен быть:

- компактнее;
- презентабельным;
- визуально отделённым;
- с понятным CTA;
- не конкурировать с Constructor и Smart Trips.

Например:

```text
🇺🇿 Explore Uzbekistan

Cities • Culture • Food • History • Nature

Your complete companion to Uzbekistan.

[Open Guidebook →]
```

---

# 28. GUIDE DATABASE

Увеличить demo database гидов минимум до 20–30.

Гиды должны быть распределены по:

- Tashkent;
- Tashkent Region;
- Samarkand;
- Bukhara;
- Khiva;
- Shahrisabz;
- Andijan;
- Namangan;
- Fergana;
- Nukus;
- Termez.

Добавить больше специализаций:

- History
- Architecture
- Culture
- Food
- Nature
- Photography
- Family Travel
- Solo Travel
- Archaeology
- Crafts
- Gastronomy
- Modern Uzbekistan
- Mountains
- Skiing
- Eco Tourism
- Walking Tours
- Cycling
- Local Traditions

---

# 29. GUIDE TRUST

Для каждого гида предусмотреть:

```text
🛡 Trust Score

🎯 Match Score
```

Trust Score отвечает:

> Насколько гид надёжен?

Match Score отвечает:

> Насколько гид подходит конкретному пользователю?

Не смешивать эти показатели.

---

# 30. GUIDE VERIFICATION

В детальной карточке гида отображать:

```text
🪪 Identity Verified
🎓 Qualification Verified
🇬🇧 Language Verified
```

Также:

```text
🧭 Experience
327 completed tours

⭐ Customer Experience
4.9 / 5

⏱ Reliability
98%
```

Не показывать неподтверждённые значения как verified.

---

# 31. GUIDE DETAILED CARD

Для каждого гида должна существовать детальная карточка.

Показывать:

- photo;
- name;
- location;
- specializations;
- languages;
- Trust Score;
- Match Score;
- rating;
- completed tours;
- experience;
- verification;
- reviews;
- reliability;
- price;
- booking CTA.

Кнопка:

**Book Guide**

---

# 32. BOOKING

После готового маршрута и выбора гида добавить:

**Забронировать**

После клика:

форма контактных данных.

Поля:

- name;
- phone;
- email;
- optional comment.

После отправки:

```text
✓ Booking confirmed
```

Показывать:

- выбранного гида;
- даты;
- количество людей;
- стоимость;
- маршрут;
- выбранные услуги.

---

# 33. STATE MANAGEMENT

Все параметры должны сохраняться между этапами:

```text
adults
children
totalTravelers

startDate
endDate
totalDays
activeDays

tripFormat
travelPace

destination

minBudget
maxBudget

interests

transport
transfer
hotel

smartTrips

guide
```

Не допускать ситуации:

пользователь выбрал `$300–$700`

→ перешёл на следующую страницу

→ budget исчез.

---

# 34. DATA MODELS

Budget:

```js
{
  minBudget: number,
  maxBudget: number | null
}
```

SmartTrip:

```js
{
  id,
  title: {
    ru,
    en,
    uz
  },
  description: {
    ru,
    en,
    uz
  },
  destination,
  region,
  durationDays,
  pricePerAdult,
  pricePerChild,
  currency,
  minGroupSize,
  maxGroupSize,
  interests: [],
  pace: [],
  suitableFor: [],
  included: [],
  optional: [],
  images: [],
  availability,
  guideIds: [],
  isMock: true
}
```

Guide:

```js
{
  id,
  name: {
    ru,
    en,
    uz
  },
  photo,
  city,
  region,
  languages: [],
  experienceYears,
  completedTours,
  specializations: [],
  pricePerTour,
  availability,
  verification: {},
  performance: {},
  reviews: {},
  reputation: {},
  safety: {},
  scores: {
    trustScore,
    matchScore
  },
  badges: []
}
```

---

# 35. SMART RECOMMENDATION LOGIC

Создать reusable logic:

```js
getSmartTripRecommendations(userProfile, tripState)
```

Учитывать:

- budget range;
- destination;
- region;
- interests;
- pace;
- duration;
- group size;
- adults;
- children;
- availability.

Не сортировать только по цене.

---

# 36. EXPERIENCE MATCH SCORE

Создать:

```js
calculateExperienceMatch()
```

Учитывать:

```text
budget fit
interest match
location
pace compatibility
duration
group compatibility
```

Пример:

```text
🎯 96% Match
```

---

# 37. BUDGET OPTIMIZATION

Если маршрут превышает выбранный максимум:

например:

```text
Maximum budget:
$200

Current trip:
$220
```

показать:

```text
⚠️ Your trip is $20 over budget.
```

Предложить:

```text
💡 We found a way to save $25.
```

Варианты:

- cheaper hotel;
- cheaper transfer;
- cheaper guide;
- cheaper Smart Trip;
- alternative transport.

Ничего не менять автоматически.

---

# 38. SAVE MONEY

Добавить:

**💡 Save money**

При нажатии анализировать:

- hotel;
- transport;
- transfer;
- guide;
- activities;
- Smart Trips.

Предлагать более дешёвые альтернативы.

---

# 39. RESPONSIVE DESIGN

Все новые блоки должны работать:

- Desktop;
- Tablet;
- Mobile.

Budget Slider должен быть touch-friendly.

---

# 40. ACCESSIBILITY

Не использовать цвет как единственный способ передачи состояния.

Например:

```text
🔴 $20 over budget
```

а не только красный элемент.

Все интерактивные элементы должны иметь accessible labels и keyboard navigation.

---

# 41. НЕ ЛОМАТЬ СУЩЕСТВУЮЩИЙ ПРОЕКТ

Критически важно:

- не переписывать существующую архитектуру без необходимости;
- не удалять существующий функционал, если он не противоречит новым требованиям;
- расширять существующие components вместо создания дублей;
- использовать существующий state management;
- сохранить существующие routes и design language.

Если существует budget component — изменить его на range slider, а не создавать второй budget component.

---

# 42. FINAL USER EXPERIENCE

Пользователь открывает DiyorAI и видит три понятных пути:

### Готовые маршруты

> Я хочу быстро выбрать готовую поездку.

### Smart / Low-Budget Tours

> Я хочу посмотреть, куда можно съездить за разумный бюджет.

### Конструктор

> Я хочу самостоятельно собрать путешествие.

Они должны быть визуально различимы.

---

# 43. FINAL SMART TRIP FLOW

```text
Homepage
↓
Smart Trips
↓
Budget Range
↓
Minimum: $30
Maximum: $100
↓
2 adults
↓
Nature
↓
Active
↓
Tashkent Region
↓
Smart Recommendations
↓
Charvak
Chimgan
Beldersay
↓
View Details
↓
Add to Trip
↓
Budget recalculation
↓
Guide recommendation
↓
Book
```

---

# 44. FINAL CONSTRUCTOR FLOW

```text
Homepage
↓
Top Navigation → Конструктор
↓
Smooth scroll
↓
Trip Constructor
↓
Who
↓
How many days
↓
Format
↓
Travel pace
↓
Destination
↓
Budget Range
↓
Interests
↓
Build Route
↓
Transport
↓
Transfer
↓
Hotel
↓
Generated Route
↓
Smart Experiences
↓
Guides
↓
Booking
```

---

# 45. ACCEPTANCE CRITERIA

## Homepage

- Ready-Made Routes отделены от Smart Trips.
- Smart Trips отделены от Constructor.
- Constructor является отдельным крупным блоком.
- FAQ отсутствует на Homepage.
- Guidebook представлен компактным блоком.
- Большая кнопка "Логистика и памятка для туриста" удалена.
- "Всё для исследования Узбекистана" не является большой hero-кнопкой.

## Navigation

- В верхнем меню есть "Конструктор".
- Клик ведёт к Constructor.
- На Homepage используется smooth scroll.
- С другой страницы выполняется переход на Homepage + scroll к Constructor.

## Budget

- Старые budget buttons удалены.
- Используется min/max range slider.
- Можно выбирать произвольный диапазон.
- $1000+ не является жёстким лимитом.
- Budget state сохраняется между страницами.
- Budget влияет на Smart Trips.

## Smart Trips

- Отдельный блок.
- Интерактивные карточки.
- Add to Trip.
- Remaining Budget.
- Match Score.
- Cheaper Alternatives.
- Surprise Me.
- What can I do for my budget?
- Tashkent Region experiences.

## Guides

- 20–30+ demo guides.
- Разные города.
- Разные специализации.
- Локализованные имена.
- Trust Score.
- Match Score.
- Verification.
- Detailed Profile.
- Booking.

## Directory

- Compact promotional block.
- Вынесен на отдельный web destination.
- URL конфигурируемый через `GUIDEBOOK_URL`.

## FAQ

- Отдельная страница.
- Attractive UI.
- Categories.
- Expandable questions.
- Emoji/icons.

## Technical

- Existing functionality preserved.
- No duplicated components where reusable components already exist.
- State preserved.
- Responsive.
- Accessible.
- Mock data marked.
- Architecture remains API-ready.

---

# 46. FINAL PRODUCT PRINCIPLE

После реализации DiyorAI должен выглядеть не как набор разрозненных страниц, а как единая система:

```text
READY-MADE ROUTES
        │
        ├── Choose an existing trip
        │
SMART / LOW-BUDGET
        │
        ├── Discover what you can experience
        │
TRIP CONSTRUCTOR
        │
        ├── Build a personalized trip
        │
        ↓
TRANSPORT
        ↓
HOTEL
        ↓
TRANSFER
        ↓
SMART EXPERIENCES
        ↓
TRUSTED GUIDES
        ↓
BOOKING
```

Главная ценность:

> **DiyorAI помогает путешественнику не просто спланировать поездку по Узбекистану, а понять, что он реально может получить за свой бюджет, выбрать подходящий вариант и доверенного гида, а затем собрать и забронировать путешествие.**

После завершения реализации обязательно протестируй весь пользовательский flow вручную и убедись, что новые функции не ломают существующие.
