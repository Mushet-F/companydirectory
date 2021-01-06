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
        <td value="td-id">${id} <i class="fas fa-grip-lines-vertical"></i></td>
        <td value="td-name">${name} <i class="fas fa-expand-alt"></i></td>
        <td value="td-job"><span class="red-highlight">${job}</span></td>
        <td value="td-email">${email}</td>
        <td value="td-department">${department} <i class="fas fa-expand-alt"></i></td>
        <td value="td-location">${location} <i class="fas fa-expand-alt"></i></td>
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

// ********************** Display all  **************************************************** //

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

// Sort employees by last name
function displayAllEmployeesByFirstName() {

    $.ajax({
        url: "libs/php/sortAllEmployeesByFirstName.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
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

// Sort employees by id
function displayAllEmployeesById() {

    $.ajax({
        url: "libs/php/sortAllEmployeesById.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
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

// Sort employees by job title
function displayAllEmployeesByJobTitle() {

    $.ajax({
        url: "libs/php/sortAllEmployeesByJobTitle.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
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

// Sort employees by department
function displayAllEmployeesByDepartment() {

    $.ajax({
        url: "libs/php/sortAllEmployeesByDepartment.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
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

// Sort employees by location
function displayAllEmployeesByLocation() {

    $.ajax({
        url: "libs/php/sortAllEmployeesByLocation.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
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

// ********************** Displaying employees details ************************************ //

// Employee details
function displayEmployeeDetails(id) {
    $.ajax({
        url: "libs/php/getPersonnel.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {

        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
    
}

// **************************************************************************************** //

// ********************** Click events for side bar **************************************** //

// Table view option is selected
$(document).on("click", "#table-view", function(e) { 
 
    if(currentView === 'table') {
        $("#all-employees thead").remove();
        $("#all-employees tbody").remove();
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
        $( "#table-div" ).addClass( "tableFixHead" );
    }

    currentView = 'table';

    displayAllEmployeesByLastName();

});

// Grid view option is selected
$(document).on("click", "#grid-view", function(e) { 

    if(currentView === 'table') {
        $("#all-employees thead").remove();
        $("#all-employees tbody").remove();
        $("#table-div").removeClass( "tableFixHead" );
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
    }

    currentView = 'grid';

    displayAllEmployeesByLastName();

});

// Sort all employees by first name
$(document).on("click", "#sort-fname", function(e) { 
 
    if(currentView === 'table') {
        $("#all-employees thead").remove();
        $("#all-employees tbody").remove();
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
    }
    
    displayAllEmployeesByFirstName();

});

// Sort all employees by last name
$(document).on("click", "#sort-lname", function(e) { 
 
    if(currentView === 'table') {
        $("#all-employees thead").remove();
        $("#all-employees tbody").remove();
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
    }

    displayAllEmployeesByLastName();

});

// Sort all employees by id
$(document).on("click", "#sort-id", function(e) { 
 
    if(currentView === 'table') {
        $("#all-employees thead").remove();
        $("#all-employees tbody").remove();
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
    }

    displayAllEmployeesById();

});

// Sort all employees by job title
$(document).on("click", "#sort-job", function(e) { 
 
    if(currentView === 'table') {
        $("#all-employees thead").remove();
        $("#all-employees tbody").remove();
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
    }

    displayAllEmployeesByJobTitle();

});

// Sort all employees by department
$(document).on("click", "#sort-department", function(e) { 
 
    if(currentView === 'table') {
        $("#all-employees thead").remove();
        $("#all-employees tbody").remove();
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
    }

    displayAllEmployeesByDepartment();

});

// Sort all employees by location
$(document).on("click", "#sort-location", function(e) { 
 
    if(currentView === 'table') {
        $("#all-employees thead").remove();
        $("#all-employees tbody").remove();
    } else if(currentView === 'grid') {
        $(".employee-card").remove();
    }

    displayAllEmployeesByLocation();

});

// **************************************************************************************** //

// ********************** Click events on table and cards ********************************* //

// Click cards and display employee details
$(document).on("click", ".employee-card", function(e) {
 
    let id = $(this).attr('value');
    displayEmployeeDetails(id);

});

// Click table data cell
$("#all-employees").on("click", "td", function() {

    let value = $(this).attr('value');

    switch (value) {
        case 'td-name':
            $(this).attr('data-toggle', 'modal');
            $(this).attr('data-target', '#employeeModal');
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
    document.getElementById("sortDropdown").classList.toggle("show");
    document.getElementById("filterDropdown").classList.remove("show");
}

function filterDropdown() {

    $("#sidebar-item-filter").addClass("active-dropdown");
    if(!insideFilterDropdown) {
        document.getElementById("filterDropdown").classList.toggle("show");
        document.getElementById("sortDropdown").classList.remove("show");
    }

    insideFilterDropdown = false;
}

function filterJobDropdown() {

    $("#filter-job").toggleClass("active-dropdown");

    document.getElementById("filterJobDropdown").classList.toggle("show");
    insideFilterDropdown =  true;
}

function filterDepartmentDropdown() {

    $("#filter-department").toggleClass("active-dropdown");

    document.getElementById("filterDropdown").classList.toggle("show");
    document.getElementById("filterDepartmentDropdown").classList.toggle("show");
}

function filterLocationDropdown() {

    $("#filter-location").toggleClass("active-dropdown");

    document.getElementById("filterDropdown").classList.toggle("show");
    document.getElementById("filterLocationDropdown").classList.toggle("show");
}
 
$(document).on("click", ".input-drop", function(e) { 

    $("#filterDropdown").addClass("show");
    $("#sidebar-item-filter").addClass("active-dropdown");
    
});

// Close the dropdown OR removes active highlight if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.sidebar-item') && !event.target.matches('.input-drop')  && !event.target.matches('.check-filter')  && !event.target.matches('label')) {
    console.log('INSIDE CLOSE DROPDOWN');
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