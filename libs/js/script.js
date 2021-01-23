// Preloader
$(window).on('load', function () {
    if ($('#preloader').length) {
        $('#preloader').delay(100).fadeOut('slow', function () {
            $(this).remove();
        });
    }
});

// ********************** Creating tables *********************************** //

// Creating main table
function createTable(result) {
 
    let table = `  
        <thead>
            <tr>
                <th id="id-column">ID</th>
                <th id="name-column">Name</th>
                <th id="job-column">Job Title</th>
                <th id="email-column">Email</th>
                <th id="department-column">Department</th>
                <th id="location-column">Location</th>
            </tr>
        </thead>
        <tbody id="tbody-employees">`;

    $("#main-table").append(table);

    for (i = 0; i < result.data.length ; i++) {

        const id = result.data[i]['id'];
        const name = result.data[i]['firstName'] + " " + result.data[i]['lastName'];
        const job = result.data[i]['jobTitle']; 
        const email = result.data[i]['email'];
        const department = result.data[i]['department'];
        const departmentID = result.data[i]['departmentID'];
        const location = result.data[i]['location'];
        const locationID = result.data[i]['locationID'];

        let tbody = `<tr>
        <td class="td-id">${id} <i class="fas fa-grip-lines-vertical"></i></td>
        <td class="td-name" data-toggle="modal" data-target="#employeeModal" value="${id}">${name} <i class="fas fa-expand-alt"></i></td>
        <td class="td-job">${job}</td>
        <td class="td-email">${email}</td>
        <td class="td-department" data-toggle="modal" data-target="#departmentModal" value="${departmentID}">${department} <i class="fas fa-expand-alt"></i></td>
        <td class="td-location" data-toggle="modal" data-target="#locationModal" value="${locationID}">${location} <i class="fas fa-expand-alt"></i></td>
        </tr>`;

        $("#main-table").append(tbody);
        
    }

    $("#main-table").append('</tbody>');

    currentView = 'table';
}

// Create table to select and then edit or delete an employee
function createSelectTable(result, action) {

    const selection = action['selection'];
    const execution = action['execution'];
    const target = action['target'];
 
    let table = `  
        <thead>
            <tr>
                <th class="id-column-modal">ID</th>
                <th class="name-column-modal">Name</th>
            </tr>
        </thead>
        <tbody>`;

    $(`#${selection}-select-table`).append(table);

    for (i = 0; i < result.length ; i++) {

        const id = result[i]['id'];
        let name;
        if (selection === 'employee') {
            name = result[i]['firstName'] + " " + result[i]['lastName'];
        } else if (selection === 'department' || selection === 'location') {
            name = result[i]['name'];
        }
        

        let tbody = `<tr>
        <td class="td-id id-column-modal">${id} <i class="fas fa-grip-lines-vertical"></i></td>
        <td class="td-name name-column-modal td-${execution}-${selection}" data-dismiss="modal" data-toggle="modal" data-target="${target}" value="${id}">${name} <i class="fas fa-expand-alt"></i></td>
        </tr>`;

        $(`#${selection}-select-table`).append(tbody);
        
    }

    $(`#${selection}-select-table`).append('</tbody>');
    

}

// **************************************************************************************** //

// ********************** Creating main employees cards *********************************** //

function createCards(result) {

    for (i = 0; i < result.data.length ; i++) {
        const id = result.data[i]['id'];
        const name = result.data[i]['firstName'] + " " + result.data[i]['lastName'];
        const job = result.data[i]['jobTitle']; 
        const email = result.data[i]['email'];
        const department = result.data[i]['department'];
        const location = result.data[i]['location'];

        let html = `<div class='col-sm-6 col-lg-4 employee-card' data-toggle="modal" data-target="#employeeModal" value=${id} data-string="${name}"><div class='box'><img class='rounded-circle' src='./img/avatar.png'>
        <h3 class="name">${name}</h3>                            
        <p class="title">${job}</p>
        <p class="description">${email}</p>
        <p class="description">${department}</p>
        <p class="description">${location}</p></div></div>`;

        $("div .people").append(html);

    }

    currentView = 'grid';

}

// **************************************************************************************** //

// ********************** Clear table or cards to produce new set of results ************** //

function clearCurrentResults() {

    if(currentView === 'table') {
        $("#main-table thead").remove();
        $("#main-table tbody").remove();
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
    }

}

// **************************************************************************************** //

// ********************** Click events on main table and cards **************************** //

// Click cards and display employee details
$(document).on("click", ".employee-card", async function() {
 
    let employeeId = $(this).attr('value');
    employeeDetailsResult = await getEmployeeDetails(employeeId);
    displayEmployeeDetailsModal(employeeDetailsResult);

});

// Click table data cell
$(".table").on("click", "td", async function() {

    let typeOfCellSelect = $(this).attr('class');
    let employeeID;
    let departmentID;
    let locationID;
    let locationName;

    switch (typeOfCellSelect) {
        case 'td-name':
            employeeID = $(this).attr('value');
            employeeDetailsResult = await getEmployeeDetails(employeeID);
            displayEmployeeDetailsModal(employeeDetailsResult);
            break;
        case 'td-department':
            departmentID = $(this).attr('value');
            departmentDetailsResult = await getDepartmentDetails(departmentID);
            displayDepartmentDetailsModal(departmentDetailsResult);
            populateEditDepartmentDetailsModal(departmentDetailsResult);
            break;
        case 'td-location':
            locationID = $(this).attr('value');
            locationDetailsResult = await getLocationDetails(locationID);
            displayLocationDetailsModal(locationDetailsResult);
            locationName = locationDetailsResult['data2'][0]['location'];
            populateEditLocationDetailsModal(locationName);
            break;
        default:
            break;
    }

});

// **************************************************************************************** //

// ********************** Search employees in tables or cards ***************************** //

function searchMain() {

    let input = document.getElementById("mainSearch");
    let filter = input.value.toUpperCase();
    let table = document.getElementById("main-table");
    let tr = table.getElementsByTagName("tr");

    // Search main table
    for (let i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            let txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }

    // Search cards
    $(".employee-card").each(function() {
        if ($(this).data("string").toUpperCase().indexOf(filter) < 0) {
            $(this).hide();
        } else {
            $(this).show();
        }
    });

}

// **************************************************************************************** //

// ********************** Tracker array *************************************************** //

// Array tracker for navigating through modals
let trackingModals = [];

// Click event for closing modal top corner "X" button for quick escape
$(document).on("click", ".close", function() {

    trackingModals = [];
    
});

// **************************************************************************************** //

// ******************* CRUD functions for Employee within Modals ************************** //

let employeeDetailsResult;

