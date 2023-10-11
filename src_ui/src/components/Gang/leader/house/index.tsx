import React, { Component } from 'react';
import rpc from 'rage-rpc';
import {showNotification} from '../../../../utils/notifications';

import Navigation from '../navigation';
import Button from '../button';

type House = {
	index: number;
	active: boolean;
	type: string;
};

type State = {
	houses: House[];
};

export default class GangHouse extends Component<{}, State> {
	readonly state: State = {
		houses: []
	};

	componentDidMount() {
		rpc
			.callServer('House-GetPlayerHouses')
			.then((houses) => this.setState(() => ({ houses })));
	}

	getActiveHouse() {
		return this.state.houses.find((house) => house.active);
	}

	async setHouse(house: House) {
		if (house.type !== 'premium') {
			return showNotification('error', 'Минимальный класс дома - Апартаменты');
		}

		if (house.active) return;

		try {
			await rpc.callServer('Gang-SetHouse', house.index);

			this.setState((state) => ({
				houses: state.houses.map((item) =>
					item.index === house.index ? { ...item, active: true } : item
				)
			}));
		} catch (err) {
			console.error(err);
		}
	}

	async disableHouse() {
		const house = this.getActiveHouse();

		if (!house) return;

		try {
			await rpc.callServer('Gang-SetHouse', [house.index, false]);

			this.setState((state) => ({
				houses: state.houses.map((item) =>
					item.index === house.index ? { ...item, active: false } : item
				)
			}));
		} catch (err) {
			console.error(err);
		}
	}

	render() {
		const { houses } = this.state;

		return (
			<div className="gang-leader_house">
				<Navigation title="Дом" />

				<div className="gang-leader_list">
					{houses.map((item) => (
						<Button
							className="gang-leader_list-item"
							key={item.index}
							name={`Дом №${item.index}`}
							active={item.active}
							onClick={this.setHouse.bind(this, item)}
						/>
					))}

					{houses.length ? (
						<Button
							className="gang-leader_list-item"
							name="Без дома"
							active={!this.getActiveHouse()}
							onClick={this.disableHouse.bind(this)}
						/>
					) : null}
				</div>
			</div>
		);
	}
}
