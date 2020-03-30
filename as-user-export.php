<?php
/*
Plugin Name: User Export - AppSaloon
Plugin URI:
Description: Exports user to csv file
Version: 1.0.3
Author: AppSaloon
Author URI: https://www.appsaloon.be/
*/

define( 'ASUX_PLUGIN_FILE', __FILE__ );
define( 'ASUX_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'ASUX_PLUGIN_SLUG', dirname( plugin_basename( __FILE__ ) ) );
define( 'ASUX_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'ASUX_PLUGIN_VERSION', '1.0.3' );

if ( ! file_exists( ASUX_PLUGIN_DIR . 'vendor/autoload.php' ) ) {
	// Fail early if no dependencies were found. Before attempting to load classes.
	wp_die( __( 'Class autoloader not found. Did you run `composer install`?', 'asux' ) );
}

require_once ASUX_PLUGIN_DIR . 'vendor/autoload.php';
require_once ASUX_PLUGIN_DIR . 'lib/filters.php';

use appsaloon\ux\Plugin;

$GLOBALS['asux'] = new Plugin( ASUX_PLUGIN_DIR, ASUX_PLUGIN_URL, ASUX_PLUGIN_VERSION );

/**
 * @return Plugin
 */
function asux_plugin() {
	return $GLOBALS['asux'];
}
