import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { StoreState } from '../../../store';
import StatusBar from './status-bar';
import Sidebar from './sidebar';
import House from './house';
import Members from './members';
import Ranks from './ranks';
import Money from './money';
import Settings from './settings';
import Modal, { ModalContext } from './modal';

type Props = {} & ReturnType<typeof mapStateToProps> & RouteComponentProps;
type State = {
	activeTab: string;
	name: string;
	rank: string;
};

class GangLeader extends Component<Props, State> {
	readonly state: State = {
		activeTab: 'members',
		name: '',
		rank: ''
	};

	modal = React.createRef<Modal>();

	componentDidMount() {
		this.setState(() => this.props.location.state);
	}

	openTab(name: string) {
		this.setState(() => ({ activeTab: name }));
	}

	showModal(title: string, description: string, confirm: () => any) {
		if (this.modal.current) {
			this.modal.current.show(title, description, confirm);
		}
	}

	getTabComponent() {
		switch (this.state.activeTab) {
			case 'house':
				return <House />;
			case 'members':
				return <Members />;
			case 'ranks':
				return <Ranks />;
			case 'money':
				return <Money />;
			default:
				return <Settings />;
		}
	}

	render() {
		const { activeTab, name, rank } = this.state;

		return (
			<ModalContext.Provider
				value={{
					show: this.showModal.bind(this)
				}}
			>
				<div className="gang-leader">
					<div className="gang-leader_container">
						<StatusBar date={this.props.date} />

						<div className="gang-leader_content">
							<Sidebar
								activeTab={activeTab}
								name={name}
								rank={rank}
								openTab={this.openTab.bind(this)}
							/>

							<div className="gang-leader_tab">{this.getTabComponent()}</div>
						</div>

						<Modal ref={this.modal} />
					</div>
				</div>
			</ModalContext.Provider>
		);
	}
}

const mapStateToProps = (state: StoreState) => ({
	date: state.app.date
});

export default connect(mapStateToProps, {})(GangLeader);
