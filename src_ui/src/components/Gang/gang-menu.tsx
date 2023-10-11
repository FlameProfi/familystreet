import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import rpc from 'rage-rpc';
import CircleMenu, { withCircleMenu } from '../Common/circle-menu';

class GangMenu extends Component<RouteComponentProps> {
	readonly items = [
		{
			name: 'rope',
			title: 'Связать',
			action: this.tieUp
		},
		{
			name: 'headsack',
			title: 'Надеть мешок',
			action: this.putSack
		},
		{
			name: 'car',
			title: 'Транспорт',
			action: this.toggleVehicleSeat
		},
		{
			name: 'noheadsack',
			title: 'Снять мешок',
			action: this.takeOffSack
		},
		{
			name: 'norope',
			title: 'Развязать',
			action: this.untie
		}
	];

	toggleVehicleSeat(playerId?: number) {
		rpc.callServer('toggleVehicleSeat', playerId);
	}

	putSack(playerId?: number) {
		rpc.callServer('Gang-UseSack', playerId);
	}

	takeOffSack(playerId?: number) {
		rpc.callServer('disableHeadSack', playerId);
	}

	tieUp(playerId?: number) {
		rpc.callServer('Gang-UseRope', playerId);
	}

	untie(playerId?: number) {
		rpc.callServer('disableHandcuffs', playerId);
	}

	render() {
		return (
			<CircleMenu items={this.items} playerId={this.props.location.state.playerId} />
		);
	}
}

export default withCircleMenu(GangMenu);
