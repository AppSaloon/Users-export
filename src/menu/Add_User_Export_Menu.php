<?php

namespace appsaloon\ux\menu;

use appsaloon\ux\helper\Helper;

class Add_User_Export_Menu {

	CONST MENU_SLUG = 'as-export-users';

	/**
	 * Register menu
	 *
	 * @since 1.0.0
	 */
	public function register() {
		add_action( 'admin_menu', array( $this, 'add_submenu' ) );
	}

	/**
	 * User submenu added
	 *
	 * @since 1.0.0
	 */
	public function add_submenu() {
		$page = add_users_page(
			'Export users',
			'Export users',
			'manage_options',
			static::MENU_SLUG,
			array( $this, 'menu_content' )
		);

		add_action( 'load-' . $page, array( $this, 'add_javascript_to_the_settings_page' ) );
	}

	public function add_javascript_to_the_settings_page() {
		wp_enqueue_script( 'user-export-settings', ASUX_PLUGIN_URL . 'assets/js/user-export-settings.js' );
	}

	/**
	 * Output menu content
	 *
	 * @since 1.0.0
	 */
	public function menu_content() {
		if( isset( $_POST['btnSave'] ) ) {
			var_dump( $_POST );
			die;
		}
		$profile_id = ( isset( $_GET['asux_profile'] ) ) ? sanitize_text_field( $_GET['asux_profile'] ) : '';

		if ( $profile_id !== '' ) {
			if ( $profile_id !== "-1" ) {
				// get profile
				$profile = Helper::get_profile_by_id( $profile_id );
			}

			$user_fields = $this->get_user_fields();

			require_once ASUX_PLUGIN_DIR . "templates/backend/settings/export.php";

			// stop here
			return;
		}

		$url      = Helper::reconstruct_url();
		$profiles = Helper::get_profiles();

		require_once ASUX_PLUGIN_DIR . "templates/backend/settings/profiles.php";
	}

	/**
	 * Returns user fields
	 *
	 * The field result will be cached for 5 minutes
	 *
	 * @return array|bool|mixed
	 *
	 * @since 1.0.0
	 */
	private function get_user_fields() {
		$user_fields = get_transient( 'asux_user_fields' );

		if ( $user_fields === false ) {
			$user_fields = array(
				'ID',
				'user_login',
				'user_pass',
				'user_nicename',
				'user_email',
				'user_url',
				'user_registered',
				'user_activation_key',
				'user_status',
				'display_name',
			);

			$user_meta_fields = $this->get_user_meta_fields();

			if ( $user_meta_fields !== false ) {
				$user_fields = array_merge( $user_fields, $user_meta_fields );
			}

			set_transient( 'asux_user_fields', $user_fields, 5 * 60 );
		}


		return $user_fields;
	}

	/**
	 * Returns all meta fields for an user
	 *
	 * @return array|bool
	 *
	 * @since 1.0.0
	 */
	private function get_user_meta_fields() {
		global $wpdb;

		$query = "SELECT GROUP_CONCAT(distinct(meta_key)) as fields FROM " . $wpdb->usermeta;

		$result = $wpdb->get_results( $query, ARRAY_A );

		if ( empty( $result ) ) {
			return false;
		}

		return explode( ',', $result[0]['fields'] );
	}
}