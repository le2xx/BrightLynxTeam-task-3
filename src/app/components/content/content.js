const content = () => {
	const content = document.querySelector('.content');
	const field = content.querySelector('.content__field');
	const field_items = field.querySelectorAll('.content__field-item');
	const btn = content.querySelector('.content__btn');
	const stopwatch = content.querySelector('.content__timer');

	let timerId = null;
	let startDate = null;
	let fieldGame = new Array(15); // игровое поле
	let nodeArray = [];

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

	const newField = listColors => { // генерирует новое поле с цветами в случайном порядке
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

	const startWatchFunc = () => { // старт секундомера
		timerId = setTimeout(() => {
			stopwatch.textContent = diffDate(startDate);
			startWatchFunc();
		}, 10);
	};

	const stopWatchFunc = timerId => { // остановить таймер
		clearTimeout(timerId)
	};

	const onClickBtn = () => {
		startDate = new Date();
		startWatchFunc(); // запускаем таймер
		fieldGame = newField(fieldColors); // создаем игровое поле
	};

	const onClickFieldItem = (node) => {
		const index = Array.prototype.slice.call(field_items) // получаем индекс ноды которую нажали
			.indexOf(node);

		const lenNodeArray = nodeArray.length;
		const lastNode = nodeArray[lenNodeArray - 1]; // последняя нода в массиве нод
		const penultimateNode = nodeArray[lenNodeArray - 2]; // предпоследняя нода

		if (lenNodeArray === 0) {
			node.style.background = fieldGame[index];
			nodeArray = nodeArray.concat(node);
			return;
		}

		if (lastNode.style.background === fieldGame[index]) {
			node.style.background = fieldGame[index];
			nodeArray = nodeArray.concat(node);
			return;
		}

		if (lastNode.style.background === penultimateNode.style.background) {
			node.style.background = fieldGame[index];
			nodeArray = nodeArray.concat(node);
			if (lenNodeArray === 15) { // если массив нод полон, то стоп игра
				stopWatchFunc(timerId);
				alert('Вы выиграли!\r\nЗатраченное время: ' + stopwatch.textContent);
				return;
			}
			return;
		}

		lastNode.style.background = 'rgb(255, 255, 255)';
		nodeArray.pop();

	};

	btn.addEventListener('click', onClickBtn);

	Array.prototype.forEach.call(field_items, node => {
		node.addEventListener('click', onClickFieldItem.bind(null, node));
	});

};
export { content };
