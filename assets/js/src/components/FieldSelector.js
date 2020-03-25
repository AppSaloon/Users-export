import React from '@wordpress/element';
import { PanelRow, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { MultiSelectField } from './';

const FieldSelector = ( { value, onChange, fieldSelectors, ...props } ) => {
	const processChanges = ( changes ) => {
		const newValue = { ...value, ...changes };

		if ( newValue !== value ) {
			onChange( newValue );
		}
	};

	return (
		<>
			<PanelRow>
				{ fieldSelectors.loading ? (
					<Spinner />
				) : (
					<MultiSelectField
						label={ __( 'Standard user fields', 'asux' ) }
						controlLabel={ __(
							'Click or start typing to add fields',
							'asux'
						) }
						suggestions={ fieldSelectors.userFields }
						onChange={ ( tokens ) =>
							processChanges( { userFields: tokens } )
						}
						value={ value.userFields }
						help={ __(
							'Select the standard user fields to include as columns in the export file.',
							'asux'
						) }
						{ ...props }
					/>
				) }
			</PanelRow>
			<PanelRow>
				{ fieldSelectors.loading ? (
					<Spinner />
				) : (
					<MultiSelectField
						label={ __( 'Extra meta fields', 'asux' ) }
						controlLabel={ __(
							'Click or start typing to add fields',
							'asux'
						) }
						suggestions={ fieldSelectors.metaFields }
						onChange={ ( tokens ) =>
							processChanges( { metaFields: tokens } )
						}
						value={ value.metaFields }
						help={ __(
							'Select the extra user fields to include as columns in the export file.',
							'asux'
						) }
						{ ...props }
					/>
				) }
			</PanelRow>
		</>
	);
};

export default FieldSelector;
