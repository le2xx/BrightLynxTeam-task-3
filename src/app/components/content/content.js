const content = () => {
  const content = document.querySelector('.content');
  const field = content.querySelector('.content__field');
  const fieldItems = field.querySelectorAll('.content__field-item');
  const btn = content.querySelector('.content__btn');
  const stopwatch = content.querySelector('.content__timer');

  let timerId = null; // идентификатор таймера
  let startDate = null; // время начала игры
  let fieldGame = new Array(15); // игровое поле
  let nodeArray = []; // массив нод, заполняется по ходу игры

  const fieldColors = [ // // множество оттенков
    'red',
    'pink',
    'orange',
    'yellow',
    'green',
    'blue',
    'sapphire',
    'brown'
  ];

  // генерирует новое поле с цветами в случайном порядке
  const fieldInit = listColors => {
    return listColors.slice()
      .concat(listColors.slice())
      .sort(() => Math.random() - 0.5);
  };

  // вычисляет разницу во времени между началом игры и текущим временем
  const diffDate = startDate => { // вычисляет разницу во времени между началом игры и текущим временем
    const currentDate = new Date();
    const min = Math.floor((currentDate.getTime() - startDate.getTime()) / 60000);
    const sec = ((currentDate.getTime() - startDate.getTime()) % 60000 / 1000).toFixed(0);
    const milli = currentDate.getMilliseconds();
    const minNormalized = (min < 10 ? '0' : '') + min;
    const secNormalized = (sec < 10 ? '0' : '') + sec;
    return minNormalized + ':' + secNormalized + ':' + milli;
  };

  // старт таймера
  const startWatchFunc = () => {
    timerId = setTimeout(() => {
      stopwatch.textContent = diffDate(startDate);
      startWatchFunc();
    }, 10);
  };

  // остановить таймер
  const stopWatchFunc = timerId => {
    clearTimeout(timerId)
  };

  // true если атрибуты у нод равны
  const isEqualNodesColor = (nodeOne, nodeTwo) => {
    const nodeOneAttr = nodeOne.getAttribute('class');
    const nodeTwoAttr = nodeTwo.getAttribute('class');
    return nodeOneAttr === nodeTwoAttr;
  };

  // true если modClassName присутствует в атрибуте
  const isColoredNode = (node, modClassName) => {
    return node
      .getAttribute('class')
      .split(' ')
      .includes(modClassName);
  };

  // окрашивает клетку путем добавления модификатора в атрибут class
  const coloredNode = (node, modClassName) => {
    const classNames = node
      .getAttribute('class'); // получаем исходное значение атрибута
    node // добавляем класс-модификатор цвета к текущему атрибуту
      .setAttribute('class', classNames + ' ' + modClassName);
  };

  // очистка окраски, очищает все классы кроме modClassName
  const clearColorNode = (node, modClassName) => {
    const className = node
      .getAttribute('class')
      .split(' ')
      .filter(el => el === modClassName)
      .join(' ');

    node.setAttribute('class', className);
  };

  // общий сброс игры
  const resetGame = () => {
    Array.prototype.forEach.call(fieldItems, node =>
      clearColorNode(node, 'content__field-item'));
    timerId = null; // идентификатор таймера
    startDate = null; // время начала игры
    fieldGame = new Array(15); // игровое поле
    nodeArray = []; // массив нод, заполняется по ходу игры
  };

  // старт игры
  const onStartGame = () => {
    resetGame();
    Array.prototype.forEach.call(fieldItems, node => { // вешаем событие 'click' на элементы игрового поля
      node.addEventListener('click', onGameSituation.bind(null, node));
    });

    startDate = new Date(); // фиксируем время начала игры
    startWatchFunc(); // запускаем таймер
    fieldGame = fieldInit(fieldColors); // создаем игровое поле
  };

  // реакция на игровые ситуации
  const onGameSituation = (node) => {
    const index = Array.prototype.slice.call(fieldItems) // получаем индекс ноды которую нажали
      .indexOf(node);

    const lenNodeArray = nodeArray.length;
    const lastNode = nodeArray[lenNodeArray - 1]; // последняя нода в массиве нод
    const penultimateNode = nodeArray[lenNodeArray - 2]; // предпоследняя нода
    const modClassName = 'content__field-item_color_' + fieldGame[index]; // соответствующий класс модификатор
    const messEndGame = 'Вы выиграли!\r\nЗатраченное время: ';

    if (nodeArray.includes(node)) { // защита от повторного нажатия на открытую клетку
      return;
    }

    if (lenNodeArray === 0) { // если массив нод пуст, то
      coloredNode(node, modClassName); // покрасить ноду
      nodeArray = nodeArray.concat(node); // и добавить в массив нод
      return;
    }

    if (lenNodeArray === 1 && !isColoredNode(lastNode, modClassName)) { // если есть хоть одна нода и не совпадает с текущей
      clearColorNode(lastNode, 'content__field-item'); // то скрыть окрас текущей
      nodeArray.pop(); // и удалить из массива нод
      return;
    }

    if (isColoredNode(lastNode, modClassName)) { // если последняя нода в массиве нод совпадает с текущей, то
      coloredNode(node, modClassName); // покрасить ноду
      nodeArray = nodeArray.concat(node); // и добавить в массив нод
      if (lenNodeArray === 15) { // если массив нод полон, то стоп игра
        stopWatchFunc(timerId); // остановить счетчик
        setTimeout(() => alert(messEndGame + stopwatch.textContent), 300); // сообщить о победе
        return;
      }
      return;
    }

    if (isEqualNodesColor(lastNode, penultimateNode)) { // если последняя и предпоследнии ноды одиноковы, то
      coloredNode(node, modClassName); // покрасить ноду
      nodeArray = nodeArray.concat(node); // и добавить в массив нод
      if (lenNodeArray === 15) { // если массив нод полон, то стоп игра
        stopWatchFunc(timerId); // остановить счетчик
        setTimeout(() => alert(messEndGame + stopwatch.textContent), 300); // сообщить о победе
        return;
      }
      return;
    }

    clearColorNode(lastNode, 'content__field-item'); // то скрыть окрас текущей
    nodeArray.pop(); // удалить последнюю ноду из массива
  };

  btn.addEventListener('click', onStartGame); // старт игры по нажатию кнопки
};
export {content};
