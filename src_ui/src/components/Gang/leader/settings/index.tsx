import React, { useContext } from 'react';
import rpc from 'rage-rpc';
import Navigation from '../navigation';
import Button from '../button';
import { ModalContext } from '../modal';

export default function GangSettings() {
	const modal = useContext(ModalContext);

	function dissolve() {
		rpc.callServer('Gang-Dissolve').then(() => rpc.callClient('Browser-HidePage'));
	}

	return (
		<div className="gang-leader_settings">
			<Navigation title="Настройки" />

			<Button
				name="Расформировать банду"
				action="delete"
				onClick={() =>
					modal.show(
						'Расформировать банду?',
						'Расформирование банды также приведет к обнулению общака',
						dissolve
					)
				}
			/>
		</div>
	);
}
