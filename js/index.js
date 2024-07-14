// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
      shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
      filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
      sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
      sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
      sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
      sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
      kindInput = document.querySelector('.kind__input'); // поле с названием вида
      colorInput = document.querySelector('.color__input'); // поле с названием цвета
      weightInput = document.querySelector('.weight__input'); // поле с весом
      addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = (fruits) => {
  fruitsList.innerHTML = ''; // очищаем список

  for (let i = 0; i < fruits.length; i++) {
    const li = document.createElement('li'); // формируем новый элемент <li> при помощи document.createElement,
    li.classList.add('fruit__item'); // исправлено на 'fruit__item'
    
    // добавляем класс в зависимости от цвета
    switch (fruits[i].color) {
      case 'фиолетовый':
        li.classList.add('fruit_violet');
        break;
      case 'зеленый':
        li.classList.add('fruit_green');
        break;
      case 'розово-красный':
        li.classList.add('fruit_carmazin');
        break;
      case 'желтый':
        li.classList.add('fruit_yellow');
        break;
      case 'светло-коричневый':
        li.classList.add('fruit_lightbrown');
        break;
      case 'черный':
        li.classList.add('fruit_black');
      break;
    }

    li.innerHTML = `
      <div class="fruit__info">
        <div>index: ${i}</div>
        <div>kind: ${fruits[i].kind}</div>
        <div>color: ${fruits[i].color}</div>
        <div>weight (кг): ${fruits[i].weight}</div>
      </div>
    `;
    fruitsList.appendChild(li); // и добавляем в конец списка fruitsList при помощи document.appendChild
  }
};

// отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  for (let i = fruits.length - 1; i > 0; i--) {
    const j = getRandomInt(0, i); // случайное число используется как индекс элемента, с которым будет произведена замена
    [fruits[i], fruits[j]] = [fruits[j], fruits[i]]; // деструктурирующее присваивание
  }
  display(fruits);
};

/*
  Здесь я использую `try...catch`, чтобы обработать ошибку.
  Если при попытке перемешать массив что-то пойдет не так, 
  то catch выведет alert
 */
shuffleButton.addEventListener('click', () => {
  try {
    shuffleFruits();
  } catch (error) {
    alert('Упс, что-то пошло не так... ' + error);
  }
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  const minWeight = parseInt(document.querySelector('.minweight__input').value, 10);
  const maxWeight = parseInt(document.querySelector('.maxweight__input').value, 10);
  fruits = fruits.filter(fruit => fruit.weight >= minWeight && fruit.weight <= maxWeight);
  display(fruits);
};

filterButton.addEventListener('click', filterFruits);

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  const colorPriority = ['фиолетовый', 'зеленый', 'розово-красный', 'желтый', 'светло-коричневый'];
  return colorPriority.indexOf(a.color) - colorPriority.indexOf(b.color);
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (comparation(arr[j], arr[j + 1]) > 0) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
  },

  quickSort(arr, comparation) {
    if (arr.length <= 1) {
      return arr;
    }

    const pivot = arr[0];
    const left = [];
    const right = [];

    for (let i = 1; i < arr.length; i++) {
      if (comparation(arr[i], pivot) < 0) {
        left.push(arr[i]);
      } else {
        right.push(arr[i]);
      }
    }

    return this.quickSort(left, comparation).concat(pivot, this.quickSort(right, comparation));
  },

  startSort(sort, arr, comparation) {
    const start = performance.now();
    if (sort === 'quickSort') {
      arr = this.quickSort(arr, comparation);
    } else {
      this.bubbleSort(arr, comparation);
    }
    const end = performance.now();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

// меняем вид сортировки
sortChangeButton.addEventListener('click', () => {
  sortKind = sortKind === 'bubbleSort' ? 'quickSort' : 'bubbleSort';
  sortKindLabel.textContent = sortKind;
});

sortActionButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  sortAPI.startSort(sortKind, fruits, comparationColor);
  sortTimeLabel.textContent = sortTime;
  display(fruits);
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  const kind = kindInput.value.trim();
  const color = colorInput.value.trim();
  const weight = parseInt(weightInput.value.trim(), 10);

  if (kind && color && !isNaN(weight)) {
    const newFruit = {
      kind: kind,
      color: color,
      weight: weight
    };
    fruits.push(newFruit);
    display(fruits);
  } else {
    alert('Пожалуйста, введите корректные данные для нового фрукта.');
  }
});