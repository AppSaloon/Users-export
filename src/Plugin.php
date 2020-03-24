<?php
/**
 * users-export: Plugin.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
*/

namespace appsaloon\ux;

use appsaloon\ux\Admin\Admin_Pages;
use appsaloon\ux\Export\Export_Manager;
use appsaloon\ux\Export\Profile_Manager;

/**
 * Class Plugin
 *
 * Main plugin logic is contained here.
 *
 * @package appsaloon\ux
 */
class Plugin {
	/** @var string */
	private $path;

	/** @var string */
	private $url;

	/** @var string */
	private $version;

	/** @var Config_Manager */
	private $config_manager;

	/** @var Admin_Pages */
	private $admin_pages;

	/** @var Profile_Manager */
	private $profile_manager;

	/** @var Export_Manager */
	private $export_manager;

	public function __construct( string $path, string $url, string $version = '1.0.0' ) {
		$this->path    = $path;
		$this->url     = $url;
		$this->version = $version;

		$this->initialize();
	}

	private function initialize(): void {
		$this->config_manager  = new Config_Manager( $this->getPath() );
		$this->admin_pages     = new Admin_Pages();
		$this->export_manager  = new Export_Manager();
		$this->profile_manager = new Profile_Manager( $this->config( 'profiles' ) );
	}

	public function getPath(): string {
		return $this->path;
	}

	//<editor-fold desc="Accessors">

	public function config( string $config_key, $default = [] ): array {
		return $this->config_manager->get_config( $config_key ) ?? $default;
	}

	public function getUrl(): string {
		return $this->url;
	}

	public function getVersion(): string {
		return $this->version;
	}
	//</editor-fold>

}
