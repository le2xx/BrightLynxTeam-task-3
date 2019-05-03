const content = () => {
	const content = document.querySelector('.content');
	const field = content.querySelector('.content__field');
	const field_items = field.querySelectorAll('.content__field-item');
	const btn = content.querySelector('.content__btn');
	const stopwatch = content.querySelector('.content__timer');

	let timerId = null; // идентификатор таймера
	let startDate = null; // время начала игры
	let fieldGame = new Array(15); // игровое поле
	let nodeArray = []; // массив нод, заполняется по ходу игры

	const fieldColors = [ // множество оттенков
		'rgb(128, 0, 0)',
		'rgb(255, 255, 0)',
		'rgb(255, 0, 0)',
		'rgb(0, 255, 0)',
		'rgb(255, 0, 255)',
		'rgb(128, 0, 128)',
		'rgb(0, 0, 255)',
		'rgb(255, 165, 0)'
	];

	const fieldInit = listColors => { // генерирует новое поле с цветами в случайном порядке
		return listColors.slice()
			.concat(listColors.slice())
			.sort(() => Math.random() - 0.5);
	};

	const diffDate = startDate => { // вычисляет разницу во времени между началом игры и текущим временем
		const currentDate = new Date();
		const min = Math.floor((currentDate.getTime() - startDate.getTime()) / 60000);
		const sec = ((currentDate.getTime() - startDate.getTime()) % 60000 / 1000).toFixed(0);
		const milli = currentDate.getMilliseconds();
		const minNormalized = (min < 10 ? '0' : '') + min;
		const secNormalized = (sec < 10 ? '0' : '') + sec;
		return minNormalized + ':' + secNormalized + ':' + milli;
	};

	const startWatchFunc = () => { // старт таймера
		timerId = setTimeout(() => {
			stopwatch.textContent = diffDate(startDate);
			startWatchFunc();
		}, 10);
	};

	const stopWatchFunc = timerId => { // остановить таймер
		clearTimeout(timerId)
	};

	const onStartGame = () => { // старт игры
		Array.prototype.forEach.call(field_items, node => { // вешаем событие 'click' на элементы игрового поля
			node.addEventListener('click', onGameSituation.bind(null, node));
		});

		startDate = new Date(); // фиксируем время начала игры
		startWatchFunc(); // запускаем таймер
		fieldGame = fieldInit(fieldColors); // создаем игровое поле
	};

	const onGameSituation = (node) => { // реакция на игровые ситуации
		const index = Array.prototype.slice.call(field_items) // получаем индекс ноды которую нажали
			.indexOf(node);

		const lenNodeArray = nodeArray.length;
		const lastNode = nodeArray[lenNodeArray - 1]; // последняя нода в массиве нод
		const penultimateNode = nodeArray[lenNodeArray - 2]; // предпоследняя нода
		const messEndGame = 'Вы выиграли!\r\nЗатраченное время: ';

		if (lenNodeArray === 0) { // если массив нод пуст, то
			node.style.background = fieldGame[index]; // окрасить
			nodeArray = nodeArray.concat(node); // и добавить в массив нод
			return;
		}

		if (lenNodeArray === 1 && lastNode.style.background !== fieldGame[index]) { // если есть хоть одна нода и не совпадает с текущей
			lastNode.style.background = 'rgb(255, 255, 255)'; // окрасить в белый
			nodeArray.pop(); // опустошить массив нод
			return;
		}

		if (lastNode.style.background === fieldGame[index]) { // если последняя нода в массиве нод совпадает с  текущей, то
			node.style.background = fieldGame[index]; // окрасить
			nodeArray = nodeArray.concat(node); // и добавить в массив нод
			if (lenNodeArray === 15) { // если массив нод полон, то стоп игра
				stopWatchFunc(timerId); // остановить счетчик
				setTimeout(() => alert( messEndGame + stopwatch.textContent), 300); // сообщить о победе
				return;
			}
			return;
		}

		if (lastNode.style.background === penultimateNode.style.background) { // если последняя и предпоследнии ноды одиноковы, то
			node.style.background = fieldGame[index]; // окрасить
			nodeArray = nodeArray.concat(node); // и добавить в массив нод
			if (lenNodeArray === 15) { // если массив нод полон, то стоп игра
				stopWatchFunc(timerId); // остановить счетчик
				setTimeout(() => alert( messEndGame + stopwatch.textContent), 300); // сообщить о победе
				return;
			}
			return;
		}

		lastNode.style.background = 'rgb(255, 255, 255)'; // удалить последнюю ноду из массива
		nodeArray.pop();

	};

	btn.addEventListener('click', onStartGame); // старт игры по нажатию кнопки
};
export { content };
