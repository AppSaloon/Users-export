import React, { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { AddProfile, Profiles } from './';
import { TabPanel } from '../components';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

const onSelect = () => {
	return <>Selected</>;
};

const App = () => {
	return (
		<>
			<div className="asux__top-bar">
				<h1 className="asux__page-title">
					{ __( 'AppSaloon User Exporter', 'asux' ) }
				</h1>
			</div>
			<Tabs />
		</>
	);
};

const Tabs = ( { initialTabName = 'profiles' } ) => {
	const tabClassName = 'asux__main-tabs-tab';

	const [ fieldSelectors, setFieldSelectors ] = useState( {
		loading: true,
		userFields: [],
		metaFields: [],
	} );

	const [ roles, setRoles ] = useState( {
		loading: true,
		roles: {},
	} );

	const profiles = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords(
				'postType',
				'asux_export-profile',
				{
					per_page: -1,
					orderby: 'modified',
					order: 'desc',
				}
			),
		[]
	);

	useEffect( () => {
		let mounted = true;

		( async () => {
			const request = await apiFetch( {
				path: `/asux/v1/fields`,
			} );

			if ( request.success && mounted ) {
				const {
					user_fields: userFields,
					meta_fields: metaFields,
				} = request.data;

				setFieldSelectors( {
					loading: false,
					userFields,
					metaFields,
				} );
			}
		} )();

		return () => {
			mounted = false;
		};
	}, [] );

	useEffect( () => {
		let mounted = true;

		( async () => {
			const request = await apiFetch( {
				path: `/asux/v1/roles`,
			} );

			if ( request.success && mounted ) {
				setRoles( {
					loading: false,
					roles: request.data,
				} );
			}
		} )();

		return () => {
			mounted = false;
		};
	}, [] );

	return (
		<TabPanel
			className="asux__main-tabs"
			activeClass="is-active"
			onSelect={ onSelect }
			initialTabName={ initialTabName }
			tabs={ [
				{
					name: 'profiles',
					title: __( 'Export profiles', 'asux' ),
					className: tabClassName,
					component: ( { navigateToTab } ) => (
						<Profiles
							profiles={ profiles }
							navigateToTab={ navigateToTab }
						/>
					),
				},
				{
					name: 'add_profile',
					title: __( 'Add profile', 'asux' ),
					className: tabClassName,
					component: ( { navigateToTab } ) => (
						<AddProfile
							fieldSelectors={ fieldSelectors }
							roles={ roles }
							navigateToTab={ navigateToTab }
						/>
					),
				},
			] }
		>
			{ ( tab, navigateToTab ) => (
				<tab.component navigateToTab={ navigateToTab } />
			) }
		</TabPanel>
	);
};

export default App;
