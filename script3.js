//Define all global variables here
    var $studentName;
    var $course;
    var $studentGrade;
    var $studentId;

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
                    $studentName = $('#studentName');
                    $course = $('#course');
                    $studentGrade = $('#studentGrade');
                addStudent($studentName.val(),$course.val(),$studentGrade.val());
                //updateData();
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
function addStudent($studentName,$course,$studentGrade,$studentId) {
    console.log('Inside the addStudent function');
    sendDataToServer($studentName,$course,$studentGrade,$studentId);
    currentStudent++;
    var studentObj = {
        name: $studentName,
        course: $course,
        grade: $studentGrade,
        id: $studentId
    }
    student_array.push(studentObj);
    console.log('Here is the student_array: ', student_array);
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
    updateStudentList();
};

//updateStudentList - loops through global student array and appends each objects data into the
// student-list-container > list-body
function updateStudentList() {
    console.log('Inside the updateStudentList function');
    $('tbody').empty();
    for(var i= 0; i < student_array.length; i ++) {
        addStudentToDom(student_array[i],i);
        console.log('student_array : ', student_array);
    };
};

//addStudentToDom - take in a student object, create html elements from the values and then append the elements
//into the .student_list tbody, @param studentObj
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

// reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
function reset() {
    inputIds = null;
    student_array = [];
    $('tbody').empty();
};

//Add an anonymous function as the click handler to the dynamically created delete button for each student row - (Event Delegation)
function deleteButton() {
    $('table').on('click','tr td button',function() {
        console.log('In the delete buttons click event');
        var stuId = $(this).attr('name');
        console.log('This is supposed to be the value from the button attribute , new variable called stuId : ',stuId);
        var $deleteTableRow = $(this).parent();//td of the button
        $deleteTableRow = $deleteTableRow.parent();//tr of the button
        var $tableRowDeletedIndex = $deleteTableRow.attr('data-index');
        var $textToDelete = $deleteTableRow.children().text();
        var $tableRowIndex = $( "tr" ).index( this ); // maybe try adding 1 aka + 1 -- tried this and it dod not work
        console.log('This is the row that will be deleted : ', $deleteTableRow, 'this is its index', $tableRowDeletedIndex);
        console.log('This is the objects value to delete', $textToDelete);
        removeStudent($deleteTableRow,$tableRowDeletedIndex);
        deleteStudentFromServer($studentId);
        $deleteTableRow.empty();
    });
};

//removeStudent function that removes the object in the student_array
// index(element), parent() -- find the parent's index
function removeStudent($deleteTableRow,$tableRowIndex) {
       console.log('In the removeStudent function, here is the value for $deleteTableRow : ', $deleteTableRow, ' and' +
           ' $tableRowDeletedIndex : ', $tableRowIndex);
        student_array.splice($tableRowIndex,1);
        console.log('student_array : ',student_array);
};

function getDataFromServer() {
   $('.btn-md').click(function(){
        console.log('In the data from server click function');
       $.ajax({
           dataType:'json',
           data: {
               api_key: 'QBwBMxb8Q8',
           },
           method: 'POST',
           url: "https://s-apis.learningfuze.com/sgt/get",

           success: function(response){
               if (response) {
                   var $studentNameData;
                   var $courseData;
                   var $studentGradeData;
                   var $studentIdData;
                   for(var i = 0; i < response.data.length; i++) {
                       $studentNameData = response.data[i].name;
                       $courseData = response.data[i].course;
                       $studentGradeData = response.data[i].grade;
                       $studentIdData = response.data[i].id;
                       addStudent($studentNameData,$courseData,$studentGradeData);
                       updateData();
                   }
                   console.log('success');
                   console.log('Here is the response : ', response);
                   console.log('Here is the first item in the response : ', response.data[0]);
               } else {
                   console.log('failure');
               }
           }});
   });
};

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
    deleteButton();
    getDataFromServer();


});

var currentStudent = student_array.length -1;
function sendDataToServer($studentName,$course,$studentGrade,$studentId) {
    console.log('In the sendDataToServer function');

    $.ajax({
        dataType: 'json',
        data: {
            api_key: 'QBwBMxb8Q8',
            name: $studentName,
            course: $course,
            grade: $studentGrade,
            id: $studentId
        },
        method: 'POST',
        url: "https://s-apis.learningfuze.com/sgt/create",

        success: function (response) {
            if (response) {

                console.log('In the success function of the ajax function to sendDataToServer');
                console.log('Here is the response : ', response);
                console.log('Here is the new_id in the response : ', response.new_id);
                $studentId = response.new_id;
                student_array[currentStudent].id = $studentId;
                console.log('Here is the new array after adding the id : ',student_array);
                console.log('This is the success response from the ajax call in the sendDataToServer function: ',response.success);
                updateData();
            } else {
                console.log('failure');
            }
        }
        });
};

function deleteStudentFromServer($studentId) {
    console.log('In the deleteStudentFromServer function');
    $.ajax({
        dataType: 'json',
        data: {
            api_key: 'QBwBMxb8Q8',
            student_id: $studentId
        },
        method: 'POST',
        url: "https://s-apis.learningfuze.com/sgt/delete",

        success: function (response) {
            if(response) {
                console.log('In the success function of the ajax function to deleteStudentFromServer');
                console.log(response.success);
            }
        }

    })
}










