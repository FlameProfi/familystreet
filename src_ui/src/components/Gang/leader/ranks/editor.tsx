import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { trim } from 'lodash';
import Navigation from '../navigation';
import Input from '../input';
import Button from '../button';
import { Rank } from './index';

type Props = {
	rank?: Rank;
	create: (data: Rank) => Promise<void>;
	update: (name: string, data: Rank) => Promise<void>;
	remove: (name: string) => Promise<void>;
	close: () => void;
};

const permissions = {
	inventory: 'Доступ к складу',
	house: 'Доступ к дому'
};

export default class RankEditor extends Component<Props, {}> {
	save(data: Rank) {
		const { create, update, rank } = this.props;

		if (rank) update(rank.name, data);
		else create(data);
	}

	getInitialFormValues() {
		const { rank } = this.props;
		const defaultPremissions = {
			inventory: false,
			house: false
		};

		return rank
			? { ...rank, permissions: { ...defaultPremissions, ...rank.permissions } }
			: { name: '', permissions: defaultPremissions };
	}

	render() {
		const { rank, remove, close } = this.props;

		return (
			<div className="gang-leader_rank-editor">
				<Navigation
					title="Редактор ранга"
					close={{ title: 'Ранги', onClick: close }}
					action={{ title: 'Готово', form: 'rank-editor' }}
				/>

				<Formik
					initialValues={this.getInitialFormValues() as any}
					validationSchema={Yup.object({
						name: Yup.string()
							.required()
							.max(32)
					})}
					onSubmit={(values: Rank) => this.save({ ...values, name: trim(values.name) })}
				>
					<Form id="rank-editor">
						<Input type="text" name="name" placeholder="Название" />

						<div className="gang-leader_list">
							{Object.entries(permissions).map(([key, title]) => (
								<Button className="gang-leader_list-item" name={title} key={key}>
									<Field
										type="checkbox"
										name={`permissions.${key}`}
										className="apple-switch"
									/>
								</Button>
							))}
						</div>

						{rank && (
							<Button
								name="Удалить ранг"
								action="delete"
								onClick={() => remove(rank._id)}
							/>
						)}
					</Form>
				</Formik>
			</div>
		);
	}
}
