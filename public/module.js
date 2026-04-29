var app = angular.module("myApp", []);

app.controller("myController", function($scope, $http) {
    $scope.courses = [];
    $scope.course = {};
    $scope.editMode = false;
    $scope.editId = null;

    $scope.getCourses = function() {
        $http.get("/courses").then(function(res) {
            $scope.courses = res.data;
        });
    };

    $scope.addCourse = function() {
        $scope.error = "";
        $scope.success = "";

        if (!$scope.course.name || $scope.course.name.length < 3) {
            $scope.error = "Course name must be at least 3 characters";
            return;
        }

        if (!$scope.course.instructor) {
            $scope.error = "Instructor required";
            return;
        }

        $http.post("/courses", $scope.course).then(function() {
            $scope.success = "Course Added!";
            $scope.course = {};
            $scope.getCourses();
        });
    };

    $scope.deleteCourse = function(id) {
        $http.delete("/courses/" + id).then(function() {
            $scope.getCourses();
        });
    };

    $scope.editCourse = function(c) {
        $scope.course = angular.copy(c);
        $scope.editMode = true;
        $scope.editId = c._id;
    };

  $scope.updateCourse = function() {
    $scope.error = "";
    $scope.success = "";

    if (!$scope.course.name || $scope.course.name.length < 3) {
        $scope.error = "Course name must be at least 3 characters";
        return;
    }

    if (!$scope.course.instructor) {
        $scope.error = "Instructor required";
        return;
    }

    let updatedData = {
        name: $scope.course.name,
        instructor: $scope.course.instructor
    };

    $http.put("/courses/" + $scope.editId, updatedData)
        .then(function() {
            $scope.success = "Course Updated!";
            $scope.course = {};
            $scope.editMode = false;
            $scope.getCourses();
        })
        .catch(function(err) {
            console.log(err); 
            $scope.error = err.data.error || "Update failed";
        });
};
    $scope.getCourses();
});
