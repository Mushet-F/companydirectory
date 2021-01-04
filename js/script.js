// ********************** Displaying main employees table ********************************* //

function showAllEmployeesTable() {
    $.ajax({
        url: "libs/php/getAll.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
            if (result.status.name == "ok") { 

                createTable(result);
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}

showAllEmployeesTable();

// **************************************************************************************** //

// ********************** Creating main employees table *********************************** //

function createTable(result) {
    
    let table = `                
        <thead>
            <tr>
                <th onclick="sortTableNum()">ID</th>
                <th onclick="sortTableWord(1)">Name</th>
                <th onclick="sortTableWord(2)">Job Title</th>
                <th onclick="sortTableWord(3)">Email</th>
                <th onclick="sortTableWord(4)">Department</th>
                <th onclick="sortTableWord(5)">Location</th>
            </tr>
        </thead>
        <tbody>

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
        <td value="cell-id">${id} <i class="fas fa-grip-lines-vertical"></i></td>
        <td value="cell-name">${name} <i class="fas fa-expand-alt"></i></td>
        <td value="cell-job"><span class="red-highlight">${job}</span></td>
        <td value="cell-email">${email}</td>
        <td value="cell-department">${department} <i class="fas fa-expand-alt"></i></td>
        <td value="cell-location">${location} <i class="fas fa-expand-alt"></i></td>
        </tr>`;

        $("#all-employees").append(tbody);
        
    }
}

// **************************************************************************************** //

// ********************** Click event to display table view of employees ****************** //

$(document).on("click", "#table-view", function(e) { 
 
    $(".employee-card").remove();

    showAllEmployeesTable();

});


// **************************************************************************************** //

// ********************** Displaying main employees grid ********************************** //

function displayCards(result) {

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

}

function showAllEmployeesGrid() {

    $.ajax({
        url: "libs/php/getAll.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
            if (result.status.name == "ok") { 

                displayCards(result);
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
}

function showAllEmployeesByFirstName() {

    $.ajax({
        url: "libs/php/sortAllEmployeesByFirstName.php",
        type: 'POST',
        dataType: 'json',
        success: function(result) {
            if (result.status.name == "ok") { 

                for (i = 0; i < result.data.length ; i++) {

                    displayCards(result);

                }
                
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 

}

// **************************************************************************************** //

// ********************** Click event to display grid view of employees ******************* //

$(document).on("click", "#grid-view", function(e) { 
 
    $("#all-employees thead").remove();
    $("#all-employees tbody").remove();

    showAllEmployeesGrid();

});

$(document).on("click", "#sort-fname", function(e) { 
 
    $("#all-employees thead").remove();
    $("#all-employees tbody").remove();
    $(".employee-card").remove();

    showAllEmployeesByFirstName();

});


// **************************************************************************************** //

// ********************** Displaying employees details ************************************ //

function showEmployeeDetails(id) {
    $.ajax({
        url: "libs/php/getPersonnel.php",
        type: 'POST',
        dataType: 'json',
        data: {
            id: id
        },
        success: function(result) {
            console.log(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            reject(errorThrown);
        }
    }); 
    
}

// Show employees details clicked event
$(document).on("click", ".employee-card", function(e) {
 
    let id = $(this).attr('value');
    showEmployeeDetails(id);

});

// **************************************************************************************** //

// ********************** Main table and its actions  ************************************* //

$('tbody').on('click', 'tr:has(td)', function() {
    console.log("clieckedqq");
    if($(this).data('clicked')) {
      return;
    }
 
    //some code;
 
    $(this).data('clicked', true);
 });

// Click table cell
$("#all-employees").on("click", "td", function() {

    let value = $(this).attr('value');
    console.log('clicked!!');
    console.log(value);

    switch (value) {
        case 'cell-name':
            $(this).attr('data-toggle', 'modal');
            $(this).attr('data-target', '#employeeModal');
            break;
        case 'cell-department':
            $(this).attr('data-toggle', 'modal');
            $(this).attr('data-target', '#departmentModal');
            break;
        case 'cell-location':
            $(this).attr('data-toggle', 'modal');
            $(this).attr('data-target', '#locationModal');
            break;
        default:
            break;
    }

});


function sortTableWord(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("all-employees");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc"; 
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch= true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount ++;      
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
}

function sortTableNum() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("all-employees");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[0];
        y = rows[i + 1].getElementsByTagName("TD")[0];

        xNum = Number(x.innerHTML.replace('<i class="fas fa-grip-lines-vertical"></i>', ''));
        yNum = Number(y.innerHTML.replace('<i class="fas fa-grip-lines-vertical"></i>', ''));

        //check if the two rows should switch place:
        if (xNum > yNum) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
}

// **************************************************************************************** //

// ********************** Side bar and its actions  *************************************** //

$(document).on("click", "#table-view", function(e) { 
 
    $(".employee-card").remove();
    $("#all-employees thead").remove();
    $("#all-employees tbody").remove();

    showAllEmployeesTable();

});

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
    }
    }
}
}