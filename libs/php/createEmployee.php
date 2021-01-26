<?php

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	// Validate form
	$formValidation = [];

	if (empty($_POST['firstName']) || !preg_match('/^[a-zA-Z\s]+$/', $_POST['firstName'])) {

		$input = 'firstName';
		$message = 'Please type a valid first name';
		$error = (object) [$input => $message];
		$formValidation[] = $error;

	}

	if (empty($_POST['lastName']) || !preg_match('/^[a-zA-Z\s]+$/', $_POST['lastName'])) {

		$input = 'lastName';
		$message = 'Please type a valid last name';
		$error = (object) [$input => $message];
		$formValidation[] = $error;

	}

	if (empty($_POST['email']) || !filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {

		$input = 'email';
		$message = 'Please type a valid email';
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

	$query = 'INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES( \'' . $_POST['firstName'] .'\', \'' . $_POST['lastName'] .'\', \'' . $_POST['jobTitle'] .'\', \'' . $_POST['email'] . '\', \''. $_POST['departmentID'] . '\')';

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
	$output['data'] = [];
	
	mysqli_close($conn);

	echo json_encode($output); 

?>