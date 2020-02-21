<?php
/*
Plugin Name: User Export - AppSaloon
Plugin URI:
Description: Exports user to csv file
Version: 1.0.0
Author: AppSaloon
Author URI: https://www.appsaloon.be/
*/

define( 'ASUX_PLUGIN_FILE', __FILE__ );
define( 'ASUX_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'ASUX_PLUGIN_SLUG', dirname( plugin_basename( __FILE__ ) ) );
define( 'ASUX_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'ASUX_PLUGIN_VERSION', '1.0.0' );

use \appsaloon\ux\menu\Add_User_Export_Menu;

require ASUX_PLUGIN_DIR . 'vendor/autoload.php';

( new Add_User_Export_Menu() )->register();