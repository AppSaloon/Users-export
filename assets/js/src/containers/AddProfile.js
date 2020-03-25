/**
 * WordPress Dependencies
 */
import React, { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	Button,
	Panel,
	PanelBody,
	PanelHeader,
	PanelRow,
	TextControl,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import {
	DateFieldWithPicker,
	FieldSelector,
	RoleSelector,
} from '../components';
import { useDispatch } from '@wordpress/data';

const defaultProfileFields = {
	name: '',
	selectors: {
		userFields: [
			'ID',
			'user_login',
			'user_nicename',
			'user_email',
			'user_url',
			'user_registered',
			'user_status',
			'display_name',
		],
		metaFields: [
			'last_name',
			'first_name',
			'nickname',
			'description',
			'wp_user_level',
		],
	},
	filters: {
		roles: [
			'administrator',
			'editor',
			'author',
			'contributor',
			'subscriber',
		],
		registrationDate: {
			before: null,
			after: null,
		},
	},
};

const AddProfile = ( { navigateToTab } ) => {
	const [ profileName, setProfileName ] = useState(
		defaultProfileFields.name
	);
	const [ profileSelectors, setProfileSelectors ] = useState(
		defaultProfileFields.selectors
	);
	const [ profileRolesFilter, setProfileRolesFilter ] = useState(
		defaultProfileFields.filters.roles
	);
	const [
		profileRegistrationDateFilter,
		setProfileRegistrationDateFilter,
	] = useState( defaultProfileFields.filters.registrationDate );

	const { saveEntityRecord } = useDispatch( 'core' );

	const formatTimeStamp = ( date ) => {
		if ( ! date ) return 0;

		return new Date( date ).getTime() / 1000;
	};

	const onSubmit = useCallback( async ( e ) => {
		e.preventDefault();

		if ( profileName.length < 3 ) {
			return alert( __( 'Please enter a profile name', 'asux' ) );
		}

		const postData = {
			title: profileName,
			status: 'publish',
			meta: {
				_asux_fields: profileSelectors.userFields,
				_asux_meta_fields: profileSelectors.metaFields,
				_asux_filter_roles: profileRolesFilter,
				_asux_filter_date_before: formatTimeStamp(
					profileRegistrationDateFilter.before
				),
				_asux_filter_date_after: formatTimeStamp(
					profileRegistrationDateFilter.after
				),
			},
		};

		await saveEntityRecord( 'postType', 'asux_export-profile', postData );
		navigateToTab( 'profiles' );
	} );

	return (
		<div className="asux__profile-container">
			<h2 className="asux__tab-title">
				{ __( 'Add new profile', 'asux' ) }
			</h2>
			<form onSubmit={ onSubmit }>
				<Panel>
					<PanelHeader>
						<h3>{ __( 'General settings', 'asux' ) }</h3>
					</PanelHeader>
					<PanelBody>
						<PanelRow>
							<TextControl
								className="asux__form-control"
								label={ __( 'Profile name', 'asux' ) }
								placeholder={ __( 'New profile', 'asux' ) }
								value={ profileName }
								help={ __(
									'Give this profile a name, so you can recognize it later.',
									'asux'
								) }
								onChange={ ( name ) =>
									setProfileName( name.trim() )
								}
								autoFocus
							/>
						</PanelRow>
					</PanelBody>
					<PanelHeader>
						<h3>{ __( 'Display options', 'asux' ) }</h3>
					</PanelHeader>
					<PanelBody>
						<FieldSelector
							value={ profileSelectors }
							onChange={ ( selectors ) =>
								setProfileSelectors( selectors )
							}
						/>
					</PanelBody>
					<PanelHeader>
						<h3>{ __( 'Filter options', 'asux' ) }</h3>
					</PanelHeader>
					<PanelBody>
						<PanelRow>
							<header>
								<h3>{ __( 'Filter by user role', 'asux' ) }</h3>
								<p>
									{ __(
										'Optionally filter the export output by user role.',
										'asux'
									) }
								</p>
							</header>
						</PanelRow>
						<RoleSelector
							value={ profileRolesFilter }
							onChange={ ( rolesFilter ) =>
								setProfileRolesFilter( rolesFilter )
							}
						/>
						<PanelRow>
							<header>
								<h3>
									{ __(
										'Filter by registration date',
										'asux'
									) }
								</h3>
								<p>
									{ __(
										'Optionally filter the user export based on the registration date.',
										'asux'
									) }
								</p>
							</header>
						</PanelRow>
						<PanelRow className="asux__filter-dates">
							<DateFieldWithPicker
								label={ __( 'Registered before', 'asux' ) }
								value={ profileRegistrationDateFilter.before }
								help={ __(
									'Include users registered before this date.',
									'asux'
								) }
								onChange={ ( before ) =>
									setProfileRegistrationDateFilter(
										( filter ) => ( { ...filter, before } )
									)
								}
							/>
							<DateFieldWithPicker
								label={ __( 'Registered after', 'asux' ) }
								value={ profileRegistrationDateFilter.after }
								help={ __(
									'Include users registered after this date.',
									'asux'
								) }
								onChange={ ( after ) =>
									setProfileRegistrationDateFilter(
										( filter ) => ( { ...filter, after } )
									)
								}
							/>
						</PanelRow>
						<PanelRow>
							<Button
								isPrimary
								isLarge
								label={ __( 'Add profile', 'asux' ) }
								type="submit"
							>
								{ __( 'Add profile', 'asux' ) }
							</Button>
						</PanelRow>
					</PanelBody>
				</Panel>
			</form>
		</div>
	);
};

export default AddProfile;