// Create 
// Create employee
function createEmployee() {

    const firstName = $('#employee-create-firstName').val();
    const lastName = $('#employee-create-lastName').val();
    const jobTitle = $('#employee-create-jobTitle').val();
    const email = $('#employee-create-email').val();
    const departmentID = $('#employee-create-department option:selected').val();
    const checkbox = $('#employee-create-checkbox').is(':checked');

    $.ajax({
        url: "libs/php/createEmployee.php",
        type: 'POST',
        dataType: 'json',
        data: {
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            email: email,
            departmentID: departmentID,
            checkbox: checkbox
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                clearCurrentResults();

                if(currentView === 'table') {
                    $( "#table-div" ).addClass( "tableFixHead" );
                }

                displayAllEmployeesByLastName();

                $('#createEmployeeModal').modal('hide');

            }

            if(result['status']['description'] === 'form validation failed') {

                $('#employee-create-error-firstName').html('');
                $('#employee-create-error-lastName').html('');
                $('#employee-create-error-email').html('');
                $('#employee-create-error-checkbox').html('');

                let errorArray = result['data'];

                for(let i = 0; i < errorArray.length; i++) {

                    for(key in errorArray[i]) {
                        switch(key) {
                            case 'firstName':
                                $('#employee-create-error-firstName').html(errorArray[i][key]);
                                break;
                            case 'lastName':
                                $('#employee-create-error-lastName').html(errorArray[i][key]);
                                break;
                            case 'email':
                                $('#employee-create-error-email').html(errorArray[i][key]);
                                break;
                            case 'checkbox':
                                $('#employee-create-error-checkbox').html(errorArray[i][key]);
                                break;
                            default:
                        }
                    }
                }
            }
            

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}

// Read
// Employee details
const getEmployeeDetails = async id => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "libs/php/getEmployeeDetails.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(result) {

                const employee = result['data'][0];

                resolve(employee);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        }); 
    });
}

// Displaying the data for employee details modal
function displayEmployeeDetailsModal(employee) {

    const name = employee['firstName'] + ' ' + employee['lastName'];

    $('#modal-employee-id').html(employee['id']);
    $('#modal-employee-name').html(name);
    $('#modal-employee-job').html(employee['jobTitle']);
    $('#modal-employee-email').html(employee['email']);
    $('#modal-employee-department').html(employee['department']);
    $('#modal-employee-location').html(employee['location']);

    $('#modal-employee-department').attr('value', employee['departmentID']);
    $('#modal-employee-location').attr('value', employee['locationID']);

    $('#edit-employee-close-btn').attr('data-toggle', 'modal');
    $('#edit-employee-close-btn').attr('data-target', '#employeeModal');

    if(trackingModals.length === 0) {
        let modalType = '#employeeModal';
        let currentModal = {
            details: employee, 
            type: modalType
        };
        trackingModals.push(currentModal);
    } 

}

// Update
// Edit employee details modal form to be updated to match employee details
function populateEditEmployeeDetailsModal(employee) {

    $('#employee-edit-firstName').val(employee['firstName']);
    $('#employee-edit-lastName').val(employee['lastName']);
    $('#employee-edit-jobTitle').val(employee['jobTitle']);
    $('#employee-edit-email').val(employee['email']);
    $('#employee-edit-department').val(employee['departmentID']);
    $('#employee-edit-location').val(employee['location']);

    $('#employee-error-firstName').html('');
    $('#employee-error-lastName').html('');
    $('#employee-error-email').html('');
    $('#employee-error-checkbox').html('');
    
    $('#employee-edit-checkbox').prop('checked', false);

}

// Update employee details modal
function updateEmployeeDetails() {

    const id = employeeDetailsResult['id'];

    const firstName = $('#employee-edit-firstName').val();
    const lastName = $('#employee-edit-lastName').val();
    const jobTitle = $('#employee-edit-jobTitle').val();
    const email = $('#employee-edit-email').val();
    const departmentID = $('#employee-edit-department option:selected').val();
    const checkbox = $('#employee-edit-checkbox').is(':checked');

    $.ajax({
        url: "libs/php/updateEmployeeDetails.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id,
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            email: email,
            departmentID: departmentID,
            checkbox: checkbox
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                employeeDetailsResult = await getEmployeeDetails(id);
                displayEmployeeDetailsModal(employeeDetailsResult);
                clearCurrentResults();

                if(currentView === 'table') {
                    $( "#table-div" ).addClass( "tableFixHead" );
                }

                displayAllEmployeesByLastName();

                $('#employeeModal').modal('show');
                $('#editEmployeeModal').modal('hide');

            }

            if(result['status']['description'] === 'form validation failed') {

                $('#employee-error-firstName').html('');
                $('#employee-error-lastName').html('');
                $('#employee-error-email').html('');
                $('#employee-error-checkbox').html('');

                let errorArray = result['data'];

                for(let i = 0; i < errorArray.length; i++) {

                    for(key in errorArray[i]) {
                        switch(key) {
                            case 'firstName':
                                $('#employee-error-firstName').html(errorArray[i][key]);
                                break;
                            case 'lastName':
                                $('#employee-error-lastName').html(errorArray[i][key]);
                                break;
                            case 'email':
                                $('#employee-error-email').html(errorArray[i][key]);
                                break;
                            case 'checkbox':
                                $('#employee-error-checkbox').html(errorArray[i][key]);
                                break;
                            default:
                        }
                    }
                }
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}

// Delete
// Delete selected employee 
function deleteEmployeeByID() {

    const id = employeeDetailsResult['id'];

    $.ajax({
        url: "libs/php/deleteEmployeeByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                clearCurrentResults();

                if(currentView === 'table') {
                    $( "#table-div" ).addClass( "tableFixHead" );
                }

                displayAllEmployeesByLastName();

            }    

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}


// **************************************************************************************** //

// ******************* CRUD functions for Department within Modals ************************ //

let departmentDetailsResult;

// Create
// Create department
function createDepartment() {

    const name = $('#department-create-name').val();
    const locationID = $('#department-create-location').val();
    const checkbox = $('#department-create-checkbox').is(':checked');

    $.ajax({
        url: "libs/php/createDepartment.php",
        type: 'POST',
        dataType: 'json',
        data: {
            name: name,
            locationID: locationID,
            checkbox: checkbox
        },
        success: async function(result) {
 
            if(result['status']['code'] === '200') {
                
                clearCurrentResults();

                if(currentView === 'table') {
                    $( "#table-div" ).addClass( "tableFixHead" );
                }

                displayAllEmployeesByLastName();
                createFilterDropdown();

                $('#createDepartmentModal').modal('hide');

            }

            if(result['status']['description'] === 'form validation failed') {

                $('#department-create-error-name').html('');
                $('#department-create-error-checkbox').html('');

                let errorArray = result['data'];

                for(let i = 0; i < errorArray.length; i++) {
                    for(key in errorArray[i]) {
                        switch(key) {
                            case 'name':
                                $('#department-create-error-name').html(errorArray[i][key]);
                                break;
                            case 'checkbox':
                                $('#department-create-error-checkbox').html(errorArray[i][key]);
                                break;
                            default:
                        }
                    }
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}

// Read
// Department details by id
const getDepartmentDetails = async id => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "libs/php/getDepartmentDetailsByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(result) {

                const department = result['data'];

                resolve(department);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        }); 
    });
}

// Displaying the data for department details modal
function displayDepartmentDetailsModal(department) {

    $('#modal-department-id').html(department[0]['id']);
    $('#modal-department-name').html(department[0]['department']);
    $('#modal-department-location').html(department[0]['location']);
    $('#modal-department-number-employees').html(department.length);

    $('#edit-department-close-btn').attr('data-toggle', 'modal');
    $('#edit-department-close-btn').attr('data-target', '#departmentModal');

    let employeeListHtml = '';

    for(let i = 0; i < department.length; i++) {

        let employee = department[i]['firstName'] + ' ' + department[i]['lastName'];
        let employeeID = department[i]['employeeID'];
        let html = `<span class="employee-highlight department-employee"  data-dismiss="modal" data-toggle="modal" data-target="#employeeModal" value="${employeeID}">${employee}</span> `;
        let comma = ' , ';

        if(i !== department.length - 1) {
            html += comma;
        }
    
        employeeListHtml += html;
    }

    $('#modal-department-employees').html(employeeListHtml);

    $('#modal-department-location').attr('value', department[0]['locationID']);

    if(trackingModals.length === 0) {
        let modalType = '#departmentModal';
        let currentModal = {
            details: department, 
            type: modalType
        };
        trackingModals.push(currentModal);
    }

}

let emptyDepartmentDetailsResult;

// If deparment is empty (no employees), get details
const getEmptyDepartmentDetails = async id => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "libs/php/getEmptyDepartmentDetailsByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(result) {

                let department = result['data'];
                department[0]['empty'] = 'yes';
                resolve(department);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        }); 
    });
}

