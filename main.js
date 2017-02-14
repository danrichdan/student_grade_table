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
    if($studentName.val() === ''|| $course.val() === ''|| $studentGrade.val() === '') {
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
    var $tableRow = $('<tr>');
    var $deleteButton = $('<button>', {
        class: "btn btn-danger btn-xs",
        text: 'Delete',
        'index-name': index
    });
    studentObj.id = index;
    var studentIdAdd = studentObj.id;
    var $tableCellStudentName = $('<td>').html(studentObj.name);
    var $tableCellCourse = $('<td>').html(studentObj.course);
    var $tableCellStudentGrade = $('<td>').html(studentObj.grade);
    var $tableCellDeleteButton = $('<td>');

    console.log('Loggin the studentId : ',studentIdAdd);
    //DELETE BUTTON
    var $deleteStudentRow = $tableCellDeleteButton.append($deleteButton);
    //ADD TABLE CELLS TO ROW
    var $studentTableRow = $tableRow.append($tableCellStudentName).append($tableCellCourse);
    $studentTableRow = $studentTableRow.append($tableCellStudentGrade).append($deleteStudentRow);
    //ADD ROW TO TABLE BODY
    $studentTableRow.appendTo('tbody');
    console.log('$studentTableRow is : ', $studentTableRow);
};


//Add an anonymous function as the click handler to the dynamically created delete button for each student row - (Event Delegation)
function applyClickHandlers() {
    $('.btn-primary:first-of-type').click(addClicked);
    $('.btn-default').click(cancelClicked);
    $('table.student-list').on('click', '.btn-danger', function () {
        var delete_student = $(this).attr('index-name');
        console.log(delete_student);
        removeStudent(delete_student);
    });
    $('.btn-primary:last-of-type').click(getDataFromServer);

};

//removeStudent function that removes the object in the student_array
// index(element), parent() -- find the parent's index
function removeStudent(index) {
    student_array.splice(index,1);
    updateData();
};

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    inputIds = null;
    student_array = [];
    $('tbody').empty();
};

function getDataFromServer() {
    $.ajax({
        dataType: 'JSON',
        data: {api_key: 'QBwBMxb8Q8'},
        method: 'POST',
        url: 'https://s-apis.learningfuze.com/sgt/get',
        success: function (response) {
            if (response.success) {
                console.log('success!!');
                var ajax_array = response.data;
                console.log('From DB', ajax_array);
                for (var i = 0; i < ajax_array.length; i++) {
                    student_array.push(ajax_array[i]);
                }
                updateData();
            } else {
                alert('Unable to retrieve data');
                console.log(response.errors);
            }
        }
    });
};


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
    applyClickHandlers();
});



//v0.1
// Scope
//

// JS Functionality

// on Dom Load
// Reset application to its default state

// Display all student data stored in the student_array inside the bootstrap table structure


//v0.5
// Scope
//
// J

// v1.0
// Scope
//

// JS Functionality

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
//

