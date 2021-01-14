const staticAssets = [
    './',
    './index.html',
    './manifest.json',
    './favicon.ico',
    './libs/css/index.css',
    './img/avatar.png',
    './img/icon-192x192.png',
    './img/icon-512x512.png',
    './libs/js/script.js',
    './libs/php/config.php',
    './libs/php/createDepartment.php',
    './libs/php/createLocation.php',
    './libs/php/createEmployee.php',
    './libs/php/deleteDepartmentByID.php',
    './libs/php/deleteEmployeeByID.php',
    './libs/php/deleteLocationByID.php',
    './libs/php/filterAllEmployees.php',
    './libs/php/getAllDepartments.php',
    './libs/php/getAllLocations.php',
    './libs/php/getDepartmentDetailsByID.php',
    './libs/php/getEmployeeDetails.php',
    './libs/php/getEmptyDepartmentDetailsByID.php',
    './libs/php/getLocationDetailsByID.php',
    './libs/php/sortAllEmployees.php',
    './libs/php/sortAllEmployeesByLastName.php',
    './libs/php/sortEmployeesWithFilter.php',
    './libs/php/updateDepartmentDetails.php',
    './libs/php/updateEmployeeDetails.php',
    './libs/php/updateLocationDetails.php',
    './libs/sql/companydirectory.sql',
    './vendors/bootstrap/css/bootstrap-grid.css',
    './vendors/bootstrap/css/bootstrap-grid.css.map',
    './vendors/bootstrap/css/bootstrap-grid.min.css',
    './vendors/bootstrap/css/bootstrap-grid.min.css.map',
    './vendors/bootstrap/css/bootstrap-reboot.css',
    './vendors/bootstrap/css/bootstrap-reboot.css.map',
    './vendors/bootstrap/css/bootstrap-reboot.min.css',
    './vendors/bootstrap/css/bootstrap-reboot.min.css.map',
    './vendors/bootstrap/css/bootstrap.css',
    './vendors/bootstrap/css/bootstrap.css.map',
    './vendors/bootstrap/css/bootstrap.min.css',
    './vendors/bootstrap/css/bootstrap.min.css.map',
    './vendors/bootstrap/js/bootstrap.bundle.js',
    './vendors/bootstrap/js/bootstrap.bundle.js.map',
    './vendors/bootstrap/js/bootstrap.bundle.min.js',
    './vendors/bootstrap/js/bootstrap.bundle.min.js.map',
    './vendors/bootstrap/js/bootstrap.js',
    './vendors/bootstrap/js/bootstrap.js.map',
    './vendors/bootstrap/js/bootstrap.min.js',
    './vendors/bootstrap/js/bootstrap.min.js.map',
    './vendors/fontawesome/css/all.min.css',
    './vendors/fontawesome/webfonts/fa-solid-900.woff2',
    './vendors/fonts/ubuntu-v15-latin-500.eot',
    './vendors/fonts/ubuntu-v15-latin-500.svg',
    './vendors/fonts/ubuntu-v15-latin-500.ttf',
    './vendors/fonts/ubuntu-v15-latin-500.woff',
    './vendors/fonts/ubuntu-v15-latin-500.woff2',
    './vendors/fonts/ubuntu-v15-latin-700.eot',
    './vendors/fonts/ubuntu-v15-latin-700.svg',
    './vendors/fonts/ubuntu-v15-latin-700.ttf',
    './vendors/fonts/ubuntu-v15-latin-700.woff',
    './vendors/fonts/ubuntu-v15-latin-700.woff2',
    './vendors/fonts/ubuntu-v15-latin-regular.eot',
    './vendors/fonts/ubuntu-v15-latin-regular.svg',
    './vendors/fonts/ubuntu-v15-latin-regular.ttf',
    './vendors/fonts/ubuntu-v15-latin-regular.woff',
    './vendors/fonts/ubuntu-v15-latin-regular.woff2',
    './vendors/jquery/jquery-3.5.1.min.js'
];

self.addEventListener('install',  e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(staticAssets);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});