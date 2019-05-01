const content = () => {
	const content = document.querySelector('.content');
	const field = content.querySelector('.content__field');
	const btn = content.querySelector('.content__btn');
	const stopwatch = content.querySelector('.content__timer');

	let timerId = null;
	let startDate = null;

	const fieldColors = [ // множество оттенков
		'#79553D',
		'#FFDC33',
		'#B00000',
		'#A7FC00',
		'#BD33A4',
		'#240935',
		'#42AAFF',
		'#F34723'
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
		startWatchFunc();
		// stopWatchFunc(timerId);
	};

	btn.addEventListener('click', onClickBtn);
};
export { content };
