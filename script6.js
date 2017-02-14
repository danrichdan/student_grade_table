//Define all global variables here
var $studentName;
var $course;
var $studentGrade;
var $studentId;

var $addButton;
var $cancelButton;
var currentStudent;
var student_array;

//global array to hold student objects,@type {Array}
student_array = [];
console.log('Here is the new student: ', student_array);
currentStudent = student_array.length -1;

//id's of the elements that are used to add students, @type {string[]}
var inputIds;
console.log('Here are the inputIDs: ', inputIds);


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