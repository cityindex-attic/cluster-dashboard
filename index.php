<?php
/*
  Plugin Name: Cluster Dashboard
  Plugin URI: http://github.com/...
  Description: Colection of load tests
  Version: 0.1
  Author: David Laing
  Author URI: http://davidlaing.com/

  License: GPLv2 ->

  Copyright 2012 Ryan Holder (ryan@ryanholder.com)

  This program is free software; you can redistribute it and/or modify
  it under the terms of the GNU General Public License, version 2, as
  published by the Free Software Foundation.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program; if not, write to the Free Software
  Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA

 */

define('CLUSTERDASHBOARD_DIR', dirname(__FILE__));
define('CLUSTERDASHBOARD_URL', plugin_dir_url(__FILE__));
define('CLUSTERDASHBOARD_VERSION', "0.1");

/* The plugin requires the wordpress-social-login to be installed and activated */
require_once( dirname(__FILE__) . "/../wordpress-social-login/hybridauth/Hybrid/Auth.php" );

class ClusterDashboard_Admin_Area {
	/* --------------------------------------------*
	 * Constructor
	 * -------------------------------------------- */

	/**
	 * Initializes the plugin by setting localization, filters, and administration functions.
	 */
	function __construct() {
		// Register admin styles and scripts
		add_action('admin_print_styles', array($this, 'register_admin_styles'));
		add_action('admin_enqueue_scripts', array($this, 'register_admin_scripts'));

		// Register site styles and scripts
		add_action('wp_enqueue_scripts', array($this, 'register_plugin_styles'));
		add_action('wp_enqueue_scripts', array($this, 'register_plugin_scripts'));

		register_activation_hook(__FILE__, array($this, 'activate'));
		register_deactivation_hook(__FILE__, array($this, 'deactivate'));

		add_action('admin_head', array($this, '_admin_head'));
		add_action('admin_menu', array($this, '_custom_admin_menus'));
		add_action('admin_notices', array($this, 'render_admin_notices'));
		add_filter('admin_body_class', array($this, '_add_admin_body_class'));

	}

// end constructor

	function get_api_adapter($provider) {

		// build required configuratoin for this provider
		if (!get_option('wsl_settings_' . $provider . '_enabled')) {
			throw new Exception('Unknown or disabled provider');
		}

		$config = array();
		$config["base_url"] = plugins_url() . '/wordpress-social-login/hybridauth/';
		$config["providers"] = array();
		$config["providers"][$provider] = array();
		$config["providers"][$provider]["enabled"] = true;

		// provider application id ?
		if (get_option('wsl_settings_' . $provider . '_app_id')) {
			$config["providers"][$provider]["keys"]["id"] = get_option('wsl_settings_' . $provider . '_app_id');
		}

		// provider application key ?
		if (get_option('wsl_settings_' . $provider . '_app_key')) {
			$config["providers"][$provider]["keys"]["key"] = get_option('wsl_settings_' . $provider . '_app_key');
		}

		// provider application secret ?
		if (get_option('wsl_settings_' . $provider . '_app_secret')) {
			$config["providers"][$provider]["keys"]["secret"] = get_option('wsl_settings_' . $provider . '_app_secret');
		}

		// create an instance for Hybridauth
		$hybridauth = new Hybrid_Auth($config);

		if ($hybridauth->isConnectedWith($provider)) {
			return $hybridauth->getAdapter($provider);
		}
	 
		$login_link = WORDPRESS_SOCIAL_LOGIN_PLUGIN_URL . "/authenticate.php?provider=$provider&redirect_to=" . urlencode(Hybrid_Auth::getCurrentUrl());
		return new WP_Error(401, "Unauthorized", $login_link);
		
	}
	
	/**
	 * Fired when the plugin is activated.
	 *
	 * @params    $network_wide    True if WPMU superadmin uses "Network Activate" action, false if WPMU is disabled or plugin is activated on an individual blog
	 */
	public function activate($network_wide) {
		
	}

// end activate

	/**
	 * Fired when the plugin is deactivated.
	 *
	 * @params    $network_wide    True if WPMU superadmin uses "Network Activate" action, false if WPMU is disabled or plugin is activated on an individual blog
	 */
	public function deactivate($network_wide) {
		
	}

// end deactivate

	/**
	 * Fired when the plugin is uninstalled.
	 *
	 * @params    $network_wide    True if WPMU superadmin uses "Network Activate" action, false if WPMU is disabled or plugin is activated on an individual blog
	 */
	public function uninstall($network_wide) {
		// TODO define uninstall functionality here
	}

// end uninstall

	/**
	 * deregisters admin-specific styles.
	 */
	public function deregister_admin_styles() {
		
	}

// end deregister_admin_styles

	/**
	 * Deregisters admin-specific JavaScript.
	 */
	public function deregister_admin_scripts() {
		
	}

// end deregister_admin_scripts

	/**
	 * Registers and enqueues admin-specific styles.
	 */
	public function register_admin_styles() {

		wp_enqueue_style('mybytes-admin-styles', CLUSTERDASHBOARD_URL . 'assets/stylesheets/mybytes-admin.css', array('wappack'));
	}

// end register_admin_styles

	/**
	 * Registers and enqueues admin-specific JavaScript.
	 */
	public function register_admin_scripts() {
		wp_enqueue_script('response', CLUSTERDASHBOARD_URL . 'vendor/response.min.js', array('jquery'), '0.6.1', true);
		wp_enqueue_script('mybytes-admin-scripts', CLUSTERDASHBOARD_URL . 'assets/javascripts/admin.js', array('response'));
	}

// end register_admin_scripts

	/**
	 * Registers and enqueues plugin-specific styles.
	 */
	public function register_plugin_styles() {

		wp_enqueue_style('mybytes-plugin-styles', CLUSTERDASHBOARD_URL . 'assets/stylesheets/display.css');
	}

// end register_plugin_styles

	/**
	 * Registers and enqueues plugin-specific scripts.
	 */
	public function register_plugin_scripts() {

		wp_enqueue_script('mybytes-plugin-scripts', CLUSTERDASHBOARD_URL . 'assets/javascripts/display.js');
	}

// end register_plugin_scripts

	/* --------------------------------------------*
	 * Core Functions
	 * --------------------------------------------- */

	/**
	 * Note:  Actions are points in the execution of a page or process
	 *        lifecycle that WordPress fires.
	 *
	 *          WordPress Actions: http://codex.wordpress.org/Plugin_API#Actions
	 *          Action Reference:  http://codex.wordpress.org/Plugin_API/Action_Reference
	 *
	 */
	function _admin_head() {

		// TODO define your action method here
	}

// end mybytes_admin_head

	function _add_admin_body_class($classes) {

		$classes.=' mybytes-admin';
		return $classes;
	}

	function _custom_admin_menus() {

		$cluster_menu = add_menu_page(
						'My Load Test Clusters', 'My Clusters', 'read', 'cluster', array(&$this, 'renderView_clusterList'), 'div', 7
		);
	}

	function renderView_clusterList() {
		require_once CLUSTERDASHBOARD_DIR . '/views/clusterList.php';
	}

	/**
	 * Renders any admin notices passed in on the query string
	 *
	 */
	function render_admin_notices() {
		if (isset($_GET['admin_notice'])) {
			$msg = sanitize_text_field(stripslashes($_GET['admin_notice']));
			?>
			<div class="alert alert-success">
				<button type="button" class="close" data-dismiss="alert">&times;</button>
				<strong><?php echo $msg; ?></strong>
			</div>
			<?php
		}
	}
}

// end class

$custerDashboard_Admin_Area = new ClusterDashboard_Admin_Area();