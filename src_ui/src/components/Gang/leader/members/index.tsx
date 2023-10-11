import React, { Component } from 'react';
import rpc from 'rage-rpc';
import { ModalContext } from '../modal';
import List from './list';
import Nearby from './nearby';
import Editor from './editor';

export type Member = {
	userId: string;
	name: string;
	rank?: string;
	id?: number;
};

type State = {
	members: Member[];
	limit: number;
	price: number;
	nearbyMenu: boolean;
	selectedMember?: Member;
};

export default class GangMembers extends Component<{}, State> {
	static contextType = ModalContext;

	declare context: React.ContextType<typeof ModalContext>;

	readonly state: State = {
		members: [],
		limit: 0,
		price: 0,
		nearbyMenu: false
	};

	componentDidMount() {
		rpc.callServer('Gang-GetMembersData').then((data) => this.setState(() => data));
	}

	toggleNearbyMenu() {
		this.setState((state) => ({ nearbyMenu: !state.nearbyMenu }));
	}

	selectMember(member?: Member) {
		this.setState(() => ({ selectedMember: member }));
	}

	async addMember(id: number, confirm = false) {
		const { limit, price, members } = this.state;

		if (limit <= members.length && !confirm) {
			this.context.show(
				'Добавить участника?',
				`Лимит участников превышен, следующее добавление стоит ${price} DP`,
				this.addMember.bind(this, id, true)
			);

			return;
		}

		try {
			const member: Member = await rpc.callServer('Gang-AddMember', id);

			this.setState((state) => ({ members: [...state.members, member] }));
		} catch (err) {
			console.error(err);
		}
	}

	async updateMember(data: { [K in keyof Member]?: Member[K] }) {
		if (!this.state.selectedMember) return;

		const { id, userId } = this.state.selectedMember;
		const rank = await rpc.callServer('Gang-UpdateMember', { ...data, id, userId });

		this.setState((state) => ({
			members: state.members.map((item) =>
				item.userId === userId ? { ...item, rank } : item
			),
			selectedMember: undefined
		}));
	}

	async kickMember(id: string) {
		await rpc.callServer('Gang-KickMember', id);

		this.setState((state) => ({
			members: state.members.filter((item) => item.userId !== id),
			selectedMember: undefined
		}));
	}

	render() {
		const { members, nearbyMenu, selectedMember } = this.state;

		return (
			<div className="gang-leader_members">
				{nearbyMenu ? (
					<Nearby
						addMember={this.addMember.bind(this)}
						close={this.toggleNearbyMenu.bind(this)}
					/>
				) : selectedMember ? (
					<Editor
						member={selectedMember}
						update={this.updateMember.bind(this)}
						kick={this.kickMember.bind(this)}
						close={() => this.selectMember()}
					/>
				) : (
					<List
						items={members}
						selectItem={this.selectMember.bind(this)}
						showNearby={this.toggleNearbyMenu.bind(this)}
					/>
				)}
			</div>
		);
	}
}
