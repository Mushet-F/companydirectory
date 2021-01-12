// ********************** Creating main employees table *********************************** //

function createTable(result) {
 
    let table = `  
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Job Title</th>
                <th>Email</th>
                <th>Department</th>
                <th>Location</th>
            </tr>
        </thead>
        <tbody id="tbody-employees">

        </tbody>`;

    $("#all-employees").append(table);

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
        <td class="td-name"  data-toggle="modal" data-target="#employeeModal" value="${id}">${name} <i class="fas fa-expand-alt"></i></td>
        <td class="td-job"><span class="red-highlight">${job}</span></td>
        <td class="td-email">${email}</td>
        <td class="td-department" data-toggle="modal" data-target="#departmentModal" value="${departmentID}">${department} <i class="fas fa-expand-alt"></i></td>
        <td class="td-location" data-toggle="modal" data-target="#locationModal" value="${locationID}">${location} <i class="fas fa-expand-alt"></i></td>
        </tr>`;

        $("#all-employees").append(tbody);
        
    }

    currentView = 'table';
}

// **************************************************************************************** //

// ********************** Displaying main employees grid ********************************** //

function createCards(result) {

    for (i = 0; i < result.data.length ; i++) {

        const id = result.data[i]['id'];
        const name = result.data[i]['firstName'] + " " + result.data[i]['lastName'];
        // NO JOB TITLE IN TABLE
        const job = result.data[i]['jobTitle']; 
        // const job = "JobTitle";
        const email = result.data[i]['email'];
        const department = result.data[i]['department'];
        const location = result.data[i]['location'];


        let html = `<div class='col-md-6 col-lg-4 employee-card' data-toggle="modal" data-target="#employeeModal" value=${id}><div class='box'><img class='rounded-circle' src='./img/avatar.png'>
        <h3 class='name'>${name}</h3>                            
        <p class="title">${job}</p>
        <p class="description">${email}</p>
        <p class="description">${department}</p>
        <p class="description">${location}</p></div></div>`;

        $("div .people").append(html);

    }

    currentView = 'grid';

}

// **************************************************************************************** //

// ********************** Clear table or grid to produce new set of results *************** //

function clearCurrentResults() {

    if(currentView === 'table') {
        $("#all-employees thead").remove();
        $("#all-employees tbody").remove();
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
    }

}

// **************************************************************************************** //

// ********************** Functions for sorting employees ********************************* //

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
            switch(filter) {
                case 'jobTitle':
                    request += "p.jobTitle =  \'\'";
                    break;
                case 'hr':
                    request += "d.name =  \'Human Resources\'";
                    break;
                case 'sales':
                    request += "d.name =  \'Sales\'";
                    break;
                case 'marketing':
                    request += "d.name =  \'Marketing\'";
                    break;
                case 'legal':
                    request += "d.name = \'Legal\'";
                    break;
                case 'services':
                    request += "d.name = \'Services\'";
                    break;
                case 'research':
                    request += "d.name = \'Research and Development\'";
                    break;
                case 'product':
                    request += "d.name = \'Product Management\'";
                    break;
                case 'training':
                    request += "d.name = \'Training\'";
                    break;
                case 'support':
                    request += "d.name = \'Support\'";
                    break;
                case 'engineering':
                    request += "d.name = \'Engineering\'";
                    break;
                case 'accounting':
                    request += "d.name = \'Accounting\'";
                    break;
                case 'business':
                    request += "d.name = \'Business Development\'";
                    break;
                case 'london':
                    request += "l.name = \'London\'";
                    break;
                case 'munich':
                    request += "l.name = \'Munich\'";
                    break;
                case 'newyork':
                    request += "l.name = \'New York\'";
                    break;
                case 'paris':
                    request += "l.name = \'Paris\'";
                    break;
                case 'rome':
                    request += "l.name = \'Rome\'";
                    break;
                default:

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

// ********************** Function to convert department name to department id ************* //

const departmentNameToID = name => {

    switch(name) {
        case 'Human Resources':
            return 1;
            break;
        case 'Sales':
            return 2;
            break;
        case 'Marketing':
            return 3;
            break;
        case 'Legal':
            return 4;
            break;
        case 'Services':
            return 5;
            break;
        case 'Research and Development':
            return 6;
            break;
        case 'Product Management':
            return 7;
            break;
        case 'Training':
            return 8;
            break;
        case 'Support':
            return 9;
            break;
        case 'Engineering':
            return 10;
            break;
        case 'Accounting':
            return 11;
            break;
        case 'Business Development':
            return 12;
            break;
        default:

    }
}

// **************************************************************************************** //

// ************ Retrieving and displaying data for Employee Modals ************************ //

let employeeDetailsResult;

// Create 
function createEmployee() {

    const firstName = $('#employee-create-firstName').val();
    const lastName = $('#employee-create-lastName').val();
    const jobTitle = $('#employee-create-jobTitle').val();
    const email = $('#employee-create-email').val();
    const departmentID = $('#employee-create-department option:selected').val();

    console.log(firstName);
    console.log(lastName);
    console.log(jobTitle);
    console.log(email);
    console.log(departmentID);

    $.ajax({
        url: "libs/php/createEmployee.php",
        type: 'POST',
        dataType: 'json',
        data: {
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            email: email,
            departmentID: departmentID
        },
        success: async function(result) {

            console.log(result);
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

}

// Update employee details modal
function updateEmployeeDetails() {

    const id = employeeDetailsResult['id'];

    const firstName = $('#employee-edit-firstName').val();
    const lastName = $('#employee-edit-lastName').val();
    const jobTitle = $('#employee-edit-jobTitle').val();
    const email = $('#employee-edit-email').val();
    const departmentID = $('#employee-edit-department option:selected').val();

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
            departmentID: departmentID
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                employeeDetailsResult = await getEmployeeDetails(id);
                displayEmployeeDetailsModal(employeeDetailsResult);
                populateEditEmployeeDetailsModal(employeeDetailsResult);
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

// Delete

// **************************************************************************************** //

// ************ Retrieving and displaying data for Department Modals ********************** //

let departmentDetailsResult;

// Department details
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


    console.log(department);

    $('#modal-department-id').html(department[0]['id']);
    $('#modal-department-name').html(department[0]['department']);
    $('#modal-department-location').html(department[0]['location']);
    $('#modal-department-number-employees').html(department.length);

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

    $('#modal-department-location').attr('value', department['locationID']);

    if(trackingModals.length === 0) {
        let modalType = '#departmentModal';
        let currentModal = {
            details: department, 
            type: modalType
        };
        trackingModals.push(currentModal);
    }

}

// Edit department details modal form to be updated to match department details
function populateEditDepartmentDetailsModal(department) {

    $('#department-edit-name').val(department[0]['department']);
    $('#department-edit-location').val(department[0]['locationID']);

}

// Update employee details modal
function updateDepartmentDetails() {

    const id = departmentDetailsResult[0]['id'];

    const name = $('#department-edit-name').val();
    const locationID = $('#department-edit-location').val();

    $.ajax({
        url: "libs/php/updateDepartmentDetails.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id,
            name: name,
            locationID: locationID
        },
        success: async function(result) {

            if(result['status']['code'] === '200') {
                
                departmentDetailsResult = await getDepartmentDetails(id);
                displayDepartmentDetailsModal(departmentDetailsResult);
                populateEditDepartmentDetailsModal(departmentDetailsResult);
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

// ************ Retrieving and displaying data for Location Modals ********************** //

let locationDetailsResult;

// Department details
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

    let departmentListHtml = '';

    for(let i = 0; i < location['data2'].length; i++) {
        let department = location['data2'][i]['department'];
        let departmentID = location['data2'][i]['departmentID'];
        let html = `<span class="department-highlight location-departments" data-dismiss="modal" data-toggle="modal" data-target="#departmentModal" value="${departmentID}">${department}</span> `;
        let comma = ' , ';

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

// **************************************************************************************** //

// ********************** Click events for employee modal ********************************* //

// Selecting to open a modal from another modal tracker
let trackingModals = [];

// Selecting an department in employee modal
$(document).on("click", "#modal-employee-department", async function(e) {

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
$(document).on("click", "#modal-employee-location", async function(e) {

    let locationID = $(this).attr('value');
    locationDetailsResult = await getLocationDetails(locationID);
    displayLocationDetailsModal(locationDetailsResult);

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
$(document).on("click", "#employeeCloseBtn", async function(e) {

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

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#locationCloseBtn').attr('data-toggle', 'modal');
                    $('#locationCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }
            }
        }
    } 

});


// **************************************************************************************** //

// ********************** Click events for department modal ******************************* //

// Selecting an employee in department modal
$(document).on("click", ".department-employee", async function(e) {

    let employeeId = $(this).attr('value');
    employeeDetailsResult = await getEmployeeDetails(employeeId);
    displayEmployeeDetailsModal(employeeDetailsResult);
    populateEditEmployeeDetailsModal(employeeDetailsResult);

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
$(document).on("click", "#modal-department-location", async function(e) {

    let locationID = $(this).attr('value');
    locationDetailsResult = await getLocationDetails(locationID);
    displayLocationDetailsModal(locationDetailsResult);

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
$(document).on("click", "#departmentCloseBtn", async function(e) {

    if(trackingModals.length > 0) {
        trackingModals.pop();
        $('#departmentCloseBtn').removeAttr('data-toggle');
        $('#departmentCloseBtn').removeAttr('data-target');

        if(trackingModals.length > 0) {
            let nextModal = trackingModals[trackingModals.length - 1];

            if (nextModal['type'] === '#employeeModal'){
                employeeDetailsResult = nextModal['details'];
                displayEmployeeDetailsModal(employeeDetailsResult);
                populateEditEmployeeDetailsModal(employeeDetailsResult);

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#employeeCloseBtn').attr('data-toggle', 'modal');
                    $('#employeeCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }

            } else if (nextModal['type'] === '#locationModal') {
                locationDetailsResult = nextModal['details'];
                displayLocationDetailsModal(locationDetailsResult);

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#locationCloseBtn').attr('data-toggle', 'modal');
                    $('#locationCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }
            }
        }
    } 

});

// **************************************************************************************** //

// ********************** Click events for location modal ********************************* //

// Selecting an employee in location modal
$(document).on("click", ".location-employee", async function(e) {

    let employeeId = $(this).attr('value');
    employeeDetailsResult = await getEmployeeDetails(employeeId);
    displayEmployeeDetailsModal(employeeDetailsResult);
    populateEditEmployeeDetailsModal(employeeDetailsResult);

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

// Selecting an department in employee modal
$(document).on("click", ".location-departments", async function(e) {

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

// Click department modal close button and whether to redirect to another modal
$(document).on("click", "#locationCloseBtn", async function(e) {

    if(trackingModals.length > 0) {
        trackingModals.pop();
        $('#locationCloseBtn').removeAttr('data-toggle');
        $('#locationCloseBtn').removeAttr('data-target');

        if(trackingModals.length > 0) {
            let nextModal = trackingModals[trackingModals.length - 1];

            if (nextModal['type'] === '#employeeModal'){
                employeeDetailsResult = nextModal['details'];
                displayEmployeeDetailsModal(employeeDetailsResult);
                populateEditEmployeeDetailsModal(employeeDetailsResult);

                if (trackingModals.length > 1) {
                    let closeBtnTarget = trackingModals[trackingModals.length - 2]['type'];
                    $('#employeeCloseBtn').attr('data-toggle', 'modal');
                    $('#employeeCloseBtn').attr('data-target', `${closeBtnTarget}`);
                }

            } else if (nextModal['type'] === '#departmentModal') {
                departmentDetailsResult = nextModal['details'];
                displayDepartmentDetailsModal(departmentDetailsResult);
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

// **************************************************************************************** //

// ********************** Click events for selecting view ********************************* //

// Table view option is selected
$(document).on("click", "#table-view", function(e) { 
 
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
$(document).on("click", "#grid-view", function(e) { 

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

// ********************** Click events for sorting employees ****************************** //

// Sort all employees by first name
$(document).on("click", "#sort-fname", function(e) { 
 
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
$(document).on("click", "#sort-lname", function(e) { 
 
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
$(document).on("click", "#sort-id", function(e) { 
 
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
$(document).on("click", "#sort-job", function(e) { 
 
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
$(document).on("click", "#sort-department", function(e) { 
 
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
$(document).on("click", "#sort-location", function(e) { 
 
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

// ********************** Click events on table and cards ********************************* //

// Click cards and display employee details
$(document).on("click", ".employee-card", async function(e) {
 
    let employeeId = $(this).attr('value');
    employeeDetailsResult = await getEmployeeDetails(employeeId);
    displayEmployeeDetailsModal(employeeDetailsResult);
    populateEditEmployeeDetailsModal(employeeDetailsResult);

});

// Click table data cell
$("#all-employees").on("click", "td", async function() {

    let typeOfCellSelect = $(this).attr('class');

    switch (typeOfCellSelect) {
        case 'td-name':
            let employeeId = $(this).attr('value');
            employeeDetailsResult = await getEmployeeDetails(employeeId);
            displayEmployeeDetailsModal(employeeDetailsResult);
            populateEditEmployeeDetailsModal(employeeDetailsResult);
            break;
        case 'td-department':
            let departmentID = $(this).attr('value');
            departmentDetailsResult = await getDepartmentDetails(departmentID);
            displayDepartmentDetailsModal(departmentDetailsResult);
            populateEditDepartmentDetailsModal(departmentDetailsResult);
            break;
        case 'td-location':
            let locationID = $(this).attr('value');
            locationDetailsResult = await getLocationDetails(locationID);
            displayLocationDetailsModal(locationDetailsResult);
            break;
        default:
            break;
    }

});

// **************************************************************************************** //

// ********************** Dropdown menu for sort and filter ******************************* //

let insideFilterDropdown = false;

function sortDropdown() {

    $("#sidebar-item-sort").toggleClass("active-dropdown");

    document.getElementById("sortDropdown").classList.toggle("show");
    document.getElementById("filterDropdown").classList.remove("show");
    $("#sidebar-item-filter").removeClass("active-dropdown");
}

function filterDropdown() {

    if(!insideFilterDropdown) {
        document.getElementById("filterDropdown").classList.toggle("show");
        document.getElementById("sortDropdown").classList.remove("show");
        $("#sidebar-item-filter").toggleClass("active-dropdown");
        $("#sidebar-item-sort").removeClass("active-dropdown");
    } 

    insideFilterDropdown = false;
}

function filterJobDropdown() {

    $("#filter-job").toggleClass("active-dropdown");

    document.getElementById("filterJobDropdown").classList.toggle("show");
    insideFilterDropdown =  true;

    $("#filter-department").removeClass("active-dropdown");
    $("#filterDepartmentDropdown").removeClass("show");
    $("#filter-location").removeClass("active-dropdown");
    $("#filterLocationDropdown").removeClass("show");
}

function filterDepartmentDropdown() {

    $("#filter-department").toggleClass("active-dropdown");

    document.getElementById("filterDepartmentDropdown").classList.toggle("show");
    insideFilterDropdown =  true;

    $("#filter-job").removeClass("active-dropdown");
    $("#filterJobDropdown").removeClass("show");
    $("#filter-location").removeClass("active-dropdown");
    $("#filterLocationDropdown").removeClass("show");
}

function filterLocationDropdown() {

    $("#filter-location").toggleClass("active-dropdown");

    document.getElementById("filterLocationDropdown").classList.toggle("show");
    insideFilterDropdown =  true;

    $("#filter-job").removeClass("active-dropdown");
    $("#filterJobDropdown").removeClass("show");
    $("#filter-department").removeClass("active-dropdown");
    $("#filterDepartmentDropdown").removeClass("show");
}
 
$(document).on("click", ".input-drop", function(e) { 

    $("#filterDropdown").addClass("show");
    $("#sidebar-item-filter").addClass("active-dropdown");
    
});

// Close the dropdown OR removes active highlight if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.sidebar-item') && !event.target.matches('.input-drop')  && !event.target.matches('.check-filter')  && !event.target.matches('label')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
        }
    }

    if (!event.target.matches('.sidebar-item')) {
        var actives = document.getElementsByClassName("active-dropdown");
        var i;
        for (i = 0; i < actives.length; i++) {
            actives[i].classList.remove('active-dropdown');
        }
    }

}
}