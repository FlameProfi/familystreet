import React, { Component } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Navigation from '../navigation';
import Button from '../button';
import { Rank } from '../ranks';
import { Member } from './index';
import RankList from './rank';

type Props = {
	member: Member;
	update: (data: { [K in keyof Member]?: Member[K] }) => void;
	kick: (name: string) => void;
	close: () => void;
};
type State = {
	rankMenu: boolean;
	selectedRank?: Rank;
};

export default class MemberEditor extends Component<Props, State> {
	readonly state: State = {
		rankMenu: false
	};

	toggleRankMenu() {
		this.setState((state) => ({ rankMenu: !state.rankMenu }));
	}

	selectRank(rank: Rank) {
		this.setState(() => ({ selectedRank: rank, rankMenu: false }));
	}

	save() {
		const { update, member } = this.props;
		const { selectedRank } = this.state;

		if (selectedRank && member.rank !== selectedRank._id) {
			update({ rank: selectedRank._id });
		}
	}

	render() {
		const { rankMenu, selectedRank } = this.state;
		const { member, kick, close } = this.props;

		return rankMenu ? (
			<RankList
				active={member.rank}
				selected={selectedRank}
				select={this.selectRank.bind(this)}
				close={this.toggleRankMenu.bind(this)}
			/>
		) : (
			<div className="gang-leader_member-editor">
				<Navigation
					title="Участник"
					close={{ title: 'Участники', onClick: close }}
					action={{ title: 'Готово', onClick: this.save.bind(this) }}
				/>

				<div className="gang-leader_list">
					<Button
						className="gang-leader_list-item"
						name="Ранг"
						selected={selectedRank ? selectedRank.name : member.rank}
						onClick={this.toggleRankMenu.bind(this)}
					>
						<IoIosArrowForward />
					</Button>
				</div>

				<Button name="Уволить" action="delete" onClick={() => kick(member.userId)} />
			</div>
		);
	}
}
