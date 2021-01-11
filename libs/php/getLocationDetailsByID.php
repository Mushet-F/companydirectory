<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAll.php

	// remove next two lines for production
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

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

	$query = 'SELECT p.id, p.firstName, p.lastName, d.name as department, l.id ,l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE locationID = ' . $_REQUEST['id'] . ' ORDER BY d.name, p.lastName, p.firstName;';
	$query .= 'SELECT DISTINCT p.departmentID, d.name as department,l.id as locationID , l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE locationID = '  . $_REQUEST['id'] . ' ORDER BY p.departmentID';

	$result = $conn->query($query);

	$data = [];
	$data2 = [];
	$resultCount = 0;

	if (mysqli_multi_query($conn, $query)) {
	do {

		if ($result = mysqli_store_result($conn)) {
			if($resultCount === 0) {
				while ($row = mysqli_fetch_assoc($result)) {
					array_push($data, $row);
				}
				mysqli_free_result($result);
			}

			if($resultCount === 1) {
				while ($row = mysqli_fetch_assoc($result)) {
					array_push($data2, $row);
				}
				mysqli_free_result($result);
			} 

		}

		if (mysqli_more_results($conn)) {
			$resultCount = 1;
		}

	} while (mysqli_next_result($conn));
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	$output['data2'] = $data2;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>