// Displaying the data for an empty department
function displayEmptyDepartment(department) {

    $('#modal-department-id').html(department[0]['id']);
    $('#modal-department-name').html(department[0]['department']);
    $('#modal-department-location').html(department[0]['location']);
    $('#modal-department-number-employees').html('0');
    $('#modal-department-employees').html('');

    $('#modal-department-location').attr('value', department['locationID']);

}

// Get all departments
const getAllDepartments = async () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "libs/php/getAllDepartments.php",
            type: 'POST',
            dataType: 'json',
            success: function(result) {

                const departments = result['data'];
                resolve(departments);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        }); 
    });
}

// Creating dropdown to list all departments in employee edit modal or filter department in side menu
const createDepartmentsDropdownList = (departments, listFor) => {

    let departmentDropdownHtml = '';

    if(listFor === 'modal') {

        for(let i = 0; i < departments.length; i++) {
            let department = departments[i]['name'];
            let departmentID = departments[i]['id'];
            let html = `<option value="${departmentID}">${department}</option>`;
        
            departmentDropdownHtml += html;
        }
    
    } else if (listFor === 'filter') {

        for(let i = 0; i < departments.length; i++) {
            let department = departments[i]['name'];
            let html = `        
            <div class="dropbtn input-drop">
                <input class="check-filter" type="checkbox" id="check-${department}" name="check-${department}" value="Dep-${department}">
                <label for="check-${department}">${department}</label>
            </div>`;
        
            departmentDropdownHtml += html;
        }
    }

    return departmentDropdownHtml

}

// Update
// Edit department details modal form to be updated to match department details
function populateEditDepartmentDetailsModal(department) {

    $('#department-edit-name').val(department[0]['department']);
    $('#department-edit-location').val(department[0]['locationID']);

    $('#department-error-name').html('');
    $('#department-error-checkbox').html('');
    $('#department-edit-checkbox').prop('checked', false);

}

// Update department details modal
function updateDepartmentDetails() {

    const id = departmentDetailsResult[0]['id'];

    const name = $('#department-edit-name').val();
    const locationID = $('#department-edit-location').val();
    const checkbox = $('#department-edit-checkbox').is(':checked');

    $.ajax({
        url: "libs/php/updateDepartmentDetails.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id,
            name: name,
            locationID: locationID,
            checkbox: checkbox
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                departmentDetailsResult = await getDepartmentDetails(id);
                if (departmentDetailsResult.length === 0) {
                    emptyDepartmentDetailsResult = await getEmptyDepartmentDetails(id);
                    departmentDetailsResult = emptyDepartmentDetailsResult;
                    displayEmptyDepartment(departmentDetailsResult);
                } else {
                    displayDepartmentDetailsModal(departmentDetailsResult);
                }

                populateEditDepartmentDetailsModal(departmentDetailsResult);
                clearCurrentResults();

                if(currentView === 'table') {
                    $( "#table-div" ).addClass( "tableFixHead" );
                }

                displayAllEmployeesByLastName();
                
                $('#departmentModal').modal('show');
                $('#editDepartmentModal').modal('hide');

            }

            if(result['status']['description'] === 'form validation failed') {

                $('#department-error-name').html('');
                $('#department-error-checkbox').html('');

                let errorArray = result['data'];

                for(let i = 0; i < errorArray.length; i++) {
                    for(key in errorArray[i]) {
                        switch(key) {
                            case 'name':
                                $('#department-error-name').html(errorArray[i][key]);
                                break;
                            case 'checkbox':
                                $('#department-error-checkbox').html(errorArray[i][key]);
                                break;
                            default:
                        }
                    }
                }
            }
            

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}

// Delete
// Delete selected department 
function deleteDepartmentByID() {

    const id = emptyDepartmentDetailsResult[0]['id'];

    $.ajax({
        url: "libs/php/deleteDepartmentByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                clearCurrentResults();

                if(currentView === 'table') {
                    $( "#table-div" ).addClass( "tableFixHead" );
                }

                displayAllEmployeesByLastName();

            }    

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}


// **************************************************************************************** //

// ******************* CRUD functions for Location within Modals ************************** //

let locationDetailsResult;
// Create
// Create location
function createLocation() {

    const name = $('#location-create-name').val();
    const checkbox = $('#location-create-checkbox').is(':checked');

    $.ajax({
        url: "libs/php/createLocation.php",
        type: 'POST',
        dataType: 'json',
        data: {
            name: name,
            checkbox: checkbox
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                clearCurrentResults();

                if(currentView === 'table') {
                    $( "#table-div" ).addClass( "tableFixHead" );
                }

                displayAllEmployeesByLastName();
                createFilterDropdown();

                $('#createLocationModal').modal('hide');

            }

            if(result['status']['description'] === 'form validation failed') {

                $('#location-create-error-name').html('');
                $('#location-create-error-checkbox').html('');

                let errorArray = result['data'];

                for(let i = 0; i < errorArray.length; i++) {
                    for(key in errorArray[i]) {
                        switch(key) {
                            case 'name':
                                $('#location-create-error-name').html(errorArray[i][key]);
                                break;
                            case 'checkbox':
                                $('#location-create-error-checkbox').html(errorArray[i][key]);
                                break;
                            default:
                        }
                    }
                }
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}

// Read
// Location details
const getLocationDetails = async id => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "libs/php/getLocationDetailsByID.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(result) {

                const locationDetails = result;

                resolve(locationDetails);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        }); 
    });
}

// Displaying the data for location details modal
function displayLocationDetailsModal(location) {

    $('#modal-location-id').html(location['data2'][0]['locationID']);
    $('#modal-location-name').html(location['data2'][0]['location']);

    $('#edit-location-close-btn').attr('data-toggle', 'modal');
    $('#edit-location-close-btn').attr('data-target', '#locationModal');

    let departmentListHtml = '';

    for(let i = 0; i < location['data2'].length; i++) {
        let department = location['data2'][i]['department'];
        let departmentID = location['data2'][i]['id'];
        let html = `<span class="department-highlight location-departments" data-dismiss="modal" data-toggle="modal" data-target="#departmentModal" value="${departmentID}"> ${department} </span>  `;
        let comma = '  , ';

        if(i !== location['data2'].length - 1) {
            html += comma;
        }
    
        departmentListHtml += html;
    }

    $('#modal-location-departments').html(departmentListHtml);

    $('#modal-location-number-employees').html(location['data'].length);

    let employeeListHtml = '';

    for(let i = 0; i < location['data'].length; i++) {

        let employee = location['data'][i]['firstName'] + ' ' + location['data'][i]['lastName'];
        let employeeID = location['data'][i]['employeeID'];
        let html = `<span class="employee-highlight location-employee" data-dismiss="modal" data-toggle="modal" data-target="#employeeModal" value="${employeeID}">${employee}</span> `;
        let comma = ' , ';

        if(i !== location['data'].length - 1) {
            html += comma;
        }
    
        employeeListHtml += html;
    }

    $('#modal-location-employees').html(employeeListHtml);

    if(trackingModals.length === 0) {
        let modalType = '#locationModal';
        let currentModal = {
            details: location, 
            type: modalType
        };
        trackingModals.push(currentModal);
    }

}

