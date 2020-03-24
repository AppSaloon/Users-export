import React, { useEffect, useState } from '@wordpress/element';
import { PanelRow, FormTokenField } from '@wordpress/components';
import { __, _n, sprintf } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { RestrictedFormTokenField } from './';

const RoleSelector = ( { value, ...props } ) => {
	const [ isLoading, setLoading ] = useState( true );
	const [ roles, setRoles ] = useState( {} );

	useEffect( () => {
		let mounted = true;

		( async () => {
			const request = await apiFetch( {
				path: `/asux/v1/roles`,
			} );

			if ( request.success && mounted ) {
				setRoles( request.data );
				setLoading( false );
			}
		} )();

		return () => {
			mounted = false;
		};
	}, [] );

	const roleKeys = Object.keys( roles );

	return (
		<>
			<PanelRow>
				<RestrictedFormTokenField
					disabled={ isLoading }
					label={ __( 'User role', 'asux' ) }
					placeholder={ __(
						'What user role would you like to filter on?',
						'asux'
					) }
					suggestions={ roleKeys }
					value={ value }
					displayTransform={ ( token ) =>
						roles[ token ] ? roles[ token ] : token
					}
					{ ...props }
				/>
			</PanelRow>
		</>
	);
};

export default RoleSelector;
