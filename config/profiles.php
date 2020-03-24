<?php
/**
 * users-export: profiles.php
 */

use appsaloon\ux\Export\Profile_Manager;

return [
	// <editor-fold desc="Post type">
	[
		Profile_Manager::TYPE,
		[
			'labels'       => [
				'name'               => __( 'Export profiles', 'asux' ),
				'singular_name'      => __( 'Export profile', 'asux' ),
				'add_new'            => __( 'Add New', 'asux' ),
				'add_new_item'       => __( 'Create New Export profile', 'asux' ),
				'edit'               => __( 'Edit', 'asux' ),
				'edit_item'          => __( 'Edit Export profile', 'asux' ),
				'new_item'           => __( 'New Export profile', 'asux' ),
				'view'               => __( 'View', 'asux' ),
				'view_item'          => __( 'View Export profile', 'asux' ),
				'search_items'       => __( 'Search Export profiles', 'asux' ),
				'not_found'          => __( 'No export profiles found', 'asux' ),
				'not_found_in_trash' => __( 'No export profiles found in Trash', 'asux' ),
				'parent_item_colon'  => __( 'Parent Export profile:', 'asux' ),
			],
			'rewrite'      => false,
			'supports'     => [ 'title', 'custom-fields' ],
			'public'       => false,
			'show_ui'      => true,
			'can_export'   => true,
			'hierarchical' => false,
			'query_var'    => false,
			'menu_icon'    => 'dashicons-share-alt2',
			'has_archive'  => false,
			'show_in_menu' => false,
			'show_in_rest' => true,
			'rest_base'    => Profile_Manager::TYPE,
		],
	],
	// </editor-fold>
	// <editor-fold desc="Meta fields">
	[
		'_asux_last_run'    => [
			'type'              => 'integer',
			'description'       => __( 'Timestamp of when the profile was last run.', 'asux' ),
			'single'            => true,
			'show_in_rest'      => true,
		],
		'_asux_filter_roles'     => [
			'type'              => 'array',
			'description'       => __( 'Roles to filter the export by.', 'asux' ),
			'single'            => true,
			'auth_callback' => '__return_true',
			'show_in_rest'      => [
				'schema' => [
					'type'  => 'array',
					'items' => [
						'type' => 'string',
					],
				],
			],
			'sanitize_callback' => static function ( $submitted_roles ) {
				$roles = Profile_Manager::get_user_roles();

				return array_filter($submitted_roles, static function($submitted_role) use ($roles) {
						return array_key_exists($submitted_role, $roles);
				});
			},
		],
		'_asux_filter_date_before'     => [
			'type'              => 'integer',
			'description'       => __( 'Timestamp to filter registered before date.', 'asux' ),
			'single'            => true,
			'show_in_rest'      => true,
			'auth_callback' => '__return_true',
		],
		'_asux_filter_date_after'     => [
			'type'              => 'integer',
			'description'       => __( 'Timestamp to filter registered after date.', 'asux' ),
			'single'            => true,
			'show_in_rest'      => true,
			'auth_callback' => '__return_true',
		],
		'_asux_fields'      => [
			'type'          => 'array',
			'description'   => __( 'User fields to be included in the export.', 'asux' ),
			'single'        => true,
			'auth_callback' => '__return_true',
			'show_in_rest'  => [
				'schema' => [
					'type'  => 'array',
					'items' => [
						'type' => 'string',
					],
				],
			],
			'sanitize_callback' => static function ( $submitted_fields ) {
				$fields = Profile_Manager::get_available_fields()->user_fields;

				return array_filter($submitted_fields, static function($submitted_field) use ($fields) {
					return in_array($submitted_field, $fields, true);
				});
			},
		],
		'_asux_meta_fields' => [
			'type'          => 'array',
			'description'   => __( 'User meta fields to be included in the export.', 'asux' ),
			'single'        => true,
			'auth_callback' => '__return_true',
			'show_in_rest'  => [
				'schema' => [
					'type'  => 'array',
					'items' => [
						'type' => 'string',
					],
				],
			],
			'sanitize_callback' => static function ( $submitted_fields ) {
				$fields = Profile_Manager::get_available_fields()->meta_fields;

				return array_filter($submitted_fields, static function($submitted_field) use ($fields) {
					return in_array($submitted_field, $fields, true);
				});
			},
		],
	],
	// </editor-fold>
];
