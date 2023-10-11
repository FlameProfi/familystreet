import React from 'react';
import { Field } from 'formik';
import { IoIosCloseCircle } from 'react-icons/io';

type Props = {
	type: 'text' | 'number';
	name: string;
	placeholder?: string;
};

export default function CustomInput({ type, name, placeholder }: Props) {
	return (
		<Field name={name} placeholder={placeholder}>
			{({ field, form }: any) => (
				<div className="gang-leader_input">
					<input type={type} {...field} />

					<IoIosCloseCircle
						className="gang-leader_input-reset"
						onClick={() => form.setFieldValue(name, type === 'text' ? '' : 0)}
					/>
				</div>
			)}
		</Field>
	);
}
