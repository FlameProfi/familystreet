// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import rpc from 'rage-rpc';
import images from '../../utils/images';

type CircleItem = {
	name: string;
	title: string;
	action: (playerId?: number) => void;
};

type Props = {
	playerId?: number;
	items: CircleItem[];
};
type State = {
	title: string;
};

export default class CircleMenu extends Component<Props, State> {
	readonly state: State = {
		title: 'Закрыть'
	};

	onHover(item?: CircleItem) {
		this.setState(() => ({ title: item ? item.title : 'Закрыть' }));
	}

	closeMenu() {
		rpc.callClient('TargetMenu-Close', true);
	}

	renderItems() {
		const { items, playerId } = this.props;

		return [...Array(8).keys()].map((value, index) => {
			const item = items[index];
			const image = images.getImage(item && item.name);

			return item ? (
				<li
					key={item.name}
					className="circle-menu_item"
					onMouseOver={this.onHover.bind(this, item)}
					onClick={() => item.action(playerId)}
				>
					{image ? (
						<svg className="icon">
							<use xlinkHref={`${image}#icon`} />
						</svg>
					) : (
						<span className="icon">{index + 1}</span>
					)}
				</li>
			) : (
				<li key={index} className="circle-menu_item" />
			);
		});
	}

	render() {
		const { title } = this.state;

		return (
			<div className="circle-menu">
				<button
					className="circle-menu_center"
					onMouseOver={() => this.onHover()}
					onClick={() => this.closeMenu()}
				>
					{title}
				</button>

				<ul className="circle-menu_items">{this.renderItems()}</ul>
			</div>
		);
	}
}

export function withCircleMenu(WrappedComponent: any) {
	return class extends Component {
		componentWillUnmount() {
			rpc.callClient('TargetMenu-Close', false);
		}

		render() {
			return <WrappedComponent {...this.props} />;
		}
	};
}
