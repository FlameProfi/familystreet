import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';

export const ModalContext = React.createContext<{
	show: (title: string, description: string, confirm: () => any) => void;
}>({ show: null as any });

type State = typeof initialState;

const initialState = {
	show: false,
	title: '',
	description: '',
	confirm: () => {}
};

export default class Modal extends Component<{}, State> {
	readonly state: State = initialState;

	show(title: string, description: string, confirm: () => any) {
		this.setState(() => ({ show: true, title, description, confirm }));
	}

	hide() {
		this.setState(() => initialState);
	}

	confirm() {
		this.state.confirm();
		this.hide();
	}

	render() {
		const { show, title, description } = this.state;

		return (
			<CSSTransition
				in={show}
				timeout={{ appear: 300, enter: 300, exit: 0 }}
				classNames="alert"
				unmountOnExit
			>
				<div className="gang-leader_modal">
					<div className="gang-leader_modal-container">
						<h3 className="gang-leader_modal-title">{title}</h3>
						<p className="gang-leader_modal-descr">{description}</p>

						<div className="gang-leader_modal-buttons">
							<button onClick={this.hide.bind(this)}>Отменить</button>
							<button
								className="gang-leader_modal-confirm"
								onClick={this.confirm.bind(this)}
							>
								ОК
							</button>
						</div>
					</div>
				</div>
			</CSSTransition>
		);
	}
}
