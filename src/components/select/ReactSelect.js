import React from 'react';

const RSelect = ({ options, defaultValue, getClassData, name }) => {
	return (
		<div className="form-group  field-focus-box-shadow">
			<select
				onChange={getClassData}
				className="custom-select  form-control-wrap field-padding-y-lg  w-100"
				name={name}>
				<option
					value={defaultValue}
					className="field-padding-y-lg field-font-weight field-font-size">
					{defaultValue}
				</option>
				{options.map(value => {
					return (
						<option value={value.value}>
							{value.name}
						</option>
					);
				})}
			</select>
		</div>
	);
};

export default RSelect;
