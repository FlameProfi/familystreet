import React from 'react';
import rpc from 'rage-rpc';
import OutlinedButton from '../Common/outline-button';

export default function GangLeave() {
	return (
		<div className="gang-leader_leave">
			<div className="gang-leader_leave-container">
				<p>Вы уверены, что хотите уйти из банды?</p>

				<div className="buttons">
					<OutlinedButton isClose>Нет</OutlinedButton>
					<OutlinedButton
						onClick={() =>
							rpc.callServer('Gang-Leave').then(() => rpc.callClient('Browser-HidePage'))
						}
					>
						Да
					</OutlinedButton>
				</div>
			</div>
		</div>
	);
}
