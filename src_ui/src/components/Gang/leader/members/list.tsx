import React from 'react';
import { IoIosArrowForward, IoIosAdd } from 'react-icons/io';
import classNames from 'classnames';
import Navigation from '../navigation';
import Button from '../button';
import { Member } from './index';

type Props = {
	items: Member[];
	selectItem: (item: Member) => void;
	showNearby: () => void;
};

export default function MembersList({ items, selectItem, showNearby }: Props) {
	return (
		<div className="gang-leader_members-list">
			<Navigation title="Участники" action={{ title: IoIosAdd, onClick: showNearby }} />

			<div className="gang-leader_list">
				{items.map((item) => (
					<Button
						className={classNames('gang-leader_list-item', {
							inactive: typeof item.id !== 'number'
						})}
						key={item.name}
						name={item.name}
						selected={item.rank}
						onClick={() => selectItem(item)}
					>
						<IoIosArrowForward />
					</Button>
				))}
			</div>
		</div>
	);
}
