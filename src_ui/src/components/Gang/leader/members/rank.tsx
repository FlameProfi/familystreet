import React, { Component } from 'react';
import rpc from 'rage-rpc';
import Navigation from '../navigation';
import Button from '../button';
import { Rank } from '../ranks';

type Props = {
	active?: string;
	selected?: Rank;
	select: (rank: Rank) => void;
	close: () => void;
};
type State = {
	ranks: Rank[];
};

export default class MemberRank extends Component<Props, State> {
	readonly state: State = {
		ranks: []
	};

	componentDidMount() {
		rpc
			.callServer('Gang-GetRanksData')
			.then(({ ranks }) => this.setState(() => ({ ranks })));
	}

	render() {
		const { active, selected, select, close } = this.props;

		return (
			<div className="gang-leader_member-editor">
				<Navigation title="Ранг" close={{ title: 'Назад', onClick: close }} />

				<div className="gang-leader_list">
					{this.state.ranks.map((item) => (
						<Button
							className="gang-leader_list-item"
							key={item._id}
							name={item.name}
							active={selected ? selected._id === item._id : active === item.name}
							onClick={() => select(item)}
						/>
					))}
				</div>
			</div>
		);
	}
}
