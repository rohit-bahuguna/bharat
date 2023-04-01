import React from 'react';
import Select from 'react-select';

const RSelect = ({ options, defaultValue, getClassData, name }) => {
	return (
		<select onChange={getClassData} className="w-100 h-100" name={name}>
			<option value={defaultValue}>
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
	);
};

export default RSelect;
