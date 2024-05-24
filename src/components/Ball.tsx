import React, { useEffect, useState } from 'react';
import './Ball.css';

type BallPropsType = {
	size?: number;
	num: -1|0|1|2|3|4|5|6|7|8|9;
	onClickCallback?: React.MouseEventHandler<HTMLFormElement> | undefined
}

export default function Ball({size = 200, num, onClickCallback}: BallPropsType) {
	const [checked, setChecked] = useState(false);
	
	useEffect(() => {
		if (num >= 0 && !isNaN(num)) {
			setChecked(true);
		}
		else
		{
			setChecked(false);
		}
	}, [ num ])
	
	return (
		<div className="flex" style={{width: size, height: size}}>
			<div className="toy">
				<form className="ball" onClick={onClickCallback}>
					<div className="window" />
					<div className={ (!checked ? 'opacity-100 ' : 'opacity-0 ') + "eight" }>
						<span>-</span>
					</div>
					
					<div className="answers">
						<input id="affirmative1" checked={checked} type="radio" name="answer" onChange={() => {}} required />
						<div className={ (checked ? 'opacity-100 ' : 'opacity-0 ') + "answer up" }>{ !isNaN(num) ? num : 0 }</div>
					</div>
					<div className="labels">
						<label htmlFor="affirmative1"></label>
					</div>
				</form>
			</div>
		</div>
	);
}