// Displaying the data for an empty location
function displayEmptyLocation(id, name) {

    emptyLocationId = id;
    $('#modal-location-id').html(id);
    $('#modal-location-name').html(name);

    $('#modal-location-departments').html('');
    $('#modal-location-number-employees').html('0');
    $('#modal-location-employees').html('');

}

// Get all locations
const getAllLocations = async () => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "libs/php/getAllLocations.php",
            type: 'POST',
            dataType: 'json',
            success: function(result) {
                    
                const locations = result['data'];
                resolve(locations);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        }); 
    });
}

// Creating dropdown to list all locations in department edit modal or filter location in side menu
const createLocationsDropdownList = (locations, listFor) => {

    let locationDropdownHtml = '';

    if(listFor === 'modal') {

        for(let i = 0; i < locations.length; i++) {
            let location = locations[i]['name'];
            let locationID = locations[i]['id'];
            let html = `<option value="${locationID}">${location}</option>`;
        
            locationDropdownHtml += html;
        }

    } else if (listFor === 'filter') {

        for(let i = 0; i < locations.length; i++) {
            let location = locations[i]['name'];
            let html = `        
            <div class="dropbtn input-drop">
                <input class="check-filter" type="checkbox" id="check-${location}" name="check-${location}" value="Loc-${location}">
                <label for="check-${location}">${location}</label>
            </div>`;
        
            locationDropdownHtml += html;
        }

    }

    return locationDropdownHtml

}

// Update
// Edit location details modal form to be updated to match location details
function populateEditLocationDetailsModal(name) {

    $('#location-edit-name').val(name);
    $('#location-error-name').html('');
    $('#location-error-checkbox').html('');
    $('#location-edit-checkbox').prop('checked', false);

}

// Update location details modal
async function updateLocationDetails() {

    const name = $('#location-edit-name').val();

    let id;
    if(locationDetailsResult['data2'].length > 0) {
        id = locationDetailsResult['data2'][0]['locationID'];
    } else {
        id = emptyLocationId;
    }
    const checkbox = $('#location-edit-checkbox').is(':checked');

    $.ajax({
        url: "libs/php/updateLocationDetails.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id,
            name: name,
            checkbox: checkbox
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                locationDetailsResult = await getLocationDetails(id);

                if (locationDetailsResult['data'].length === 0) {

                    displayEmptyLocation(id, name);

                } else {

                    displayLocationDetailsModal(locationDetailsResult);
                    const name = locationDetailsResult['data2'][0]['location'];
                    populateEditLocationDetailsModal(name);
                  
                }

                clearCurrentResults();

                if(currentView === 'table') {
                    $( "#table-div" ).addClass( "tableFixHead" );
                }

                displayAllEmployeesByLastName();

                $('#locationModal').modal('show');
                $('#editLocationModal').modal('hide');
                
            }

            if(result['status']['description'] === 'form validation failed') {

                $('#location-error-name').html('');
                $('#location-error-checkbox').html('');

                let errorArray = result['data'];

                for(let i = 0; i < errorArray.length; i++) {
                    for(key in errorArray[i]) {
                        switch(key) {
                            case 'name':
                                $('#location-error-name').html(errorArray[i][key]);
                                break;
                            case 'checkbox':
                                $('#location-error-checkbox').html(errorArray[i][key]);
                                break;
                            default:
                        }
                    }
                }
            }
            

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}

// Get location name from id
const getLocationName = async id => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "libs/php/getLocationName.php",
            type: 'POST',
            dataType: 'json',
            data: {
                id: id,
            },
            success: function(result) {

                resolve(result['data'][0]['location']);

            },
            error: function(jqXHR, textStatus, errorThrown) {
                reject(errorThrown);
            }
        }); 
    });
}

// Delete

let emptyLocationId;

