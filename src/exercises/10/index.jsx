import { useRef, useState } from 'react';

function useCounter({ initialCount, minCount, maxCount, stepSize }) {
	const [currentCount, setCurrentCount] = useState(initialCount);
	const counterClicks = useRef(0);

	return {
		counterDetails: {
			currentCount,
			initialCount,
			minCount,
			maxCount,
			stepSize,
			isAtMinCount: currentCount === minCount,
			progressPercent:
				((currentCount - minCount) * 100) / (maxCount - minCount),
			counterClicks: counterClicks.current,
		},
		counterButtonProps: {
			disabled: currentCount + stepSize > maxCount,
			onClick: () => {
				setCurrentCount((count) => count + stepSize);
				counterClicks.current = counterClicks.current + 1;
			},
		},
		resetButtonProps: {
			disabled: currentCount === minCount,
			onClick: () => {
				setCurrentCount(minCount);
				counterClicks.current = counterClicks.current + 1;
			},
		},
	};
}

function CounterOne() {
	const {
		counterDetails: {
			currentCount,
			minCount,
			maxCount,
			stepSize,
			isAtMinCount,
			progressPercent,
			counterClicks,
		},
		counterButtonProps,
		resetButtonProps,
	} = useCounter({
		minCount: 0,
		maxCount: 10,
		initialCount: 1,
		stepSize: 2,
	});

	return (
		<div style={{ border: '1px solid magenta' }}>
			<p>{currentCount}</p>
			<button {...counterButtonProps}>+</button>
			<button {...resetButtonProps}>↺</button>
			<div>
				minCount: {minCount}, maxCount: {maxCount}, stepSize: {stepSize},
				isAtMinCount: {String(Boolean(isAtMinCount))}, progressPercent:{' '}
				{progressPercent.toFixed(2)}, counterClicks: {counterClicks}
			</div>
		</div>
	);
}
function CounterTwo() {
	const {
		counterDetails: { currentCount },
		counterButtonProps,
		resetButtonProps,
	} = useCounter({
		minCount: 15,
		maxCount: 20,
		initialCount: 16,
		stepSize: 1,
	});

	return (
		<div style={{ border: '1px solid green' }}>
			<p>{currentCount} hearts</p>
			<button {...counterButtonProps}>Increment</button>
			<button {...resetButtonProps}>X</button>
		</div>
	);
}
function CounterThird() {
	const {
		counterDetails: { currentCount },
		counterButtonProps,
		resetButtonProps,
	} = useCounter({
		minCount: 0,
		maxCount: 100,
		initialCount: 0,
		stepSize: 5,
	});

	return (
		<div style={{ border: '1px solid brown' }}>
			<p>{currentCount}%</p>
			<button {...counterButtonProps}>Increment</button>
			<button {...resetButtonProps}>↺</button>
		</div>
	);
}
function CounterFour() {
	const {
		counterDetails: { currentCount, counterClicks },
		counterButtonProps,
		resetButtonProps,
	} = useCounter({
		minCount: 1,
		maxCount: 5,
		initialCount: 1,
		stepSize: 1,
	});

	return (
		<div style={{ border: '1px solid yellow' }}>
			<p>{currentCount} stars</p>
			<button {...counterButtonProps}>Increment</button>
			<button {...resetButtonProps}>X</button>
			<span>Clicks: {counterClicks}</span>
		</div>
	);
}

function Ten() {
	return (
		<>
			<CounterOne />
			<CounterTwo />
			<CounterThird />
			<CounterFour />
		</>
	);
}

export default Ten;
