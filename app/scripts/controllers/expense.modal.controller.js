'use strict';
angular.module('controllers')
.controller('ExpenseModalCtrl', ['$scope','DBFctr', '$ionicPopup', '$ionicListDelegate','filterFilter', 
  function($scope, DBFctr, $ionicPopup, $ionicListDelegate, filterFilter) {

  $scope.filterFriends = function(query){
    return filterFilter($scope.data.friends, query);
  }

  $scope.clickedMethod = function (callback) {
    DBFctr.getAppUser().then(function(user){
      user.value = 0;
      user.name = 'Me';
      user.friend_id = user._id;
      callback.item.value = 0;
      $scope.expense.shared = [user].concat($scope.sMod.autoSearch);
      $scope.recalcTotal(0);
    });
  };

  $scope.modelToItemMethod = function (modelValue) {
    return modelValue;
  };

  $scope.incDec = function($index, isInc){
    var morpheus = isInc ? 1 : -1;
    var sum = _roundToTwo((parseFloat($scope.expense.shared[$index].value) * 100 + morpheus)/100);
    if(isInc && sum <= $scope.expense.value || !isInc && sum >= 0){
      $scope.expense.shared[$index].value = sum;
      $scope.calcDiff($index);
    }
  };

  $scope.removedMethod = function (callback) {
    DBFctr.getAppUser().then(function(user){
      user.value = 0;
      user.name = 'Me';
      user.friend_id = user._id;
      $scope.expense.shared = [user].concat(callback.selectedItems);
      $scope.recalcTotal(0);
    });
  };

  $scope.edit = function($index){
    $scope.sMod.popup = $scope.expense.shared[$index].value;
    var popup = $ionicPopup.show({
      template: '<input type="number" min="0" step="0.01"  ng-model="sMod.popup" placeholder="Value">',
      title: 'Edit value',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.sMod.popup || $scope.sMod.popup > $scope.expense.value) {
              e.preventDefault();
            } else {
              return $scope.sMod.popup;
            }
          }
        }
      ]
    });

    popup.then(function(res) {
      $scope.expense.shared[$index].value = res;
      $scope.calcDiff($index);
      $ionicListDelegate.closeOptionButtons();
    });
  };

  $scope.saveExpense = function(){
    var transformedExpense = {};
    transformedExpense._id = $scope.expense._id;
    transformedExpense.category_id = $scope.expense.category_id;
    transformedExpense.date = [];
    transformedExpense.date[0] = $scope.expense._date.getFullYear();
    transformedExpense.date[1] = $scope.expense._date.getMonth()+1;
    transformedExpense.date[2] = $scope.expense._date.getDate();
    transformedExpense.description = $scope.expense.description;
    transformedExpense.type = 'expense';
    transformedExpense.value = $scope.expense.value;
    transformedExpense.shared = [];
    if($scope.expense.shared.length > 1 && $scope.sMod.share){
      for (var i = 0; i < $scope.expense.shared.length; i++) {
        transformedExpense.shared.push({
          value: $scope.expense.shared[i].value,
          friend_id: $scope.expense.shared[i].friend_id,
        })
      }
    }

    if($scope.sMod.update){
      transformedExpense._rev = $scope.expense._rev;
      DBFctr.updateDocument(transformedExpense).then(function(result){
        console.log(result);
        DBFctr.syncDB(true);
        $scope.modal.hide();
      });
    }else{
      DBFctr.addDocument(transformedExpense).then(function(result){
        console.log(result);
        DBFctr.syncDB(true);
        $scope.modal.hide();
      });
    }
  };

  $scope.calcEqual = function(){
    var i = 0;
    var length = $scope.expense.shared.length;
    var max = $scope.expense.value;
    var equalExpense = $scope.expense.value / length;


    for(i = 0; i < length; i++){
      $scope.expense.shared[i].value = _roundToTwo(equalExpense);
      max = _roundToTwo(max - $scope.expense.shared[i].value);
    }

    $scope.expense.shared[0].value = _roundToTwo(max + $scope.expense.shared[0].value);
  };

  $scope.recalcTotal = function(index){
    
    
    if($scope.sMod.equal){

      $scope.calcEqual();
      
    }else{
      $scope.calcDiff(index);
    }
  };

  $scope.calcDiff = function(index){
    var length = $scope.expense.shared.length;
    var max = $scope.expense.value;
    var equalExpense = $scope.expense.value / length;
    var delta = 0;
    var i = 0;
    var leftovers = 0;
    var total = 0;
    


    for (i = 0; i < length; i++) {
      $scope.expense.shared[i].value = parseFloat($scope.expense.shared[i].value) * 100;
      total += $scope.expense.shared[i].value;
    }

    delta = ($scope.expense.value * 100 - total)/length;

    for (i = 0; i < length; i++) {
      
      if(i !== index){
        $scope.expense.shared[i].value = _calcNewValue(delta, $scope.expense.shared[index].value, $scope.expense.shared[i].value);
        max = _roundToTwo(max - $scope.expense.shared[i].value);
      }
      
    }

    $scope.expense.shared[index].value = _roundToTwo($scope.expense.shared[index].value / 100);
    max = _roundToTwo(max - $scope.expense.shared[index].value);


    for (i = 0; i < length; i++) {
      leftovers = _roundToTwo($scope.expense.shared[i].value + max);
      if(leftovers >= 0 && leftovers <= $scope.expense.value && i !== index){
        $scope.expense.shared[i].value = leftovers;
        break;
      }
    }
  };

  function _calcNewValue(delta, value, userExpense){
    
    var newValue =  userExpense + delta;
    
    
    if (newValue < 0 || value === $scope.expense.value * 100){
      return 0;
    }
    else if (newValue > $scope.expense.value * 100){
      return $scope.expense.value * 100;
    }

    return _roundToTwo(newValue / 100);
  }

  function _roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
  }

}]);