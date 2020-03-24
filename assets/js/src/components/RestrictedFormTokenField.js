import { FormTokenField } from '@wordpress/components';
import React from '@wordpress/element';

const RestrictedFormTokenField = ( {
	value,
	suggestions,
	onChange,
	...props
} ) => {
	const filterFormTokens = ( tokens ) =>
		tokens.filter( ( token ) => suggestions.includes( token ) );

	return (
		<FormTokenField
			suggestions={ suggestions }
			value={ value }
			onChange={ ( tokens ) => onChange( filterFormTokens( tokens ) ) }
			{ ...props }
		/>
	);
};

export default RestrictedFormTokenField;
