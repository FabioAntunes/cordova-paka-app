'use strict';
angular.module('services')
.factory('DBFctr', ['$cordovaSQLite', 'ApiFctr', '$q', 'NetworkFctr', 'AuthFctr', function ($cordovaSQLite, ApiFctr, $q, NetworkFctr, AuthFctr) {
  var _db;
  var _data = {
    _total: 0,
    categories: [],
    get total(){
      return this._total / 100;
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
      return $cordovaSQLite.execute(_db, 'SELECT * FROM expenses WHERE category_id=?', [category.id]).then(function(results) {
        var _dbExpense;
        category.expenses = [];
        category._total = 0;
        for (var i = 0; i < results.rows.length; i++) {
          _dbExpense = results.rows.item(i);
          category._total += _dbExpense.value * 100;
          category.expenses.push({
            _value:  _dbExpense.value * 100, 
            get value(){
              return this._value / 100;
            }, 
            description:  _dbExpense.description, 
          });
        }

        _data._total += category._total;
        _data.categories.push(category);

      }, function (err) {
        console.log(err);
      });
  }

  function _loadData () {
    _data.categories.length = 0;

    $cordovaSQLite.execute(_db, 'SELECT * FROM categories', []).then(function(results) {
      var _dbCategory;
      for (var i = 0; i < results.rows.length; i++) {
        
        _dbCategory = results.rows.item(i);
        _dbCategory._total = _dbCategory.total;
        Object.defineProperty(_dbCategory, "total", { get: function () { return this._total / 100; }});
        _getCategoryExpenses(_dbCategory);

      }

    }, function (err) {
      console.log(err);
      //_resetArrays();
    });
    
    if(syncWithAPI){
      _syncDB();

    }
  }

  function _syncDB() {
    
    var dbPromises = [];

    if(NetworkFctr.isOnline()){
      ApiFctr.getCategories().then(function(results){

        //update or insert categories from the API request
        for (var i = 0; i < results.data.length; i++) {
          dbPromises.push(_insertUpdateCategory(results.data[i]));
          for (var j = 0; j < results.data[i].expenses.length; j++) {
            dbPromises.push(_insertUpdateExpense(results.data[i].expenses[j], results.data[i]));
          }
        }


        //After all inserts/updates reload the new data from the database
        $q.all(dbPromises).then(function(results){

          //Set syncWithAPI to false, since we already have synced and to prevent a loop of requests
          syncWithAPI = false;
          _loadData();
        }, function(results) {

          //Set syncWithAPI to false, since we already have synced and to prevent a loop of requests
          syncWithAPI = false;
          _loadData();
        });

      });      
    }

  }

  function _insertUpdateCategory(category){
      return $cordovaSQLite.execute(_db,
          'INSERT OR REPLACE INTO categories (id,name) VALUES (?, ?)',
          [category.id, category.name]);
  }

  function _insertUpdateExpense(expense, category){
    return $cordovaSQLite.execute(_db,
          'INSERT OR REPLACE INTO expenses (id, value, description, category_id) VALUES (?, ?, ?, ?)',
          [expense.id, expense.value, expense.description, category.id]);
  }

  function _getCategory(idCategory){
    return _data.categories.length ? _data.categories[idCategory] : {};
  }

  return {
    initDB: _initDB,
    getData: _data,
    getCategory: _getCategory
  };
}]);