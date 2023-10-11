import React from 'react';
import classNames from 'classnames';
import { isUndefined } from 'lodash';
import { MdCheck } from 'react-icons/md';

type Props = {
	name: string;
	selected?: string | number;
	action?: 'add' | 'delete';
	active?: boolean;
	className?: string;
	children?: any;
	onClick?: () => void;
};

export default function CustomButton({
	name,
	selected,
	active,
	action,
	className,
	children,
	onClick
}: Props) {
	return (
		<div
			className={classNames('gang-leader_button', className, {
				'gang-leader_button--primary': action === 'add',
				'gang-leader_button--danger': action === 'delete',
				'gang-leader_button--disabled': !onClick
			})}
			onClick={onClick}
		>
			<span className="name">{name}</span>

			{!isUndefined(selected) && <span className="selected">{selected}</span>}

			{children}

			{active && (
				<span className="active">
					<MdCheck />
				</span>
			)}
		</div>
	);
}
