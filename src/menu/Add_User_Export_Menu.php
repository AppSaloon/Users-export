<?php

namespace appsaloon\ux\menu;

class Add_User_Export_Menu {

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
		add_users_page(
			'Export users',
			'Export users',
			'manage_options',
			'as-export-users',
			array( $this, 'menu_content' )
		);
	}

	/**
	 * Output menu content
	 *
	 * @since 1.0.0
	 */
	public function menu_content() {
		$user_fields = $this->get_user_fields();

		require_once ASUX_PLUGIN_DIR . "templates/backend/add-user-export-setting-content.php";
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