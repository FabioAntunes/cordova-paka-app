'use strict';
angular.module('services')
.factory('DBFctr', ['ENV','$q', '$window', function (ENV, $q, $window) {
  var _dbUsers;
  var localDB;
  var remoteDB;
  var _user = undefined;
  var _categories = [];
  var sync = false;
  var data = {
    categories: [],
    categoryMap: {},
    total: 0
  };
  

  function initDB() {
    // Creates the database or opens if it already exists
    // $window.PouchDB.debug.enable('*');
    _dbUsers = new $window.PouchDB('users');
    localDB = new $window.PouchDB('paka');
    remoteDB = new $window.PouchDB(ENV.db+'/paka');
  }

  function login(user){
    return remoteDB.login('email_'+user.email, user.password).then(function(user){
      return addUser(user);
    });
  }

  function addUser(user){
    user._id = user.name;
    return $q.when(_dbUsers.get(user._id)
      .catch(function (err) {
        if (err.status === 404) { // not found!
          return _dbUsers.post(user).then(function(doc){
            return _dbUsers.get(doc.id);
          });
        } else { // hm, some other error
          throw err;
        }
      })
      .then(function (doc) {
        // update his age
        doc._id = user.name;
        // put him back
        return _dbUsers.put(doc);
      }).then(function () {
        // fetch mittens again
        return _dbUsers.get(user._id).then(function(doc){
          _user = doc;
          syncDB();

          return _user;
        });
      })
    );
  }

  function getUser(user){
    return $q.when(_dbUsers.get(user.id));
  }

  function getAppUser(){
    if(_user){
      return $q.when(_user);
    }else{
      return $q.when(
        _dbUsers.allDocs({include_docs : true, limit: 1}).then(function (result) {
          if (result.rows.length > 0) {
            syncDB();
            _user = result.rows[0].doc;
            return result.rows[0].doc;
          }else{
            throw err;
          }
        })
      );
      
    }
  }

  function logoutAppUser(){
    return getAppUser().then(function (result) {
        result._deleted = true;
        remoteDB.logout();
        // put him back
        return _dbUsers.put(result);
    })
        
  }

  function syncDB(forceSync, $scope){
    if(!sync || forceSync){
      localDB.sync(remoteDB, {
        retry: true,
        filter: 'app/by_user',
        query_params: { 'user': _user }
      }).on('change', function (info) {
        //
        console.log(info);
      }).on('paused', function () {
        // replication paused (e.g. user went offline)
        // loadData();
      }).on('active', function () {
        // replicate resumed (e.g. user went back online)
      }).on('denied', function (info) {
        // a document failed to replicate, e.g. due to permissions
        console.log(info);
      }).on('complete', function (info) {
        // handle complete
        console.log(info);
        if($scope){
          loadData().finally(function(){
            $scope.$broadcast('scroll.refreshComplete');
          });
        }else{
          loadData();          
        }
      }).on('error', function (err) {
        // handle error
        console.log(err);
        if($scope){
          loadData().finally(function(){
            $scope.$broadcast('scroll.refreshComplete');
          });
        }else{
          loadData();          
        }
      });

      sync = true;
    }
  }

  function getCategories(){
    return $q.when(
      localDB.query('categories/by_user', {
        startkey: [_user._id], 
        endkey: [_user._id, {}],
        include_docs: true
      })
    );
  }

  function getFriends(){
    return $q.when(
      localDB.query('friends/by_user', {
        startkey: [_user._id], 
        endkey: [_user._id, {}],
        include_docs: true
      })
    );
  }

  function getExpenses(){
    var dateObj = new Date();
    var year = dateObj.getUTCFullYear();
    var month = dateObj.getUTCMonth() + 1;
    return $q.when(
      localDB.query('expenses/by_date', {
        startkey: [_user._id, [year, month,null]], 
        endkey: [_user._id, [year, month, 31], {}],
        include_docs: true
      })
    );
  }

  function addDocument(document){
    return $q.when(getAppUser().then(function(user){
      document.user_id = user._id;
      localDB.post(document)})
    );
  }

  function updateDocument(document){
    return $q.when(getAppUser().then(function(user){
      document.user_id = user._id;
      localDB.put(document)})
    );
    return $q.when(localDB.put(document));
  }

  function loadData(){

    data.categories = [];
    data.friends = [];
    data.categoryMap = {};
    data.total = 0;

    return $q.when(getAppUser().then(function(user){
      _user = user;
      
      return getCategories().then(function(results){
        if (results.rows.length > 0) {
          for (var i = 0; i < results.rows.length; i++) {
            results.rows[i].doc.expenses = [];
            results.rows[i].doc.total = 0;
            data.categories.push(results.rows[i].doc);
            data.categoryMap[results.rows[i].doc._id] = i;
          }
          return data;
        }else{
          return [];
        }
      }).then(function(){
        return getFriends();
      }).then(function(friends){
        if (friends.rows.length > 0) {
          for (var i = 0; i < friends.rows.length; i++) {
            friends.rows[i].doc.friend_id = friends.rows[i].doc._id;
            data.friends.push(friends.rows[i].doc);
          }
          return data;
        }else{
          return [];
        }
      }).then(function(){
        return getExpenses();
      }).then(function(expenses){
        if (expenses.rows.length > 0) {
          var lastExpense = false;
          var shared;
          for (var i = 0; i < expenses.rows.length; i++) {

            if(!expenses.rows[i].doc){

              shared = lastExpense.shared[expenses.rows[i].key[4]];
              shared.type = 'me';
              shared.name = 'Me';
              lastExpense.shared[expenses.rows[i].key[4]] = shared;

              continue;

            }

            if(expenses.rows[i].doc.type === 'expense'){
                expenses.rows[i].doc.shared = expenses.rows[i].doc.shared ? expenses.rows[i].doc.shared : [];
                
                if(lastExpense){
                  data.categories[data.categoryMap[lastExpense.category_id]].expenses.push(lastExpense);
                  data.categories[data.categoryMap[lastExpense.category_id]].total +=  lastExpense.value * 100;
                  data.total +=  lastExpense.value * 100;
                }
                
                lastExpense = expenses.rows[i].doc;

                continue;
            }

            if(expenses.rows[i].doc.type === 'friend'){

                shared = lastExpense.shared[expenses.rows[i].key[4]];
                shared.type = 'friend';
                shared.name = expenses.rows[i].doc.name;
                shared.email = expenses.rows[i].doc.email;
                lastExpense.shared[expenses.rows[i].key[4]] = shared;

                continue;
            }
          }

          data.categories[data.categoryMap[lastExpense.category_id]].expenses.push(lastExpense);
          data.categories[data.categoryMap[lastExpense.category_id]].total +=  lastExpense.value * 100;
          data.total +=  lastExpense.value * 100;

          return data;
        }else{
          return [];
        }
        
      }).catch(function(err){
        console.log(err);
      });
    }));
  }

  function destroyDB(){
    _dbUsers.destroy();
    localDB.destroy();
  }

  return {
    initDB: initDB,
    syncDB: syncDB,
    destroyDB: destroyDB,
    loadData: loadData,
    addUser: addUser,
    addDocument: addDocument,
    updateDocument: updateDocument,
    getData: data,
    getAppUser: getAppUser,
    getUser: getUser,
    getFriends: getFriends,
    login: login,
    logoutAppUser: logoutAppUser
  };
}]);