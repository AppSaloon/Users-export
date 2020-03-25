import React from '@wordpress/element';
import { BaseControl } from '@wordpress/components';
import { SelectControl } from '@woocommerce/components';
import { prettifyField } from './FieldSelector';
import sortBy from 'lodash/sortBy';
import { __ } from '@wordpress/i18n';

const suggestionsToOptions = ( suggestions, values ) => {
	if ( typeof suggestions === 'object' ) {
		return Object.entries( suggestions ).map( ( [ key, label ] ) => ( {
			key: key,
			label: label,
			value: { id: key },
			isDisabled: values.includes( key ),
		} ) );
	}

	return suggestions.map( ( suggestion ) => ( {
		key: suggestion,
		label: prettifyField( suggestion ),
		value: { id: suggestion },
		isDisabled: values.includes( suggestion ),
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
