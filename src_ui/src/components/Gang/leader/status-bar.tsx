import React from 'react';
import moment from 'moment';
import { IoIosBatteryFull, IoIosWifi } from 'react-icons/io';

type Props = {
	date: string;
};

export default function StatusBar({ date }: Props) {
	return (
		<div className="gang-leader_status-bar">
			<div className="time">
				<span>{moment.utc(date).format('HH:mm')}</span>
			</div>

			<div className="icons">
				<IoIosWifi />
				<IoIosBatteryFull />
			</div>
		</div>
	);
}
