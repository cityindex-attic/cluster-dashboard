<?php
/**
 * Display view cluster list
 * 
 * Note that $this-> is $clusterDashboard_Admin_Area
 */

$twitter_api = $this->get_api_adapter("Twitter");
if (is_wp_error($twitter_api))
{
	echo "<a href='".$twitter_api->get_error_data()."' target='_blank'>Connect to Twitter</a>";
} else {
	$profile = $twitter_api->getUserProfile();
	$tweets = $twitter_api->api()->get('statuses/user_timeline.json');
	?>
	<div>
		<h1>Tweets for <?php echo $profile->displayName; ?></h1>
		<ol>
			<?php foreach($tweets as $tweet) { echo "<li>{$tweet->text}</li>"; }?>
		</ol>
	</div>
<?php
} 
?><hr><?php
$dropbox_api = $this->get_api_adapter("Dropbox");
if (is_wp_error($dropbox_api))
{
	echo "<a href='".$dropbox_api->get_error_data()."' target='_blank'>Connect to Dropbox</a>";
} else {
	$profile = $dropbox_api->getUserProfile();
	$files = $dropbox_api->api()->get('dropbox?query=*.jpg&file_limit=10');
	?>
	<div>
		<h1>Files for <?php echo $profile->displayName; ?></h1>
		<ol>
			<?php foreach($files as $file) { echo "<li>{$file->path}</li>"; }?>
		</ol>
	</div>
<?php
}