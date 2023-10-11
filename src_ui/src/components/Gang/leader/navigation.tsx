import React from 'react';
import { IconType } from 'react-icons';
import { IoIosArrowBack } from 'react-icons/io';

type Props = {
	title: string;
	close?: {
		title: string;
		onClick: () => void;
	};
	action?: {
		title: string | IconType;
		onClick?: () => void;
		form?: string;
	};
};

export default function Navigation({ title, close, action }: Props) {
	return (
		<div className="gang-leader_navigation">
			{close && (
				<button
					type="button"
					className="gang-leader_navigation-back"
					onClick={close.onClick}
				>
					<IoIosArrowBack />
					<span>{close.title}</span>
				</button>
			)}

			<h3 className="gang-leader_navigation-title">{title}</h3>

			{action && (
				<button
					type={action.form ? 'submit' : 'button'}
					form={action.form}
					className="gang-leader_navigation-action"
					onClick={action.onClick}
				>
					<span>
						{typeof action.title === 'string'
							? action.title
							: React.createElement(action.title)}
					</span>
				</button>
			)}
		</div>
	);
}
