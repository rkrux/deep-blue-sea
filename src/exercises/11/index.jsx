import { useRef, useState } from 'react';

function useCounter({ initialCount, minCount, maxCount, stepSize }) {
	const [currentCount, setCurrentCount] = useState(initialCount);
	const counterClicks = useRef(0);

	const counterClickHandler = () => {
		setCurrentCount((count) => count + stepSize);
		counterClicks.current = counterClicks.current + 1;
	};

	const resetClickHandler = () => {
		setCurrentCount(minCount);
		counterClicks.current = counterClicks.current + 1;
	};

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
		getCounterButtonProps: ({ onClick: customOnClick, ...customProps }) => ({
			...customProps,
			disabled: currentCount + stepSize > maxCount,
			onClick: () => {
				counterClickHandler();
				if (customOnClick) {
					customOnClick();
				}
			},
		}),
		getResetButtonProps: ({ onClick: customOnClick, ...customProps }) => ({
			...customProps,
			disabled: currentCount === minCount,
			onClick: () => {
				resetClickHandler();
				if (customOnClick) {
					customOnClick();
				}
			},
		}),
	};
}

function Eleven() {
	const {
		counterDetails: {
			currentCount,
			initialCount,
			minCount,
			maxCount,
			stepSize,
			isAtMinCount,
			progressPercent,
			counterClicks,
		},
		getCounterButtonProps,
		getResetButtonProps,
	} = useCounter({
		minCount: 8,
		maxCount: 18,
		initialCount: 10,
		stepSize: 1,
	});
	const [customDetails, setCustomDetails] = useState({
		color: '#FFDB58',
		fontSize: initialCount,
	});

	return (
		<div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-evenly',
					margin: '10px',
					width: '10%',
					lineHeight: '2',
					background: customDetails.color,
					fontSize: customDetails.fontSize,
				}}
			>
				<button
					{...getResetButtonProps({
						onClick: () => {
							setCustomDetails((details) => ({
								color: details.color === '#FFDB58' ? 'brown' : '#FFDB58',
								fontSize: initialCount,
							}));
						},
					})}
				>
					↺
				</button>
				<p>{currentCount}</p>
				<button
					{...getCounterButtonProps({
						onClick: () => {
							setCustomDetails((details) => ({
								...details,
								fontSize: currentCount,
							}));
						},
					})}
				>
					+
				</button>
			</div>
			<ul>
				<li>minCount: {minCount}</li>
				<li>maxCount: {maxCount}</li>
				<li>stepSize: {stepSize}</li>
				<li>isAtMinCount: {String(Boolean(isAtMinCount))}</li>
				<li>progressPercent: {progressPercent.toFixed(2)}</li>
				<li>counterClicks: {counterClicks}</li>
			</ul>
		</div>
	);
}

export default Eleven;
