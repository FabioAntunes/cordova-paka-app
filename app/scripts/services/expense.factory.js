'use strict';
angular.module('services')
.factory('ExpenseFctr', ['ApiFctr', 'DBFctr','$timeout', function (ApiFctr, DBFctr, $timeout) {

  function _insertExpense(expense, category){
    expense.category_id = category.id;
    return ApiFctr.insertExpense(expense).then(function(data){
      console.log(data);
      expense.id = data.id;
    	return _persistExpense(expense, category);
      
    })
    .catch(function(error){
      console.log(error);
      expense.id = null;
      return _persistExpense(expense, category);
    });
  }

  function _updateExpense(expense){
  	return DBFctr.execute('UPDATE expenses id = ?, value = ?, description = ?, category_id = ?, date = ? WHERE appId=?',
  		[expense.id, expense.value, expense.description, expense.category_id, expense.date, expense.appId]);
  }

  function _getExpense(appId){
    return DBFctr.execute('SELECT * FROM expenses WHERE appId = ?', [appId]);
  }

  function _persistExpense(expense, category){
    return DBFctr.persistExpense(expense, category).then(function(res){
        expense.appId = res.insertId;
        return $timeout(function(){
          return DBFctr.appendExpense(expense, category.appId);
        }, 1000);
    });
  }

  return {
    insertExpense: _insertExpense
  };
}]);