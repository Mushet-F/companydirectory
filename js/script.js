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
        // NO JOB TITLE IN TABLE
        // const job = result.data[i]['jobTitle']; 
        const job = "JobTitle";
        const email = result.data[i]['email'];
        const department = result.data[i]['department'];
        const location = result.data[i]['location'];

        let tbody = `<tr>
        <td class="td-id">${id} <i class="fas fa-grip-lines-vertical"></i></td>
        <td class="td-name"  data-toggle="modal" data-target="#employeeModal" value="${id}">${name} <i class="fas fa-expand-alt"></i></td>
        <td class="td-job"><span class="red-highlight">${job}</span></td>
        <td class="td-email">${email}</td>
        <td class="td-department">${department} <i class="fas fa-expand-alt"></i></td>
        <td class="td-location">${location} <i class="fas fa-expand-alt"></i></td>
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
        // const job = result.data[i]['jobTitle']; 
        const job = "JobTitle";
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

// ********************** Retrieving and displaying data for Modals *********************** //

let employeeDetails;

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

                console.log('employee ',  employee);

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
    // $('#modal-employee-job').html(result['data'][0]['jobTitle']);
    $('#modal-employee-job').html('Job Title');
    $('#modal-employee-email').html(employee['email']);
    $('#modal-employee-department').html(employee['department']);
    $('#modal-employee-location').html(employee['location']);

}

// Edit employee details

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
    employeeDetails = await getEmployeeDetails(employeeId);
    displayEmployeeDetailsModal(employeeDetails);

});

// Click table data cell
$("#all-employees").on("click", "td", async function() {

    let typeOfCellSelect = $(this).attr('class');
    let employeeId = $(this).attr('value');

    switch (typeOfCellSelect) {
        case 'td-name':
            employeeDetails = await getEmployeeDetails(employeeId);
            displayEmployeeDetailsModal(employeeDetails);
            break;
        case 'td-department':
            $(this).attr('data-toggle', 'modal');
            $(this).attr('data-target', '#departmentModal');
            break;
        case 'td-location':
            $(this).attr('data-toggle', 'modal');
            $(this).attr('data-target', '#locationModal');
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