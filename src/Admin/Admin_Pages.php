<?php
/**
 * users-export: Admin_Pages.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
 */

namespace appsaloon\ux\Admin;

class Admin_Pages {
	public const MENU_SLUG = 'as-export-users';
	private const DIST_DIR = 'dist/';

	public function __construct() {
		$this->register();
	}

	/**
	 * Register menu
	 *
	 * @since 1.0.0
	 */
	private function register() {
		add_action( 'admin_menu', array( $this, 'add_export_to_menu' ) );
	}

	/**
	 * Add "Export" entry to Users menu
	 *
	 * @since 1.0.0
	 */
	public function add_export_to_menu() {
		$page = add_users_page(
			__( 'Export users', 'asux' ),
			__( 'Export users', 'asux' ),
			'manage_options',
			static::MENU_SLUG,
			array( $this, 'render_export_page' )
		);

		add_action( 'admin_enqueue_scripts', array( $this, 'add_javascript_to_the_settings_page' ) );
	}

	public function add_javascript_to_the_settings_page() {
		if ( $_GET['page'] !== static::MENU_SLUG ) {
			return;
		}

		$export_asset_path = trailingslashit( asux_plugin()->getPath() ) . static::DIST_DIR . 'export.asset.php';
		$export_asset_url  = trailingslashit( asux_plugin()->getUrl() ) . static::DIST_DIR;
		$asset_details     = require $export_asset_path;

		wp_enqueue_script(
			'asux/export',
			$export_asset_url . 'export.js',
			$asset_details['dependencies'],
			$asset_details['version'],
			true
		);

		wp_enqueue_style(
			'asux/export',
			$export_asset_url . 'export.css',
			[ 'wp-components' ],
			$asset_details['version']
		);
	}

	public function render_export_page() {
		echo '<div id="asux-export-root" class="asux"></div>';
	}
}
