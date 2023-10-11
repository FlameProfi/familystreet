import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import rpc from 'rage-rpc';
import prettify from '../../../../utils/prettify';
import Navigation from '../navigation';
import Input from '../input';
import Button from '../button';

type State = {
	money: number;
};

export default class GangMoney extends Component<{}, State> {
	readonly state: State = {
		money: 0
	};

	componentDidMount() {
		rpc.callServer('Gang-GetMoney').then((money) => this.setState(() => ({ money })));
	}

	async moneyOperation(type: 'add' | 'withdraw', amount: number) {
		try {
			const money: number = await rpc.callServer('Gang-ChangeMoney', [type, amount]);

			this.setState(() => ({ money }));
		} catch (err) {
			console.error(err);
		}
	}

	render() {
		const { money } = this.state;

		return (
			<div className="gang-leader_money">
				<Navigation title="Общак" />

				<Button name="Состояние общака" selected={prettify.price(money)} />

				<div className="gang-leader_group">
					<h4 className="gang-leader_group-title">Финансовые операции</h4>

					<Formik
						initialValues={{ money: 0, type: 'add' }}
						validationSchema={Yup.object({
							money: Yup.number()
								.min(1)
								.max(100000000)
						})}
						onSubmit={(values) => this.moneyOperation(values.type as any, values.money)}
					>
						{(formik) => (
							<Form id="rank-editor">
								<Input type="number" name="money" placeholder="Сумма" />

								<div className="gang-leader_buttons">
									<Button
										name="Положить"
										action="add"
										onClick={() => {
											formik.setFieldValue('type', 'add');
											formik.submitForm();
										}}
									/>

									<Button
										name="Снять"
										action="delete"
										onClick={() => {
											formik.setFieldValue('type', 'withdraw');
											formik.submitForm();
										}}
									/>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
		);
	}
}
