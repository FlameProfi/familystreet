import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import OutlinedButton from '../Common/outline-button';

type Props = {} & RouteComponentProps;

export default function GangDocs({ location }: Props) {
	const player = location.state;

	return (
		<div className="gang-docs">
			<h1 className="gang-docs_gang">{player.gang}</h1>

			<div className="gang-docs_container">
				<p className="gang-docs_name">
					Имя: <b>{player.name}</b>
				</p>
				<p className="gang-docs_rank">
					Ранг: <b>{player.rank}</b>
				</p>
			</div>

			<div className="gang-docs_footer">
				<p className="gang-docs_remark">
					Документ подтверждает участие данного гражданина в группировке © {player.gang}
				</p>

				<OutlinedButton isClose>Закрыть</OutlinedButton>
			</div>
		</div>
	);
}
