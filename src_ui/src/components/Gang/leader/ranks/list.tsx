import React from 'react';
import { IoIosArrowForward, IoIosAdd } from 'react-icons/io';
import Navigation from '../navigation';
import Button from '../button';
import { Rank } from './index';

type Props = {
	items: Rank[];
	openEditor: () => void;
	selectItem: (item: Rank) => void;
};

export default function RanksList({ items, selectItem, openEditor }: Props) {
	return (
		<div className="gang-leader_ranks-list">
			<Navigation title="Ранги" action={{ title: IoIosAdd, onClick: openEditor }} />

			<div className="gang-leader_list">
				{items.map((item) => (
					<Button
						className="gang-leader_list-item"
						key={item.name}
						name={item.name}
						onClick={() => selectItem(item)}
					>
						<IoIosArrowForward />
					</Button>
				))}
			</div>
		</div>
	);
}
