import React from 'react';
import classNames from 'classnames';
import { IconType } from 'react-icons';
import { IoIosPeople, IoIosStar, IoIosHome, IoIosWallet, IoIosCog } from 'react-icons/io';
import avatar from '../../../assets/images/avatar.png';

type Tab = {
	title: string;
	color: string;
	icon: IconType;
};

const tabs: { [key: string]: Tab } = {
	members: {
		title: 'Участники',
		color: '#007aff',
		icon: IoIosPeople
	},
	money: {
		title: 'Общак',
		color: '#5855d6',
		icon: IoIosWallet
	},
	ranks: {
		title: 'Ранги',
		color: '#ff9501',
		icon: IoIosStar
	},
	house: {
		title: 'Дом',
		color: '#ff3b2f',
		icon: IoIosHome
	},
	settings: {
		title: 'Настройки',
		color: '#8D8E92',
		icon: IoIosCog
	}
};

type Props = {
	name: string;
	rank: string;
	activeTab: string;
	openTab: (name: string) => void;
};

export default function Sidebar({ name, rank, activeTab, openTab }: Props) {
	return (
		<div className="gang-leader_sidebar">
			<h1>Меню банды</h1>

			<div className="profile">
				<img src={avatar} alt="avatar" />

				<div className="profile_text">
					<p className="name">{name}</p>
					<p className="rank">{rank}</p>
				</div>
			</div>

			<div className="tabs">
				<ul className="tabs_list">
					{Object.entries(tabs).map(([key, item]) => (
						<li
							className={classNames('tabs_list-item', { active: activeTab === key })}
							key={key}
							onClick={() => openTab(key)}
						>
							<div className="tabs_icon" style={{ backgroundColor: item.color }}>
								{React.createElement(item.icon)}
							</div>

							<h3 className="tabs_title">{item.title}</h3>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
