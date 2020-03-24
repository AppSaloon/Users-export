import React, { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { AddProfile, Profiles } from './';
import { TabPanel } from '../components';

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
					component: Profiles,
				},
				{
					name: 'add_profile',
					title: __( 'Add profile', 'asux' ),
					className: tabClassName,
					component: AddProfile,
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
