'use strict';
angular.module('services')
.factory('ExpenseFctr', ['ApiFctr', 'DBFctr', function (ApiFctr, DBFctr) {

  function _insertExpense(expense, category){
    expense.category_id = category.id;
    return APiFctr.insertExpense(expense).then(function(data){
      console.log(data);
    	return DBFctr.execute('INSERT INTO expenses (id, value, description, category_id, date) VALUES (?, ?, ?, ?, ?)',
        [expense.id, expense.value, expense.description, category.appId, expense.date]);
      
    }).then(function(res){
      return _getExpense(res.insertId);
    }).catch(function(error){
      console.log(error);
      expense.category_id = category.appId;
      
      return DBFctr.execute('INSERT INTO expenses (value, description, category_id, date) VALUES (?, ?, ?, ?)',
    		[expense.value, expense.description, category.appId, expense.date])
      .then(function(res){
        return _getExpense(res.insertId);
      });
    })
  }

  function _updateExpense(expense){
  	return DBFctr.execute('UPDATE expenses id = ?, value = ?, description = ?, category_id = ?, date = ? WHERE appId=?',
  		[expense.id, expense.value, expense.description, expense.category_id, expense.date, expense.appId]);
  }

  function _getExpense(appId){
    return DBFctr.execute('SELECT * FROM expenses WHERE appId = ?', [appId]);
  }

  return {
    insertExpense: _insertExpense
  };
}]);