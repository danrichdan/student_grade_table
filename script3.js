//Define all global variables here
    var $studentName;
    var $course;
    var $studentGrade;

    var $addButton;
    var $cancelButton;

//global array to hold student objects,@type {Array}
    var student_array = [];
    console.log('Here is the new student: ', student_array);

//id's of the elements that are used to add students, @type {string[]}
    var inputIds;
console.log('Here are the inputIDs: ', inputIds);

//Event Handler when user clicks the add button
function addClicked() {
            $addButton.click(function() {
            console.log('Inside the click handler for the add button.');
            addStudent($studentName.val(),$course.val(),$studentGrade.val());
            calculateAverage($studentGrade.val());
    });
};

//Event Handler when user clicks the cancel button, should clear out student form
function cancelClicked() {
    $cancelButton.click(function () {
        console.log('Inside the click handler for the cancel button.');
        clearAddStudentForm();
    });
};

//addStudent - creates a student objects based on input fields in the form and adds the object to global student array
//@return undefined
function addStudent($studentName,$course,$studentGrade) {
    console.log('Inside the addStudent function');
    var studentObj = {
        name: $studentName,
        course: $course,
        grade: $studentGrade
    }
    student_array.push(studentObj);
    console.log('Here is the new student: ', student_array);
    addStudentToDom(studentObj);
};

//clearAddStudentForm - clears out the form values based on inputIds variable
function clearAddStudentForm(){
    console.log('Inside the clearAddStudentForm function');
    for(var i = 0; i < inputIds.length; i++) {
        inputIds[i].val('');
    };
};

// calculateAverage - loop through the global student array and calculate average grade and return that value
 //@returns {number}
function calculateAverage($studentGrade) {
    var gradesTotal = null;
    var averageGrade = null;
    for (i = 0; i < student_array.length; i++) {
        gradesTotal = gradesTotal + parseInt(student_array[i].grade);
    };
    averageGrade = gradesTotal / i;
    averageGrade = averageGrade.toFixed(2);
    console.log('Here is the average grade: ' + averageGrade);
    $('span.avgGrade').text();
    $('.avgGrade').text(averageGrade);
    return averageGrade;
};

//updateData - centralized function to update the average and call student list update
function updateData() {
    console.log('Inside the updateData function');
    calculateAverage($studentGrade.val());
    updateStudentList();
};


//updateStudentList - loops through global student array and appends each objects data into the
// student-list-container > list-body
function updateStudentList() {
    console.log('Inside the updateStudentList function');
    var deleteStudentRow = $('<button class="btn btn-danger btn-xs">Delete</button>');
    $('tbody').empty();
    for(var i= 0; i < student_array.length; i ++) {
        var studentRow = $('<tr>');
        var studentNameData = $('<td>').text(student_array[i].name);
        var studentCourseData = $('<td>').text(student_array[i].course);
        var studentGradeData = $('<td>').text(student_array[i].grade);
        var deleteStudentRow = $('<button class="btn btn-danger btn-xs">Delete</button>');

        studentRow.append(studentNameData);
        studentRow.append(studentCourseData);
        studentRow.append(studentGradeData);
        studentRow.append(deleteStudentRow);

        $('tbody').append(studentRow);
        console.log(studentRow);
    }

};

//addStudentToDom - take in a student object, create html elements from the values and then append the elements
//into the .student_list tbody, @param studentObj
function addStudentToDom(studentObj) {
    console.log('Inside the addStudentToDom function');
    clearAddStudentForm();
    //CREATE TABLE CELLS
    var $tableCellStudentName = $('<td>').html(studentObj.name);
    var $tableCellCourse = $('<td>').html(studentObj.course);
    var $tableCellStudentGrade = $('<td>').html(studentObj.grade);
    var $tableCellDeleteButton = $('<td>');
    //DELETE BUTTON
    var $deleteButton = $('<button>').addClass("btn btn-danger btn-xs").text('Delete');
    var $deleteStudentRow = $tableCellDeleteButton.append($deleteButton);

    //ADD TABLE CELLS TO ROW
    var $tableRow = $('<tr>');
    var $studentTableRow = $tableRow.append($tableCellStudentName);
    $studentTableRow = $studentTableRow.append($tableCellCourse);
    $studentTableRow = $studentTableRow.append($tableCellStudentGrade);
    $studentTableRow = $studentTableRow.append($deleteStudentRow);
    //ADD ROW TO TABLE BODY
    $studentTableRow.appendTo('tbody');
    console.log($studentTableRow);
};

/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset() {
    inputIds = null;
    student_array = [];
    $('tbody').empty();
}



//Listen for the document to load and reset the data to the initial state
$(document).ready(function(){
    $studentName = $('#studentName');
    $course = $('#course');
    $studentGrade = $('#studentGrade');
    inputIds = [
        $studentName,
        $course,
        $studentGrade
    ];
    $addButton = $('div.form-group:last-of-type+button:first-of-type');
    $cancelButton = $('div.form-group:last-of-type+button:first-of-type+button:last-of-type');

    addClicked();
    cancelClicked();
});