// Delete selected location 
function deleteLocationByID() {

    const id = emptyLocationId;

    $.ajax({
        url: "libs/php/deleteLocationByID.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                clearCurrentResults();

                if(currentView === 'table') {
                    $( "#table-div" ).addClass( "tableFixHead" );
                }

                displayAllEmployeesByLastName();

            }    

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}

// **************************************************************************************** //

// ********************** Click events for employee modal ********************************* //

// Selecting an department in employee modal
$(document).on("click", "#modal-employee-department", async function() {

    let departmentID = $(this).attr('value');
    departmentDetailsResult = await getDepartmentDetails(departmentID);
    displayDepartmentDetailsModal(departmentDetailsResult);
    populateEditDepartmentDetailsModal(departmentDetailsResult);

    let modalType = '#departmentModal';
    let currentModal = {
        details: departmentDetailsResult, 
        type: modalType
    };
    trackingModals.push(currentModal);

    if (trackingModals.length > 1) {
        let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
        $('#departmentCloseBtn').attr('data-toggle', 'modal');
        $('#departmentCloseBtn').attr('data-target', `${closeBtnTarget}`);
    }

});

// Selecting the location in employee modal
$(document).on("click", "#modal-employee-location", async function() {

    let locationID = $(this).attr('value');
    locationDetailsResult = await getLocationDetails(locationID);
    displayLocationDetailsModal(locationDetailsResult);
    const name = locationDetailsResult['data2'][0]['location'];
    populateEditLocationDetailsModal(name);

    let modalType = '#locationModal';
    let currentModal = {
        details: locationDetailsResult, 
        type: modalType
    };
    trackingModals.push(currentModal);

    if (trackingModals.length > 1) {
        let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
        $('#locationCloseBtn').attr('data-toggle', 'modal');
        $('#locationCloseBtn').attr('data-target', `${closeBtnTarget}`);
    }

});

// Click employees modal close button and whether to redirect to another modal
$(document).on("click", "#employeeCloseBtn", async function() {

    if(trackingModals.length > 0) {
        trackingModals.pop();

        $('#employeeCloseBtn').removeAttr('data-toggle');
        $('#employeeCloseBtn').removeAttr('data-target');

        if(trackingModals.length > 0) {
            let nextModal = trackingModals[trackingModals.length - 1];
    
            if (nextModal['type'] === '#departmentModal'){
                departmentDetailsResult = nextModal['details'];
                displayDepartmentDetailsModal(departmentDetailsResult);
                
                populateEditDepartmentDetailsModal(departmentDetailsResult);

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#departmentCloseBtn').attr('data-toggle', 'modal');
                    $('#departmentCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }

            } else if (nextModal['type'] === '#locationModal') {
                locationDetailsResult = nextModal['details'];
                displayLocationDetailsModal(locationDetailsResult);
                const name = locationDetailsResult['data2'][0]['location'];
                populateEditLocationDetailsModal(name);

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#locationCloseBtn').attr('data-toggle', 'modal');
                    $('#locationCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }
            }
        }
    } 

});

// Clicking employee edit button 
$(document).on("click", "#employee-edit-btn", async function() {
    const departments = await getAllDepartments();
    const listFor = 'modal';
    const departmentDropdownHtml = createDepartmentsDropdownList(departments, listFor);
    $('#employee-edit-department').html('');
    $('#employee-edit-department').append(departmentDropdownHtml);
    populateEditEmployeeDetailsModal(employeeDetailsResult);
});

// Clicking employee delete button
$(document).on("click", "#employee-delete-btn", function() {

    const name = employeeDetailsResult['firstName'] + ' ' + employeeDetailsResult['lastName'];
    $('#employee-delete-name').html(name);

    $('#delete-close-btn').attr('data-toggle', 'modal');
    $('#delete-close-btn').attr('data-target', '#employeeModal');

});


// **************************************************************************************** //

// ********************** Click events for department modal ******************************* //

// Selecting an employee in department modal
$(document).on("click", ".department-employee", async function() {

    let employeeId = $(this).attr('value');
    employeeDetailsResult = await getEmployeeDetails(employeeId);
    displayEmployeeDetailsModal(employeeDetailsResult);

    let modalType = '#employeeModal';
    let currentModal = {
        details: employeeDetailsResult, 
        type: modalType
    };
    trackingModals.push(currentModal);

    if (trackingModals.length > 1) {
        let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
        $('#employeeCloseBtn').attr('data-toggle', 'modal');
        $('#employeeCloseBtn').attr('data-target', `${closeBtnTarget}`);
    }

});

// Selecting the location in department modal
$(document).on("click", "#modal-department-location", async function() {

    let locationID = $(this).attr('value');
    locationDetailsResult = await getLocationDetails(locationID);
    displayLocationDetailsModal(locationDetailsResult);
    const name = locationDetailsResult['data2'][0]['location'];
    populateEditLocationDetailsModal(name);

    let modalType = '#locationModal';
    let currentModal = {
        details: locationDetailsResult, 
        type: modalType
    };
    trackingModals.push(currentModal);

    if (trackingModals.length > 1) {
        let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
        $('#locationCloseBtn').attr('data-toggle', 'modal');
        $('#locationCloseBtn').attr('data-target', `${closeBtnTarget}`);
    }

});

// Click department modal close button and whether to redirect to another modal
$(document).on("click", "#departmentCloseBtn", async function() {

    if(trackingModals.length > 0) {
        trackingModals.pop();
        $('#departmentCloseBtn').removeAttr('data-toggle');
        $('#departmentCloseBtn').removeAttr('data-target');

        if(trackingModals.length > 0) {
            let nextModal = trackingModals[trackingModals.length - 1];

            if (nextModal['type'] === '#employeeModal'){
                employeeDetailsResult = nextModal['details'];
                displayEmployeeDetailsModal(employeeDetailsResult);

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#employeeCloseBtn').attr('data-toggle', 'modal');
                    $('#employeeCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }

            } else if (nextModal['type'] === '#locationModal') {
                locationDetailsResult = nextModal['details'];
                displayLocationDetailsModal(locationDetailsResult);
                const name = locationDetailsResult['data2'][0]['location'];
                populateEditLocationDetailsModal(name);

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#locationCloseBtn').attr('data-toggle', 'modal');
                    $('#locationCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }
            }
        }
    } 

});

// Clicking department edit button 
$(document).on("click", "#department-edit-btn", async function() {

    const locations = await getAllLocations();
    const listFor = 'modal';
    const locationDropdownHtml = createLocationsDropdownList(locations, listFor);
    $('#department-edit-location').html('');
    $('#department-edit-location').append(locationDropdownHtml);
    populateEditDepartmentDetailsModal(departmentDetailsResult);

});

// Clicking department delete button
$(document).on("click", "#department-delete-form", function() {
    
    $('#delete-department-close-btn').attr('data-target', '#departmentModal');

    if (departmentDetailsResult.length > 0) {
        $('#delete-department-final').hide();
        $('#delete-department-able').hide();
        $('#delete-department-unable').show();
        $('#department-delete-name').hide();
    } else {
        $('#delete-department-final').show();
        $('#delete-department-able').show();
        $('#delete-department-unable').hide();
        $('#department-delete-name').show();
        $('#department-delete-name').html(emptyDepartmentDetailsResult[0]['department']);
    }
    
});

// **************************************************************************************** //

// ********************** Click events for location modal ********************************* //

// Selecting an employee in location modal
$(document).on("click", ".location-employee", async function() {

    let employeeId = $(this).attr('value');
    employeeDetailsResult = await getEmployeeDetails(employeeId);
    displayEmployeeDetailsModal(employeeDetailsResult);

    let modalType = '#employeeModal';
    let currentModal = {
        details: employeeDetailsResult, 
        type: modalType
    };
    trackingModals.push(currentModal);

    if (trackingModals.length > 1) {
        let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
        $('#employeeCloseBtn').attr('data-toggle', 'modal');
        $('#employeeCloseBtn').attr('data-target', `${closeBtnTarget}`);
    }

});

// Selecting an department in location modal
$(document).on("click", ".location-departments", async function() {

    let departmentID = $(this).attr('value');
    departmentDetailsResult = await getDepartmentDetails(departmentID);

    if (departmentDetailsResult.length === 0) {
        emptyDepartmentDetailsResult = await getEmptyDepartmentDetails(departmentID);
        departmentDetailsResult = emptyDepartmentDetailsResult;
        displayEmptyDepartment(departmentDetailsResult);
    } else {
        displayDepartmentDetailsModal(departmentDetailsResult);
    }

    let modalType = '#departmentModal';
    let currentModal = {
        details: departmentDetailsResult, 
        type: modalType
    };
    trackingModals.push(currentModal);

    if (trackingModals.length > 1) {
        let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
        $('#departmentCloseBtn').attr('data-toggle', 'modal');
        $('#departmentCloseBtn').attr('data-target', `${closeBtnTarget}`);
    }

});

// Click location modal close button and whether to redirect to another modal
$(document).on("click", "#locationCloseBtn", async function() {

    if(trackingModals.length > 0) {
        trackingModals.pop();
        $('#locationCloseBtn').removeAttr('data-toggle');
        $('#locationCloseBtn').removeAttr('data-target');

        if(trackingModals.length > 0) {
            let nextModal = trackingModals[trackingModals.length - 1];

            if (nextModal['type'] === '#employeeModal'){
                employeeDetailsResult = nextModal['details'];
                displayEmployeeDetailsModal(employeeDetailsResult);

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#employeeCloseBtn').attr('data-toggle', 'modal');
                    $('#employeeCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }

            } else if (nextModal['type'] === '#departmentModal') {
                departmentDetailsResult = nextModal['details'];
                if(departmentDetailsResult[0]['empty'] === 'yes') {
                    let departmentID = departmentDetailsResult[0]['id'];
                    emptyDepartmentDetailsResult = await getEmptyDepartmentDetails(departmentID);
                    departmentDetailsResult = emptyDepartmentDetailsResult;
                    displayEmptyDepartment(departmentDetailsResult);
                } else {
                    displayDepartmentDetailsModal(departmentDetailsResult);
                }

                populateEditDepartmentDetailsModal(departmentDetailsResult);

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#departmentCloseBtn').attr('data-toggle', 'modal');
                    $('#departmentCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }
            }
        }
    } 

});

// Clicking locaiton delete button
$(document).on("click", "#location-delete-form", function() {

    $('#location-delete-name').html(locationDetailsResult['data2'][0]['location']);
    $('#delete-location-close-btn').attr('data-target', '#locationModal');

    $('#delete-location-final').hide();
    $('#delete-location-able').hide();
    $('#delete-location-unable').show();
    $('#location-delete-name').hide();

});

// **************************************************************************************** //

// ********************** Functions for sorting employees ********************************* //

let selectionEmployeeTable;

// Sort employees by last name
function displayAllEmployeesByLastName() {

    $.ajax({
        url: "libs/php/sortAllEmployeesByLastName.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
            if (result.status.name == "ok") { 

                if(currentView === 'table') {
                    createTable(result);     
                } else if (currentView === 'grid') {
                    createCards(result);
                }

                selectionEmployeeTable = result;
                searchMain();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 

}

// Set loading view to table and sort by employees last names
let currentView = 'table';

displayAllEmployeesByLastName();

// create the sort request to be sent to php
const createSortRequest = sortRequest => {

    let request = '';
    let count = 0;

    if(count > 0) {
        request += " OR ";
    }
    switch(sortRequest) {
        case 'sort-fname':
            request += "p.firstName, p.lastName, d.name, l.name";
            break;
        case 'sort-lname':
            request += "p.lastName, p.firstName, d.name, l.name";
            break;
        case 'sort-id':
            request += "p.id";
            break;
        case 'sort-job':
            request += "p.jobTitle, p.lastName, p.firstName, d.name, l.name";
            break;
        case 'sort-department':
            request += "d.name, p.lastName, p.firstName";
            break;
        case 'sort-location':
            request += "l.name, d.name, p.lastName, p.firstName";
            break;
        default:
    }

    count++;

    return request;

}

// ajax call to php to retrieve and display sorted data
function applySortRequest(request) {

    $.ajax({
        url: "libs/php/sortAllEmployees.php",
        type: 'POST',
        dataType: 'json',
        data: {
            request: request
        },
        success: function(result) {

            clearCurrentResults();

            if (result.status.name == "ok") { 

                for (i = 0; i < result.data.length ; i++) {

                    if(currentView === 'table') {
                        createTable(result);
                    } else if (currentView === 'grid') {
                        createCards(result);
                    }

                }
                
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 

}

// ajax call to php to retrieve and display filtered and sorted data
function applySortAndFilterRequest(filterRequest, sortRequest) {

    $.ajax({
        url: "libs/php/sortEmployeesWithFilter.php",
        type: 'POST',
        dataType: 'json',
        data: {
            filterRequest: filterRequest,
            sortRequest: sortRequest
        },
        success: function(result) {

            clearCurrentResults();

            if (result.status.name == "ok") { 

                for (i = 0; i < result.data.length ; i++) {

                    if(currentView === 'table') {
                        createTable(result);
                    } else if (currentView === 'grid') {
                        createCards(result);
                    }

                }
                
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 

}

// **************************************************************************************** //

// ********************** Functions for filtering employees ******************************* //

// create the filter request to be sent to php
const createFilterRequest = filterRequest => {

    let request = '';
    let count = 0;

    if(filterRequest.length > 0) {

        request += "WHERE ";

        filterRequest.forEach(function (filter) {

            if(count > 0) {
                request += " OR ";
            }

            let requestName = filter.slice(4);
            let requestType = filter.slice(0, 4);

            if(requestType === 'Dep-') {
                request += `d.name =  \'${requestName}\'`;
            } else if (requestType === 'Loc-') {
                request += `l.name =  \'${requestName}\'`;
            }

            count++;

        });

        return request;

    } 
}

// ajax call to php to retrieve and display filtered data
function applyFilterRequest(request) {

    $.ajax({
        url: "libs/php/filterAllEmployees.php",
        type: 'POST',
        dataType: 'json',
        data: {
            request: request
        },
        success: function(result) {

            clearCurrentResults();

            if (result.status.name == "ok") { 

                for (i = 0; i < result.data.length ; i++) {

                    if(currentView === 'table') {
                        createTable(result);
                    } else if (currentView === 'grid') {
                        createCards(result);
                    }

                }
                
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 

}

// **************************************************************************************** //

// ********************** Click events for sorting employees ****************************** //

// Sort all employees by first name
$(document).on("click", "#sort-fname", function() { 
 
    clearCurrentResults();

    let selectedSort = $(this).attr("id");

    const sortRequest = createSortRequest(selectedSort);

    if(filterActive) {
        applySortAndFilterRequest(filterRequest, sortRequest);
    } else {
        applySortRequest(sortRequest);
    }

});

// Sort all employees by last name
$(document).on("click", "#sort-lname", function() { 
 
    clearCurrentResults();

    let selectedSort = $(this).attr("id");
    
    const sortRequest = createSortRequest(selectedSort);

    if(filterActive) {
        applySortAndFilterRequest(filterRequest, sortRequest);
    } else {
        applySortRequest(sortRequest);
    }

});

// Sort all employees by id
$(document).on("click", "#sort-id", function() { 
 
    clearCurrentResults();

    let selectedSort = $(this).attr("id");
    
    const sortRequest = createSortRequest(selectedSort);

    if(filterActive) {
        applySortAndFilterRequest(filterRequest, sortRequest);
    } else {
        applySortRequest(sortRequest);
    }

});

// Sort all employees by job title
$(document).on("click", "#sort-job", function() { 
 
    clearCurrentResults();

    let selectedSort = $(this).attr("id");
    
    const sortRequest = createSortRequest(selectedSort);

    if(filterActive) {
        applySortAndFilterRequest(filterRequest, sortRequest);
    } else {
        applySortRequest(sortRequest);
    }

});

// Sort all employees by department
$(document).on("click", "#sort-department", function() { 
 
    clearCurrentResults();

    let selectedSort = $(this).attr("id");
    
    const sortRequest = createSortRequest(selectedSort);

    if(filterActive) {
        applySortAndFilterRequest(filterRequest, sortRequest);
    } else {
        applySortRequest(sortRequest);
    }

});

// Sort all employees by location
$(document).on("click", "#sort-location", function() { 
 
    clearCurrentResults();

    let selectedSort = $(this).attr("id");
    
    const sortRequest = createSortRequest(selectedSort);

    if(filterActive) {
        applySortAndFilterRequest(filterRequest, sortRequest);
    } else {
        applySortRequest(sortRequest);
    }

});

// **************************************************************************************** //

// ********************** Click events for filtering employees **************************** //

let filterActive = false;
let filterRequest;

// Filter apply button is clicked
$('#filter-apply').click(function() {

    filterActive = true;
    $("#filter-reset").css("display", "block");

    let checkedBoxes = $(".check-filter:checkbox:checked").map(function(){
        return $(this).attr("value");
    }).get();

    filterRequest = createFilterRequest(checkedBoxes);

    applyFilterRequest(filterRequest);
    
});

// Filter reset button is clicked
$('#filter-reset').click(function() {
    
    filterActive = false;
    $("#filter-reset").css("display", "none");

    let checkedBoxes = $(".check-filter:checkbox:checked");
    for(let i = 0; i < checkedBoxes.length; i++){
        if(checkedBoxes[i].type=='checkbox') {
            checkedBoxes[i].checked=false;
        }
    }

    clearCurrentResults();

    displayAllEmployeesByLastName();

});

// **************************************************************************************** //

// ****** Click events for creating, editing and deleting employees from side menu ******** //

// Clicking create button for employees (department dropdown list needs created) in side menu
$(document).on("click", "#create-employee-btn", async function() {
    const departments = await getAllDepartments();
    const listFor = 'modal';
    const departmentDropdownHtml = createDepartmentsDropdownList(departments, listFor);
    $('#employee-create-department').html('');
    $('#employee-create-department').append(departmentDropdownHtml);
});

// Clicking edit button for employees in side menu
$(document).on("click", "#edit-employee-btn", function() {

    $("#employee-select-table thead").remove();
    $("#employee-select-table tbody").remove();
    $("#selectionSearch").val('');

    const action = {
        selection: 'employee',
        execution: 'edit',
        target: '#editEmployeeModal'
    };

    createSelectTable(selectionEmployeeTable['data'], action);

});

// Clicking delete button for employees in side menu
$(document).on("click", "#delete-employee-btn", function() {

    $("#employee-select-table thead").remove();
    $("#employee-select-table tbody").remove();
    $("#selectionSearch").val('');

    const action = {
        selection: 'employee',
        execution: 'delete',
        target: '#deleteEmployeeModal',
    };

    createSelectTable(selectionEmployeeTable['data'], action);

});

// **************************************************************************************** //

// ********************** Search employees in tables inside select modal ****************** //

function searchTable() {

    let input = document.getElementById("selectionSearch");
    let filter = input.value.toUpperCase();
    let table = document.getElementById("employee-select-table");
    let tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
}

// **************************************************************************************** //

// ****** Click events for creating, editing and deleting department from side menu ******* //

// Clicking create button for department (location dropdown list needs created)
$(document).on("click", "#create-department-btn", async function() {
    const locations = await getAllLocations();
    const listFor = 'modal';
    const locationDropdownHtml = createLocationsDropdownList(locations, listFor);
    $('#department-create-location').html('');
    $('#department-create-location').append(locationDropdownHtml);
});

// Clicking edit button for department
$(document).on("click", "#edit-department-btn", async function() {

    $("#department-select-table thead").remove();
    $("#department-select-table tbody").remove();

    const action = {
        selection: 'department',
        execution: 'edit',
        target: '#editDepartmentModal'
    };

    let departments = await getAllDepartments();

    createSelectTable(departments, action);

});

// Clicking delete button for department in side menu
$(document).on("click", "#delete-department-btn", async function() {

    $("#department-select-table thead").remove();
    $("#department-select-table tbody").remove();

    const action = {
        selection: 'department',
        execution: 'delete',
        target: '#deleteDepartmentModal',
    };

    let departments = await getAllDepartments();

    createSelectTable(departments, action);

});

// **************************************************************************************** //

// *********** Click events for editing and deleting location from side menu ************** //

// Clicking edit button for location in side menu
$(document).on("click", "#edit-location-btn", async function() {

    $("#location-select-table thead").remove();
    $("#location-select-table tbody").remove();

    const action = {
        selection: 'location',
        execution: 'edit',
        target: '#editLocationModal'
    };

    let locations = await getAllLocations();

    createSelectTable(locations, action);

});

// Clicking delete button for location in side menu
$(document).on("click", "#delete-location-btn", async function() {

    $("#location-select-table thead").remove();
    $("#location-select-table tbody").remove();

    const action = {
        selection: 'location',
        execution: 'delete',
        target: '#deleteLocationModal'
    };

    let locations = await getAllLocations();

    createSelectTable(locations, action);

});

// **************************************************************************************** //

// ********************** Click events on modal tables ************************************ //

// Click table data cell
$(".table").on("click", "td", async function() {

    let typeOfCellSelect = $(this).attr('class');
    let employeeID;
    let departmentID;
    let name;
    const listFor = 'modal';

    switch (typeOfCellSelect) {
        case 'td-name name-column-modal td-edit-employee':
            employeeID = $(this).attr('value');
            employeeDetailsResult = await getEmployeeDetails(employeeID);
            $('#edit-employee-close-btn').attr('data-toggle', 'modal');
            $('#edit-employee-close-btn').attr('data-target', '#selectionEmployeeModal');

            const departments = await getAllDepartments();
            const departmentDropdownHtml = createDepartmentsDropdownList(departments, listFor);
            $('#employee-edit-department').html('');
            $('#employee-edit-department').append(departmentDropdownHtml);
            populateEditEmployeeDetailsModal(employeeDetailsResult);
            break;
        case 'td-name name-column-modal td-edit-department':
            departmentID = $(this).attr('value');
            departmentDetailsResult = await getDepartmentDetails(departmentID);
            if (departmentDetailsResult.length === 0) {
                emptyDepartmentDetailsResult = await getEmptyDepartmentDetails(departmentID);
                departmentDetailsResult = emptyDepartmentDetailsResult;
            }
            $('#edit-department-close-btn').attr('data-toggle', 'modal');
            $('#edit-department-close-btn').attr('data-target', '#selectionDepartmentModal');

            const locations = await getAllLocations();
            const locationDropdownHtml = createLocationsDropdownList(locations, listFor);
            $('#department-edit-location').html('');
            $('#department-edit-location').append(locationDropdownHtml);
            populateEditDepartmentDetailsModal(departmentDetailsResult);
            break;
        case 'td-name name-column-modal td-edit-location':
            const selectLocationId = $(this).attr('value');
            emptyLocationId = selectLocationId;
            locationDetailsResult = await getLocationDetails(selectLocationId);
            locationName = await getLocationName(selectLocationId);
            populateEditLocationDetailsModal(locationName);
            $('#edit-location-close-btn').attr('data-toggle', 'modal');
            $('#edit-location-close-btn').attr('data-target', '#selectionLocationModal');
            break;
        case 'td-name name-column-modal td-delete-employee':
            employeeID = $(this).attr('value');
            employeeDetailsResult = await getEmployeeDetails(employeeID);
            name = employeeDetailsResult['firstName'] + ' ' + employeeDetailsResult['lastName'];
            $('#employee-delete-name').html(name);
            $('#delete-close-btn').attr('data-toggle', 'modal');
            $('#delete-close-btn').attr('data-target', '#selectionEmployeeModal');
            break;
        case 'td-name name-column-modal td-delete-department':
            departmentID = $(this).attr('value');
            departmentDetailsResult = await getDepartmentDetails(departmentID);  
            emptyDepartmentDetailsResult = await getEmptyDepartmentDetails(departmentID);

            $('#delete-department-close-btn').attr('data-target', '#selectionDepartmentModal');

            if (departmentDetailsResult.length > 0) {
                $('#delete-department-final').hide();
                $('#delete-department-able').hide();
                $('#delete-department-unable').show();
                $('#department-delete-name').hide();
            } else {
                $('#delete-department-final').show();
                $('#delete-department-able').show();
                $('#delete-department-unable').hide();
                $('#department-delete-name').show();
                $('#department-delete-name').html(emptyDepartmentDetailsResult[0]['department']);
            }
            break;
        case 'td-name name-column-modal td-delete-location':
            emptyLocationId = $(this).attr('value');
            locationDetailsResult = await getLocationDetails(emptyLocationId);
            locationName = await getLocationName(emptyLocationId);

            if (locationDetailsResult['data'].length > 0) {
                $('#delete-location-final').hide();
                $('#delete-location-able').hide();
                $('#delete-location-unable').show();
                $('#location-delete-name').hide();
            } else {
                $('#delete-location-final').show();
                $('#delete-location-able').show();
                $('#delete-location-unable').hide();
                $('#location-delete-name').show();
                $('#location-delete-name').html(locationName);
            }

            $('#delete-location-close-btn').attr('data-target', '#selectionLocationModal');
            break;
        default:
            break;
    }

});

// **************************************************************************************** //

// ********************** Click events for selecting view ********************************* //

// Table view option is selected
$(document).on("click", "#table-view", function() { 
 
    clearCurrentResults(); 

    if(currentView === 'grid') {
        $( "#table-div" ).addClass( "tableFixHead" );
    }

    currentView = 'table';

    if(filterActive) {
        applyFilterRequest(filterRequest);
    } else {
        displayAllEmployeesByLastName();
    }

});

// Grid view option is selected
$(document).on("click", "#grid-view", function() { 

    clearCurrentResults();

    if(currentView === 'table') {
        $("#table-div").removeClass( "tableFixHead" );
    } 

    currentView = 'grid';

    if(filterActive) {
        applyFilterRequest(filterRequest);
    } else {
        displayAllEmployeesByLastName();
    }

});

// **************************************************************************************** //

// *************** Dropdown menu display functionality for Create, Update and Delete ****** //

let insideFilterDropdown = false;

function createDropdown() {

    $("#sidebar-item-create").toggleClass("active-dropdown");

    $("#createDropdown").toggleClass("show");
    $("#editDropdown").removeClass("show");
    $("#deleteDropdown").removeClass("show");
    $("#sortDropdown").removeClass("show");
    $("#filterDropdown").removeClass("show");

    $("#sidebar-item-sort").removeClass("active-dropdown");
    $("#sidebar-item-filter").removeClass("active-dropdown");
    $("#sidebar-item-edit").removeClass("active-dropdown");
    $("#sidebar-item-delete").removeClass("active-dropdown");

}

function editDropdown() {

    $("#sidebar-item-edit").toggleClass("active-dropdown");

    $("#editDropdown").toggleClass("show");
    $("#createDropdown").removeClass("show");
    $("#deleteDropdown").removeClass("show");
    $("#sortDropdown").removeClass("show");
    $("#filterDropdown").removeClass("show");

    $("#sidebar-item-create").removeClass("active-dropdown");
    $("#sidebar-item-delete").removeClass("active-dropdown");
    $("#sidebar-item-sort").removeClass("active-dropdown");
    $("#sidebar-item-filter").removeClass("active-dropdown");

}

function deleteDropdown() {

    $("#sidebar-item-delete").toggleClass("active-dropdown");

    $("#deleteDropdown").toggleClass("show");
    $("#createDropdown").removeClass("show");
    $("#editDropdown").removeClass("show");
    $("#sortDropdown").removeClass("show");
    $("#filterDropdown").removeClass("show");

    $("#sidebar-item-create").removeClass("active-dropdown");
    $("#sidebar-item-edit").removeClass("active-dropdown");
    $("#sidebar-item-sort").removeClass("active-dropdown");
    $("#sidebar-item-filter").removeClass("active-dropdown");

}

function sortDropdown() {

    $("#sidebar-item-sort").toggleClass("active-dropdown");

    $("#sortDropdown").toggleClass("show");
    $("#createDropdown").removeClass("show");
    $("#editDropdown").removeClass("show");
    $("#deleteDropdown").removeClass("show");
    $("#filterDropdown").removeClass("show");
    
    $("#sidebar-item-create").removeClass("active-dropdown");
    $("#sidebar-item-delete").removeClass("active-dropdown");
    $("#sidebar-item-filter").removeClass("active-dropdown");
    $("#sidebar-item-edit").removeClass("active-dropdown");
}

function filterDropdown() {

    if(!insideFilterDropdown) {
        $("#filterDropdown").toggleClass("show");
        $("#sortDropdown").removeClass("show");
        $("#createDropdown").removeClass("show");
        $("#editDropdown").removeClass("show");
        $("#deleteDropdown").removeClass("show");

        $("#sidebar-item-filter").toggleClass("active-dropdown");
        $("#sidebar-item-sort").removeClass("active-dropdown");
        $("#sidebar-item-create").removeClass("active-dropdown");
        $("#sidebar-item-edit").removeClass("active-dropdown");
        $("#sidebar-item-delete").removeClass("active-dropdown");
    } 

    insideFilterDropdown = false;
}

function filterDepartmentDropdown() {

    $("#filter-department").toggleClass("active-dropdown");

    document.getElementById("filterDepartmentDropdown").classList.toggle("show");
    insideFilterDropdown =  true;

    $("#filter-location").removeClass("active-dropdown");
    $("#filterLocationDropdown").removeClass("show");
}

function filterLocationDropdown() {

    $("#filter-location").toggleClass("active-dropdown");

    document.getElementById("filterLocationDropdown").classList.toggle("show");
    insideFilterDropdown =  true;

    $("#filter-department").removeClass("active-dropdown");
    $("#filterDepartmentDropdown").removeClass("show");
}
 
$(document).on("click", ".input-drop", function() { 

    $("#filterDropdown").addClass("show");
    $("#sidebar-item-filter").addClass("active-dropdown");
    
});

// **************************************************************************************** //

// ********************** Dropdown menu for sort and filter to load *********************** //

async function createFilterDropdown () {
    
    const listFor = 'filter';
    // Departments
    const departments = await getAllDepartments();
    const departmentDropdownHtml = createDepartmentsDropdownList(departments, listFor);
    $('#filterDepartmentDropdown').html('');
    $('#filterDepartmentDropdown').append(departmentDropdownHtml);

    // Locations
    const locations = await getAllLocations();
    const locationDropdownHtml = createLocationsDropdownList(locations, listFor);
    $('#filterLocationDropdown').html('');
    $('#filterLocationDropdown').append(locationDropdownHtml);

}

createFilterDropdown();

// **************************************************************************************** //

// *** Close the dropdown OR removes active highlight if the user clicks outside ********** //

window.onclick = function(event) {

    if (!event.target.matches('.sidebar-item') && !event.target.matches('.input-drop')  && !event.target.matches('.check-filter')  && !event.target.matches('label')) {

        let dropdowns = document.getElementsByClassName("dropdown-content");
        let i;
        for (i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }

        if (!event.target.matches('.sidebar-item')) {
            let actives = document.getElementsByClassName("active-dropdown");
            let i;
            for (i = 0; i < actives.length; i++) {
                actives[i].classList.remove('active-dropdown');
            }
        }

    }

}

// **************************************************************************************** //

// ********************** Close sidebar in mobile applications **************************** //

// Find loading window width and set side menu ability to close sidebarMenu
function initialWindowWidth() {

    const width = window.innerWidth;

    if (width < 768) {
        $(".closeMenu").attr( "data-toggle", "collapse" );
        $(".closeMenu").attr( "data-target", "#sidebarMenu" );
        
    }
    else if (width > 768) {
        $(".closeMenu").removeAttr( "data-toggle", "collapse" );
        $(".closeMenu").removeAttr( "data-target", "#sidebarMenu" );
    }

}

initialWindowWidth();

// Find window width if screen resizes and set side menu ability to close sidebarMenu
$(window).resize(function() {

    const width = window.innerWidth;

    if (width < 768) {
        $(".closeMenu").attr( "data-toggle", "collapse" );
        $(".closeMenu").attr( "data-target", "#sidebarMenu" );
        
    }
    else if (width > 768) {
        $(".closeMenu").removeAttr( "data-toggle", "collapse" );
        $(".closeMenu").removeAttr( "data-target", "#sidebarMenu" );
    }

});

// **************************************************************************************** //

// *********************** Register serviceWorker ***************************************** //

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {

    }).catch(error => {

    });
}

// **************************************************************************************** //