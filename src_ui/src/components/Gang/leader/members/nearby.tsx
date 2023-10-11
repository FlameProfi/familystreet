import React, { Component } from 'react';
import rpc from 'rage-rpc';
import { IoIosArrowForward } from 'react-icons/io';
import Navigation from '../navigation';
import Button from '../button';

type Player = {
	id: number;
	name: string;
};

type Props = {
	addMember: (id: number) => Promise<void>;
	close: () => void;
};
type State = {
	players: Player[];
};

export default class Nearby extends Component<Props, State> {
	readonly state: State = {
		players: []
	};

	componentDidMount() {
		rpc
			.callServer('Gang-GetNearbyPlayers')
			.then((players) => this.setState(() => ({ players })));
	}

	async invite(id: number) {
		try {
			await this.props.addMember(id);

			this.setState((state) => ({
				players: state.players.filter((player) => player.id !== id)
			}));
		} catch (err) {
			console.error(err);
		}
	}

	render() {
		return (
			<div className="gang-leader_nearby">
				<Navigation
					title="Люди поблизости"
					close={{ title: 'Участники', onClick: this.props.close }}
				/>

				<div className="gang-leader_list">
					{this.state.players.map((item) => (
						<Button
							className="gang-leader_list-item"
							name={item.name}
							key={item.id}
							onClick={this.invite.bind(this, item.id)}
						>
							<IoIosArrowForward />
						</Button>
					))}
				</div>
			</div>
		);
	}
}
