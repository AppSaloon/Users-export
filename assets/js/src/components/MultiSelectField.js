import React from '@wordpress/element';
import { BaseControl } from '@wordpress/components';
import { SelectControl } from '@woocommerce/components';
import sortBy from 'lodash/sortBy';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import { __ } from '@wordpress/i18n';
import { prettifyField } from '../util';

const suggestionsToOptions = ( suggestions, values ) => {
	if ( isArray( suggestions ) ) {
		return suggestions.map( ( suggestion ) => {
			if(isObject(suggestion)) {
				const {key, label} = suggestion
				return {
					key,
					label,
					value: { id: key },
					isDisabled: values.includes( key ),
				}
			}
			return {
				key: suggestion,
				label: prettifyField( suggestion ),
				value: { id: suggestion },
				isDisabled: values.includes( suggestion ),
			}
		} );
	}

	return Object.entries( suggestions ).map( ( [ key, label ] ) => ( {
		key: key,
		label: label,
		value: { id: key },
		isDisabled: values.includes( key ),
	} ) );
};

const prepareValues = ( values, options = [] ) => {
	const findLinkedOption = ( value ) =>
		options.find( ( { key } ) => key === value );

	return values.map( ( value ) => {
		const linkedOption = findLinkedOption( value );

		return {
			key: value,
			value: { id: value },
			label: linkedOption ? linkedOption.label : prettifyField( value ),
		};
	} );
};

const MultiSelectField = ( {
	value = [],
	suggestions,
	onChange,
	placeholder = __(
		'Select an option from the list, or start typing to search for one.',
		'asux'
	),
	label,
	controlLabel,
	help,
	...props
} ) => {
	const options = suggestionsToOptions( suggestions, value );

	const processSelectionChanges = function( changes ) {
		return onChange( changes.map( ( { value: { id } } ) => id ) );
	};

	return (
		<BaseControl help={ help } label={ label } { ...props }>
			<SelectControl
				options={ sortBy( options, [ 'isDisabled' ] ) }
				selected={ prepareValues( value, options ) }
				onChange={ ( changes ) => processSelectionChanges( changes ) }
				multiple
				showClearButton
				isSearchable
				excludeSelectedOptions
				placeholder={ placeholder }
				label={ controlLabel }
				{ ...props }
			/>
		</BaseControl>
	);
};

export default MultiSelectField;
