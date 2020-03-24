<?php
/**
 * users-export: Config_Manager.php
 *
 * @author Koen Van den Wijngaert <koen@neok.be>
*/


namespace appsaloon\ux;

use RuntimeException;

class Config_Manager {
	private const CONFIG_DIR = 'config/';

	/**
	 * @var array
	 */
	private $config = [];

	/**
	 * @var string
	 */
	private $config_path;

	public function __construct( string $config_path = '' ) {
		$this->config_path = trailingslashit( $config_path );
	}

	/**
	 * Retrieve configuration by key. This represents a file in the config dir.
	 *
	 * @param string $config_key
	 *
	 * @return array|null
	 */
	public function get_config( string $config_key ): ?array {
		if ( ! isset( $this->config[ $config_key ] ) ) {
			$this->get_config_from_file( $config_key );
		}

		return $this->config[ $config_key ];
	}

	/**
	 * Get configuration from a file and store it in memory.
	 *
	 * @param $config_key
	 * @param string $config_type
	 */
	private function get_config_from_file( $config_key, $config_type = 'php' ): void {
		$config_file = $this->config_path . static::CONFIG_DIR . "{$config_key}.{$config_type}";

		if ( ! file_exists( $config_file ) ) {
			throw new RuntimeException(
				sprintf( 'Unable to locate config file "%s".', $config_file )
			);
		}

		$this->config[ $config_key ] = (array) include $config_file;
	}
}
