<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	// Validate form
	$formValidation = [];

	if (empty($_REQUEST['name']) || !preg_match('/^[a-zA-Z\s]+$/', $_REQUEST['name'])) {

		$input = 'name';
		$message = 'Please type a valid department name';
		$error = (object) [$input => $message];
		$formValidation[] = $error;

	}

	if ($_REQUEST['checkbox'] === 'false') {

		$input = 'checkbox';
		$message = 'Please select checkbox';
		$error = (object) [$input => $message];
		$formValidation[] = $error;

	}

	if (!empty($formValidation)) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "form validation failed";	
		$output['data'] = $formValidation;

		echo json_encode($output); 

		exit;
	}
	// End form validation

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// $query = 'UPDATE personnel SET firstName = \'' . $_REQUEST['firstName'] . '\', lastName = \'' . $_REQUEST['lastName'] . '\', jobTitle = \'' . $_REQUEST['jobTitle'] . '\', email = \'' . $_REQUEST['email'] . '\', departmentID = \'' . $_REQUEST['departmentID'] . '\' WHERE personnel.id = \'' . $_REQUEST['id'] . '\'';
	$query = 'UPDATE department SET name = \'' . $_REQUEST['name'] . '\', locationID = ' . $_REQUEST['locationID'] . ' WHERE department.id = ' . $_REQUEST['id'];

	$result = $conn->query($query);
	
	if (!$result) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output); 

		exit;

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $result;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>