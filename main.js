//Global Variables
var $studentName;
var $course;
var $studentGrade;

/**
 * inputIds - id's of the elements that are used to add students
 * @type {string[]}
 */
var inputIds;

/*
 * FIREBASE
 */
// Adds Firebase config data
var config = {
    apiKey: "AIzaSyAPqciv9eDuorGWqwu3U5DP7DcthjEH5Rc",
    authDomain: "student-grade-table-1f915.firebaseapp.com",
    databaseURL: "https://student-grade-table-1f915.firebaseio.com",
    storageBucket: "student-grade-table-1f915.appspot.com",
    messagingSenderId: "436578119423"
};
// Initializes Firebase
firebase.initializeApp(config);
// Creates firebase ref
var fbRef = firebase.database();
// Creates event listener for the students node in database
fbRef.ref('students').on('value', function(snapshot){
    addStudentsToDom(snapshot.val());
});

/*
 * addClicked - Event Handler when user clicks the add button
 */
function addClicked() {
    if($studentName.val() === ''|| $course.val() === ''|| $studentGrade.val() === '') {
        alert("Please enter a valid name, course, and grade");
    } else {
        var studentGrade = parseInt($studentGrade.val());
        addStudent($studentName.val(),$course.val(),studentGrade);
        clearAddStudentForm();
    };
};

/*
 * addStudent - creates a student object based on input fields in the form and adds the object to DB
 */
function addStudent($studentName,$course,$studentGrade) {
    var studentObj = {
        student_name: $studentName,
        course: $course,
        grade: $studentGrade,
    };
    fbRef.ref('students').push(studentObj);
};

/*
 * clearAddStudentForm - Clears the form values
 */
function clearAddStudentForm(){
    for(var i = 0; i < inputIds.length; i++) {
        inputIds[i].val('');
    };
};

/*
 * calculateAverage - CALLED FROM THE addStudentsToDom FUNCTION
 * @returns {AVERAGE}
 */
function calculateAverage(gradeTotal,studentRecords) {
        averageGrade = gradeTotal / studentRecords;
        averageGrade = Math.round(averageGrade);
        return averageGrade;
};

/**
 * addStudentsToDom - Updates the DOM according to current Database values
 */
function addStudentsToDom(fbDatabase) {
    $('tbody').empty();
    var index;
    var gradeTotal =0;
    var studentRecords = Object.keys(fbDatabase).length;
    //CREATE TABLE CELLS
    for(var key in fbDatabase) {
        fbDatabase.id = key;
        var $tableRow = $('<tr>');
        var studentIdAdd = fbDatabase.id;
        var $tableCellStudentName = $('<td>').html(fbDatabase[key].student_name).addClass('sname');
        var $tableCellCourse = $('<td>').html(fbDatabase[key].course).addClass('course');
        var $tableCellStudentGrade = $('<td>').html(fbDatabase[key].grade).addClass('grade');
        var $tableCellDeleteButton = $('<td>');
        var $deleteButton = $('<button>', {
            class: "btn btn-danger btn-xs",
            text: 'Delete',
            'index-name': key
        });
        var $editButton = $('<button>', {
           class:"btn btn-info btn-xs edit",
            text: "Edit",
            'index-name': key
        });
        //APPENDS THE DELETE BUTTON
        var $deleteStudentRow = $tableCellDeleteButton.append($editButton,$deleteButton);
        //ADDS TABLE CELLS TO ROW
        var $studentTableRow = $tableRow.append($tableCellStudentName, $tableCellCourse);
        $studentTableRow = $studentTableRow.append($tableCellStudentGrade, $deleteStudentRow);
        //ADDS ROW TO TABLE BODY
        $studentTableRow.appendTo('tbody');

        //GETS GRADE TOTAL
        gradeTotal+= fbDatabase[key].grade;
    };
    //CALLS CALCULATE AVERAGE FUNCTION AND DISPLAYS
    var averageGrade = calculateAverage(gradeTotal,studentRecords);
    displayGradeAverage(averageGrade);
};

function displayGradeAverage(averageGrade) {
    if(averageGrade) {
        $('.avgGrade').text(averageGrade);
    } else {
        $('span.avgGrade').text('N/A');
    }
};

//CALLED WHEN THE EDIT BUTTON IS CLICKED
//POPULATES THE FORM WITH DATA
function populateFormData(sname, course, grade){
    $('#studentName').val(sname);
    $('#course').val(course);
    $('#studentGrade').val(grade);
};

// CALLED WHEN UPDATE STUDENT BUTTON IS CLICKED
function updateStudent(id){
    var updates = {};
    updates['students/' + id +'/course'] = $('#course').val();
    updates['students/' + id +'/grade'] = parseInt($('#studentGrade').val());
    updates['students/' + id +'/student_name'] = $('#studentName').val();
    fbRef.ref().update(updates);
};

//Applies click handlers
function applyClickHandlers() {
    $('.student-add-form').on('click', '.btn-success', function() {
        //ADD BUTTON
        addClicked();
    }).on('click','.btn-default', function() {
        //CANCEL BUTTON
        clearAddStudentForm();
    }).on('click','.btn-info', function() {
        //UPDATE BUTTON
        var studentKey = $(this).attr('index-name');
        updateStudent(studentKey);
        $(this).removeClass('btn-info').addClass('btn-success').attr('data-uid', null).text('Add');
        clearAddStudentForm();
    });
    $('table.student-list').on('click', '.btn-danger', function () {
        //DELETE BUTTON
        var delete_student = $(this).attr('index-name');
        removeStudent(delete_student,$(this).closest('tr'));
    }).on('click','.edit', function() {
        //EDIT BUTTON
        var studentKey = $(this).attr('index-name');
        $('#add-student').removeClass('btn-success').addClass('btn-info').attr('index-name', studentKey).text('Update' +
            ' Student');
        var formRowData = getRowData($(this).closest('tr'));
        populateFormData(formRowData.sname, formRowData.course, formRowData.grade);
    });
};

// DELETES STUDENT RECORD AND ROW
function removeStudent(index, element) {
    //creates object to send to DB
    var studentData = getRowData(element);
    var confirmed = confirm('Are you sure that you want to delete this student? ' + ' ' + studentData.sname);
    if(confirmed == true) {
        fbRef.ref('students/'+ index).remove();
    };
};

function getRowData(element) {
    //CALLED FROM THE EDIT BUTTON AND THE DELETE BUTTON
    //element is the tr tag
    return {
        //FINDS THE TEXT OF THE DESCENDENTS OF THE TR,
        sid: element.find('.sid').text(),
        sname: element.find('.sname').text(),
        course: element.find('.course').text(),
        grade: element.find('.grade').text()
    };
}

/**
 * reset - resets the application to initial state.
 */
function reset() {
    inputIds = null;
    $('tbody').empty();
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
});



