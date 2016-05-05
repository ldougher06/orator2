'use strict'

console.log(" *** IN MAIN.JS *** ")

const app = angular.module('oratorTwo', []);

app.controller('MainCtrl', [
  '$scope', ($scope) => {
    $scope.posts = [
      {name: 'John', title: 'Junior Developer'},
      {name: 'Tina', title: 'Mid-Level Developer'},
      {name: 'Trish', title: 'Senior Developer'},
      {name: 'Bruno', title: 'Smarty'},
      {name: 'Tommy', title: 'Likes 2 Party'}
    ];

    $scope.addPost = () => {
      $scope.posts.push(
        {
          name: $scope.name,
          title: $scope.title,
          link: $scope.link
        })
      $scope.name = '';
      $scope.title = '';
      $scope.link = '';
    }
}]);
