var $studentName;
var $course;
var $studentGrade;
var $studentId;

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
    sendStudentToDatabase(studentObj);
    updateData();
};

function sendStudentToDatabase(studentToAdd) {
    var sendData = studentToAdd;
    sendData['api_key'] = 'QBwBMxb8Q8';
    $.ajax({
        method: 'POST',
        url: 'https://s-apis.learningfuze.com/sgt/create',
        data: sendData,
        dataType: 'JSON',
        success: function (response) {
            console.log(response.success, response.new_id);
            if (response.success) {
                studentToAdd['id'] = response.new_id;
                student_array.push(studentToAdd);
            } else {
                alert('Unable to add student.');
                console.log(response.errors);
            }
        }
    });
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
};

//removeStudent function that removes the object in the student_array
// index(element), parent() -- find the parent's index
function removeStudent(index) {
    //create object to send to DB
    console.log('Index of ID to be removed', index);
    student_array.splice(index, 1);
    updateData();
};

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    inputIds = null;
    student_array = [];
    $('tbody').empty();
    $.ajax({
        dataType: 'JSON',
        data: {api_key: 'QBwBMxb8Q8'},
        method: 'POST',
        url: 'https://s-apis.learningfuze.com/sgt/get',
        success: function (response) {
            if (response.success) {
                console.log('success!!');
                var ajax_array = response.data;
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

    $studentName = $('#studentName');
    $course = $('#course');
    $studentGrade = $('#studentGrade');
    inputIds = [
        $studentName,
        $course,
        $studentGrade
    ];
    applyClickHandlers();
    // getDataFromServer();
    updateData();
});



