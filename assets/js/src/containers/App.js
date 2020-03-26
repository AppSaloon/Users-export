import React, { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { AddProfile, Profiles } from './';
import { TabPanel } from '../components';
import { useDispatch, useSelect } from '@wordpress/data';
import uniqBy from 'lodash/uniqBy';
import apiFetch from '@wordpress/api-fetch';

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
	const [ currentTab, setCurrentTab ] = useState( initialTabName );

	const [ fieldSelectors, setFieldSelectors ] = useState( {
		loading: true,
		userFields: [],
		metaFields: [],
	} );

	const [ roles, setRoles ] = useState( {
		loading: true,
		roles: {},
	} );

	const [ profiles, setProfiles ] = useState( {
		loading: true,
		profiles: [],
		trashed: [], // don't ask.
	} );

	const exportProfileQuery = [
		'postType',
		'asux_export-profile',
		{
			per_page: -1,
			status: 'publish',
			orderby: 'modified',
			order: 'desc',
		},
	];

	const { saveEntityRecord, invalidateResolutionForStore } = useDispatch(
		'core'
	);

	const fetchedProfiles = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( ...exportProfileQuery ),
		[ exportProfileQuery ]
	);

	const loadingFinished = useSelect(
		( select ) =>
			select( 'core' ).hasFinishedResolution(
				'getEntityRecords',
				exportProfileQuery
			),
		[ exportProfileQuery ]
	);

	useEffect( () => {
		if ( loadingFinished ) {
			setProfiles( ( currentProfiles ) => ( {
				...currentProfiles,
				loading: false,
				profiles: uniqBy( fetchedProfiles, ( { id } ) => id ).filter(
					( { id } ) => ! currentProfiles.trashed.includes( id )
				),
			} ) );
		}
	}, [ loadingFinished, fetchedProfiles ] );

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

	const addNewProfileEntity = async ( postData ) => {
		await saveEntityRecord( 'postType', 'asux_export-profile', postData );

		setCurrentTab( 'profiles' );
	};

	const trashProfile = ( id ) => {
		( async ( id ) => {
			try {
				await apiFetch( {
					path: `/wp/v2/asux_export-profile/${ id }`,
					method: 'DELETE',
				} );
			} catch ( error ) {
				console.error( 'unable to trash profile' );
				console.error( error );
			}

			setProfiles( ( currentProfiles ) => ( {
				...currentProfiles,
				trashed: [ id, ...currentProfiles.trashed ],
			} ) );

			invalidateResolutionForStore();
		} )( id );
	};

	const onSelectTab = ( tabName ) => {
		setCurrentTab( tabName );
	};

	return (
		<TabPanel
			className="asux__main-tabs"
			activeClass="is-active"
			onSelect={ onSelectTab }
			initialTabName={ currentTab }
			tabs={ [
				{
					name: 'profiles',
					title: __( 'Export profiles', 'asux' ),
					className: tabClassName,
					component: Profiles,
					componentProps: {
						profiles,
						onProfileTrash: trashProfile,
					},
				},
				{
					name: 'add_profile',
					title: __( 'Add profile', 'asux' ),
					className: tabClassName,
					component: AddProfile,
					componentProps: {
						fieldSelectors,
						roles,
						onProfileAdd: ( postData ) =>
							addNewProfileEntity( postData ),
					},
				},
			] }
		>
			{ ( tab ) => <tab.component { ...tab.componentProps } /> }
		</TabPanel>
	);
};

export default App;
