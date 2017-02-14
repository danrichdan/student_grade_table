/**
 * Define all global variables here
 */

var $studentName;
var $course;
var $studentGrade;
var  $studentId;

var $addButton = $('div.form-group:last-of-type+button:first-of-type');
var $cancelButton = $('div.form-group:last-of-type+button:first-of-type+button:last-of-type');


/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];
console.log('Here is the new student: ', student_array);

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds;

console.log('Here are the inputIDs: ', inputIds);

/*
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
        console.log('Inside the click handler for the add button.');
    if($studentName.val() === ''|| $course.val() === '' || $studentGrade.val() === NaN) {
        alert("Please enter a valid name, course, and grade");
    } else {
        addStudent($studentName.val(),$course.val(),$studentGrade.val());
        clearAddStudentForm();
    }
};


/* cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    console.log('Inside the click handler for the cancel button.');
    clearAddStudentForm();
};


/*
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent($studentName,$course,$studentGrade) {
    console.log('Inside the addStudent function');
    $studentId = student_array.length;
    var studentObj = {
        name: $studentName,
        course: $course,
        grade: $studentGrade,
        id: $studentId
    };
    student_array.push(studentObj);
    console.log('Here is the student_array: ', student_array);
    updateData();
};


/*
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm(){
    console.log('Inside the clearAddStudentForm function');
    for(var i = 0; i < inputIds.length; i++) {
        inputIds[i].val('');
    };
};


/*
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage($studentGrade) {
    var gradesTotal = 0;
    var averageGrade = 0;
        for (i = 0; i < student_array.length; i++) {
            gradesTotal = gradesTotal + parseInt(student_array[i].grade);
        }
        averageGrade = gradesTotal / i;
        averageGrade = Math.round(averageGrade);
        console.log('Here is the average grade: ' + averageGrade);
        // $('span.avgGrade').text();
        if(averageGrade) {
            $('.avgGrade').text(averageGrade);
        } else {
            $('span.avgGrade').text('');
        }
        return averageGrade;
};

/*
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    updateStudentList();
    calculateAverage();
}


/**
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList() {
    console.log('Inside the updateStudentList function');
    $('tbody').empty();
    for(var i= 0; i < student_array.length; i ++) {
        addStudentToDom(student_array[i],i);
        console.log('student_array : ', student_array);
    };
};

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 *
 */
function addStudentToDom(studentObj,index) {
    console.log('Inside the addStudentToDom function, here is the current student object : ',studentObj);
    clearAddStudentForm();
    //CREATE TABLE CELLS
    var studenIdAdd = studentObj.id;
    var $tableCellStudentName = $('<td>').html(studentObj.name);
    var $tableCellCourse = $('<td>').html(studentObj.course);
    var $tableCellStudentGrade = $('<td>').html(studentObj.grade);
    var $tableCellDeleteButton = $('<td>');
    //$tableCellDeleteButton = $tableCellDeleteButton.attr('value',studentObj.id);
    console.log('Loggin the studentId : ',studenIdAdd);
    //DELETE BUTTON
    var $deleteButton = $('<button>').addClass("btn btn-danger btn-xs").text('Delete').attr('name',studentObj.id);
    var $deleteStudentRow = $tableCellDeleteButton.append($deleteButton);

    //ADD TABLE CELLS TO ROW
    var $tableRow = $('<tr>').attr('data-index',index);
    var $studentTableRow = $tableRow.append($tableCellStudentName);
    $studentTableRow = $studentTableRow.append($tableCellCourse);
    $studentTableRow = $studentTableRow.append($tableCellStudentGrade);
    $studentTableRow = $studentTableRow.append($deleteStudentRow);
    //ADD ROW TO TABLE BODY
    $studentTableRow.appendTo('tbody');
    console.log('$studentTableRow is : ', $studentTableRow);
};

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    inputIds = null;
    student_array = [];
    $('tbody').empty();
};


//Add an anonymous function as the click handler to the dynamically created delete button for each student row - (Event Delegation)


//removeStudent function that removes the object in the student_array
// index(element), parent() -- find the parent's index


/**
 * Listen for the document to load and reset the data to the initial state
 */
$(document).ready(function(){
    reset();
    updateData();
    $studentName = $('#studentName');
    $course = $('#course');
    $studentGrade = $('#studentGrade');
    inputIds = [
        $studentName,
        $course,
        $studentGrade
    ];

});



//v0.1
// Scope
//

// JS Functionality
// Build out all functions & variables based on jsDoc (What is this?) comments inside the script.js file
// Form

// on Dom Load
// Reset application to its default state

// Display all student data stored in the student_array inside the bootstrap table structure


//v0.5
// Scope
//
// JS Functionality
// Add an anonymous function as the click handler to the dynamically created delete button for each student row - (Event Delegation)
// Delete button click handler function should have a call to removeStudent function that removes the object in the student_array
// Suggested method
// Using index of the row of the current button to remove from array
// Store the index when adding to the DOM into a data attribute
// Once the object has been removed from the array, remove the DOM element that is the parent of the delete button that was clicked.

// v1.0
// Scope
//
// HTML
// In the index.html file add a third button below the add and cancel buttons
// Make sure the button has the same styling as the other two and fits in with the overall design
// The button should say something along the lines of "Get data From Server"
// JS Functionality
// Add a click handler to your newly created button
// Using the LearningFuze SGT API pull records from the DB using an AJAX call
// With the object you get back from the API find the proper data to add to your SGT
// API URL: s-apis.learningfuze.com/sgt/get
// input: api_key: (string) your api key
// output: success: (boolean) whether the operation succeeded data: (array) every student available on the database

// V2.0
// Scope
//
// HTML
// (optional) Add a modal to handle error messages, if doing optional error handling
// (optional) Add button "waiting" marker of some sort. For example a spinner. Spinner should conceivably be placed in or on the button. This is for optional error handling.
//     JS Functionality
// Activate the load function (from the DB, made in v1.0) on document load.
//     Ensure that your load function records the student's ID, given to you by the database. This will be important for future interaction with the student, such as deletion or updating.
// On creating a new student, also send the new student data to the server
// API URL: s-apis.learningfuze.com/sgt/create
// method: post
// input:
//     api_key: (string) your api key
// name: (string) the student's name
// course: (string) the course the student is taking
// grade: (number) the student's grade for the course
// output:
//     success: (boolean) whether the operation succeeded
// errors (optional): (array) an array with all errors that occurred
// new_id: (number) The ID of the new student in the database.
//     On deleting a student, also request the deletion of the student on the database
// API URL: s-apis.learningfuze.com/sgt/delete
//     method: post
// input:
//     api_key: (string) your api key
// student_id: (number) the ID of the student within the database
// output:
//     success: (boolean) whether the operation succeeded
// errors (optional): (array) an array with all errors that occurred

