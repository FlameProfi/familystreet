import React, { Component } from 'react';
import rpc from 'rage-rpc';
import { ModalContext } from '../modal';
import List from './list';
import Editor from './editor';

export type Rank = {
	_id: string;
	name: string;
	permissions: {
		[key: string]: boolean;
	};
};

type State = {
	ranks: Rank[];
	price: number;
	limit: number;
	showEditor: boolean;
	selectedRank?: Rank;
};

export default class GangRanks extends Component<{}, State> {
	static contextType = ModalContext;

	declare context: React.ContextType<typeof ModalContext>;

	readonly state: State = {
		ranks: [],
		showEditor: false,
		price: 0,
		limit: 0
	};

	componentDidMount() {
		rpc.callServer('Gang-GetRanksData').then((data) => this.setState(() => data));
	}

	toggleEditor() {
		this.setState((state) => ({
			showEditor: !state.showEditor,
			selectedRank: undefined
		}));
	}

	selectRank(rank: Rank) {
		this.setState(() => ({ selectedRank: rank, showEditor: true }));
	}

	async createRank(data: Rank, confirm = false) {
		const { limit, price, ranks } = this.state;

		if (limit <= ranks.length && !confirm) {
			this.context.show(
				'Создать новый ранг?',
				`Лимит рангов превышен, следующее создание стоит ${price} DP`,
				this.createRank.bind(this, data, true)
			);

			return;
		}

		try {
			const rank: Rank = await rpc.callServer('Gang-CreateRank', data);

			this.setState((state) => ({
				ranks: [...state.ranks, rank],
				showEditor: false
			}));
		} catch (err) {
			console.error(err);
		}
	}

	async updateRank(name: string, data: Rank) {
		try {
			await rpc.callServer('Gang-UpdateRank', [name, data]);

			this.setState((state) => ({
				ranks: state.ranks.map((item) =>
					item._id === data._id ? { ...item, ...data } : item
				)
			}));

			this.toggleEditor();
		} catch (err) {
			console.error(err);
		}
	}

	async deleteRank(id: string) {
		await rpc.callServer('Gang-DeleteRank', id);

		this.setState((state) => ({
			ranks: state.ranks.filter((item) => item._id !== id)
		}));

		this.toggleEditor();
	}

	render() {
		const { ranks, showEditor, selectedRank } = this.state;

		return (
			<div className="gang-leader_ranks">
				{showEditor ? (
					<Editor
						rank={selectedRank}
						create={this.createRank.bind(this)}
						update={this.updateRank.bind(this)}
						remove={this.deleteRank.bind(this)}
						close={this.toggleEditor.bind(this)}
					/>
				) : (
					<List
						items={ranks}
						selectItem={this.selectRank.bind(this)}
						openEditor={this.toggleEditor.bind(this)}
					/>
				)}
			</div>
		);
	}
}
