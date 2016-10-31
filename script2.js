/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */
var student_array = [];

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds;

/*
 * addClicked - Event Handler when user clicks the add button
 */

//note to self... feel free to take the click event from the html and add it here
function addClicked() {
    console.log('We are in the addClicked function ');
    addStudent($('#studentName').val(),$('#course').val(),$('#studentGrade').val());
    //console.log('Here is the new student added to the student_Array: ' + student_array );
    calculateAverage($('#studentGrade').val());
    //updateData();

};

/* cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
function cancelClicked() {
    $('#studentName').val('');
    $('#course').val('');
    $('#studentGrade').val('');
    // clearAddStudentForm();
};

/*
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
function addStudent(name,course,grade) {
    var studentObj = {
    name: name,
    course: course,
    grade: grade,
    storeStudent: function storeStudent() {

    }
}
    student_array.push(studentObj);
    console.log('Here is the new student: ', student_array);


    updateStudentList();
    clearAddStudentForm();

    console.log('We are in the addStudent function: ' + this.name,this.course,this.grade);
};

/*
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
function clearAddStudentForm() {
    for(var i = 0; i < inputIds.length; i++) {
        inputIds[i].val('');
    }
};
/*
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
function calculateAverage(studentgrade) {

    var averageGrade = null;
    var gradeTotal = null;
    for (i = 0; i < student_array.length; i++) {
        gradeTotal = gradeTotal + parseInt(student_array[i].grade);
    }
    averageGrade = gradeTotal / i;
    console.log(averageGrade);
    $('span.avgGrade').text();
    $('.avgGrade').text(averageGrade);
    return averageGrade;
}

/*
 * updateData - centralized function to update the average and call student list update
 */
function updateData() {
    updateStudentList();
    calculateAverage($('#studentGrade').val());
};

/*
 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
 */
function updateStudentList(student_array[i]) {
    console.log('We are in the updateStudentList function');
    $('tbody').empty();
    for(var i= 0; i < student_array.length; i ++){
        $('tbody').append(studentRow);
        console.log(studentRow);
    }
};
/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj
 */
function addStudentToDom(studentObj) {
    var studentRow = $('<tr>');
    var studentNameData = $('<td>').text(student_array[i].name);
    var studentCourseData = $('<td>').text(student_array[i].course);
    var studentGradeData = $('<td>').text(student_array[i].grade);
    var deleteStudentRow = $('<button class="btn btn-danger btn-xs">Delete</button>');

    studentRow.append(studentNameData);
    studentRow.append(studentCourseData);
    studentRow.append(studentGradeData);
    studentRow.append(deleteStudentRow);
    //var deleteStudentRow = $('td').append('<button class="btn btn-danger btn-xs">Delete</button>');
};
/**
 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
 */
function reset(){
    $('tbody').empty();
    var student_array = [];
}
/**
 * Listen for the document to load and reset the data to the initial state
 */

$(document).ready(function(){
    inputIds = [
        $('#studentName'),
        $('#course'),
        $('#studentGrade')
    ];
    //updateData();
    //calculateAverage();
    console.log('Here is the inputIds array: ', inputIds);
    $( "button:first-of-type" ).click(function() {
        console.log('In the Click event for the add button ');
        addClicked();
    });
    $( "button:last-of-type" ).click(function() {
        console.log('In the Click event for the cancel button ');
        cancelClicked();
    });
});