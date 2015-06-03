'use strict';
angular.module('services')
.factory('DBFctr', ['$cordovaSQLite', 'ApiFctr', '$q', 'AuthFctr', '$filter', function ($cordovaSQLite, ApiFctr, $q, AuthFctr, $filter) {
  var _db;
  var _data = {
    _total: 0,
    categories: [],
    get total(){
      return this._total / 100;
    },
    set total(value){
      this._total += value;
    }
  };
  var syncWithAPI = true;


  function _initDB () {
    window.plugins.sqlDB.copy('paka.sqlite', function() {
      _db = $cordovaSQLite.openDB('paka.sqlite');
      if(AuthFctr.check()){
        _loadData();
      }
    }, function(error) {
      console.log('Warning = '+JSON.stringify(error));
      _db = $cordovaSQLite.openDB('paka.sqlite');
      if(AuthFctr.check()){
        _loadData();
      }
    });
  }

  function _getCategoryExpenses(category){
    return _execute('SELECT * FROM expenses WHERE category_id=?', [category.appId]).then(function(results) {
      var _dbExpense;
      category.expenses = [];
      category._total = 0;
      for (var i = 0; i < results.rows.length; i++) {
        _dbExpense = results.rows.item(i);
        category._total += _dbExpense.value * 100;
        category.expenses.push(_createExpense(_dbExpense));
      }

      _data._total += category._total;
      _data.categories.push(category);

    });
  }

  function _loadData () {
    _data.categories.length = 0;

    _execute('SELECT * FROM categories').then(function(results) {
      var _dbCategory;
      var _dbPromises = [];
      for (var i = 0; i < results.rows.length; i++) {
        
        _dbCategory = results.rows.item(i);
        _dbCategory._total = _dbCategory.total;
        Object.defineProperty(_dbCategory, 'total', { get: function () { return this._total / 100;},
          set: function (value) { this._total += value; }});

        _dbPromises.push(_getCategoryExpenses(_dbCategory));
      }
      return $q.all(_dbPromises)
    }).then(function(){

      if(syncWithAPI){
        _syncDB();
      }

      return _data;

    }).catch(function (err) {
      console.log(error);
      return _data;
    });
    
  }

  function _syncDB() {
    
    var dbPromises = [];

    ApiFctr.getCategories().then(function(results){

      //update or insert categories from the API request
      for (var i = 0; i < results.data.length; i++) {
        dbPromises.push(_insertUpdateCategory(results.data[i]));
        for (var j = 0; j < results.data[i].expenses.length; j++) {
          dbPromises.push(_insertUpdateExpense(results.data[i].expenses[j], results.data[i]));
        }
      }


      //After all inserts/updates reload the new data from the database
      $q.all(dbPromises).then(function(){

        //Set syncWithAPI to false, since we already have synced and to prevent a loop of requests
        syncWithAPI = false;
        _loadData();
      }, function() {

        //Set syncWithAPI to false, since we already have synced and to prevent a loop of requests
        syncWithAPI = false;
        _loadData();
      });

    });

  }

  function _insertUpdateCategory(category){
      return _execute(
          'INSERT OR REPLACE INTO categories (appId, id,name, color) VALUES ((select appId from categories where id = ?),?, ?, ?)',
          [category.id, category.id, category.name, category.color]);
  }

  function _insertUpdateExpense(expense, category){
    return _execute(
          'INSERT OR REPLACE INTO expenses (appId, id, value, description, category_id, date) VALUES ((select appId from expenses where id = ?), ?, ?, ?, ?, ?)',
          [expense.id, expense.id, expense.value, expense.description, category.appId, expense.date]);
  }

  function _persistExpense(expense, category){
    return _execute('INSERT INTO expenses (id, value, description, category_id, date) VALUES (?, ?, ?, ?, ?)',
        [expense.id, expense.value, expense.description, category.appId, expense.date]);
  }

  function _getCategory(idCategory){
    return _data.categories.length ? _data.categories[idCategory] : {};
  }

  function _execute(query, params){
    if (typeof params === 'undefined') { params = []; }

    return $cordovaSQLite.execute(_db, query, params);
  }

  function _createExpense(dbExpense){
    return {
      appId:  dbExpense.appId,
      id:  dbExpense.id,
      _value:  dbExpense.value * 100,
      get value(){
        return this._value / 100;
      }, 
      description:  dbExpense.description, 
    };
  }

  function _appendExpense(expense, categoryId){
    expense = _createExpense(expense);
    for (var i = _data.categories.length - 1; i >= 0; i--) {
      if(_data.categories[i].appId === categoryId){
        _data.total = expense._value;
        _data.categories[i].total = expense._value;
        _data.categories[i].expenses.push(expense);
      }
    };
  }

  return {
    initDB: _initDB,
    getData: _data,
    getCategory: _getCategory,
    execute: _execute,
    loadData: _loadData,
    persistExpense: _persistExpense,
    appendExpense: _appendExpense
  };
}]);